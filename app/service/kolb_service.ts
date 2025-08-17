// @ts-nocheck
import db from '@adonisjs/lucid/services/db'
import EstilosAprendizaje from '../models/estilos_aprendizaje.js'
import PreguntaEa from '../models/pregunta_ea.js'
import FormEstudiante from '../models/form_estudiante.js'
import Testeaxe from '../models/testeaxe.js'

type RespuestaIn = { id_pregunta_ea: number; valor: number }

// 1..4 -> vector (x,y)
function mapChoice(n: number) {
  switch (n) {
    case 1: return { x: -1, y:  1 }
    case 2: return { x:  1, y:  1 }
    case 3: return { x: -1, y: -1 }
    case 4: return { x:  1, y: -1 }
    default: return { x: 0, y: 0 }
  }
}

function cuadrante(sumX: number, sumY: number): string {
  if (sumX < 0 && sumY > 0) return 'DIVERGENTE'
  if (sumX > 0 && sumY > 0) return 'ASIMILADOR'
  if (sumX > 0 && sumY < 0) return 'CONVERGENTE'
  if (sumX < 0 && sumY < 0) return 'ACOMODADOR'
  return 'INDETERMINADO'
}

const norm = (s: string) =>
  (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim()

const ORDER = [
  'EXPERIENCIA CONCRETA',
  'OBSERVACION REFLEXIVA',
  'CONCEPTUALIZACION ABSTRACTA',
  'EXPERIMENTACION ACTIVA',
] as const

const CODE: Record<string, 'EC' | 'OR' | 'CA' | 'EA'> = {
  'EXPERIENCIA CONCRETA': 'EC',
  'OBSERVACION REFLEXIVA': 'OR',
  'CONCEPTUALIZACION ABSTRACTA': 'CA',
  'EXPERIMENTACION ACTIVA': 'EA',
}

// Tipos de filas para los rawQuery
type PreguntaRow = {
  idpregunta_ea: number
  pregunta_ea: string
  pregunta_escol: string
  titulo: string | null
}

type EstudianteListRow = {
  idestudiante: number
  nombres_e: string
  apellidos_e: string
  created_at: string
  updated_at: string
  estilo_actual: string | null
  fecha: string | null
}

type EstudianteOneRow = EstudianteListRow

export default class KolbService {
  // ===== Catálogos =====
  listarEstilos() {
    return EstilosAprendizaje.query().orderBy('idestilos_aprendizaje', 'asc')
  }

  listarPreguntas() {
    return PreguntaEa.query().orderBy('idpregunta_ea', 'asc')
  }

  /** Preguntas agrupadas por bloque (pregunta_escol) */
  async preguntasPorBloque() {
    const { rows } = await db.rawQuery<PreguntaRow>(`
      SELECT idpregunta_ea, pregunta_ea, pregunta_escol, titulo
      FROM public.pregunta_ea
      ORDER BY pregunta_escol ASC, idpregunta_ea ASC
    `)

    type Bloque = {
      codigo: 'EC' | 'OR' | 'CA' | 'EA'
      nombre: string
      preguntas: Array<{ idpregunta_ea: number; titulo: string | null; texto: string }>
    }

    const map = new Map<string, Bloque>()

    for (const r of rows) {
      const nombreRaw = (r.pregunta_escol ?? '').toString()
      const key = norm(nombreRaw)
      if (!map.has(key)) {
        map.set(key, { codigo: CODE[key] ?? 'EC', nombre: nombreRaw.trim(), preguntas: [] })
      }
      map.get(key)!.preguntas.push({
        idpregunta_ea: Number(r.idpregunta_ea),
        titulo: r.titulo ?? null,
        texto: r.pregunta_ea,
      })
    }

    const ordered = ORDER.filter((k) => map.has(k)).map((k) => map.get(k)!)
    return ordered.length ? ordered : Array.from(map.values())
  }

  // ===== Estudiantes =====
  async crearEstudiante(data: { nombres_e: string; apellidos_e: string }) {
    const sql = `
      INSERT INTO public.estudiante (nombres_e, apellidos_e)
      VALUES (?, ?)
      RETURNING *
    `
    // Si quieres tipar la fila exacta, puedes crear otro tipo.
    const { rows } = await db.rawQuery<any>(sql, [data.nombres_e, data.apellidos_e])
    return rows[0]
  }

  async listarEstudiantes() {
    const sql = `
      select 
        e.idestudiante,
        e.nombres_e,
        e.apellidos_e,
        e.created_at,
        e.updated_at,
        lt.estilo_aprendizaje as estilo_actual,
        lt.created_at        as fecha
      from estudiante e
      left join (
        select distinct on (idestudiante)
               idestudiante, estilo_aprendizaje, created_at
        from testeaxe
        order by idestudiante, created_at desc
      ) lt on lt.idestudiante = e.idestudiante
      order by e.idestudiante
    `
    const { rows } = await db.rawQuery<EstudianteListRow>(sql)
    return rows
  }

  async estudianteConEstiloActual(id_estudiante: number) {
    const sql = `
      select 
        e.idestudiante,
        e.nombres_e,
        e.apellidos_e,
        e.created_at,
        e.updated_at,
        lt.estilo_aprendizaje as estilo_actual,
        lt.created_at        as fecha
      from estudiante e
      left join (
        select distinct on (idestudiante)
               idestudiante, estilo_aprendizaje, created_at
        from testeaxe
        where idestudiante = ?
        order by idestudiante, created_at desc
      ) lt on lt.idestudiante = e.idestudiante
      where e.idestudiante = ?
      limit 1
    `
    const { rows } = await db.rawQuery<EstudianteOneRow>(sql, [id_estudiante, id_estudiante])
    return rows[0] ?? null
  }

  // ===== Guardado del test + estilo =====
  async registrarRespuestasYCalcularEstilo(params: {
    id_estudiante: number
    fecha_presentacion?: string
    respuestas: RespuestaIn[]
  }) {
    const { id_estudiante, respuestas } = params
    const fecha_presentacion =
      params.fecha_presentacion || new Date().toISOString().slice(0, 10)

    let sumX = 0, sumY = 0
    const filas = respuestas.map((r) => {
      const idp = Number(r.id_pregunta_ea)
      const val = Math.max(1, Math.min(4, Number(r.valor)))
      const { x, y } = mapChoice(val)
      sumX += x; sumY += y
      return { idpregunta_ea: idp, valor: String(val), valorx: x, valory: y }
    })

    const estiloNombre = cuadrante(sumX, sumY)
    const estiloRow = await EstilosAprendizaje.query()
      .where('estilo', estiloNombre)
      .first()

    const test = await db.transaction(async (trx) => {
      const t = await Testeaxe.create({
        idestudiante: id_estudiante,
        fecha_presentacion,
        idestilos_aprendizaje: estiloRow?.idestilos_aprendizaje ?? null,
        estilo_aprendizaje: estiloRow?.estilo ?? estiloNombre,
      }, { client: trx })

      const toInsert = filas.map((f) => ({ ...f, idtesteaxe: t.idtesteaxe }))
      await FormEstudiante.createMany(toInsert, { client: trx })
      return t
    })

    return { test, estilo: test.estilo_aprendizaje, vector: { sumX, sumY } }
  }

  async ultimoResultado(id_estudiante: number) {
    return Testeaxe.query()
      .where('idestudiante', id_estudiante)
      .orderBy('created_at', 'desc')
      .first()
  }
}
