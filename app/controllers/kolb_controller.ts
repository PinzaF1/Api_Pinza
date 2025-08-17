// app/controllers/kolb_controller.ts
import KolbService from '../service/kolb_service.js'
const kolb = new KolbService()

export default class KolbController {
  // Catálogos
  estilos = async ({ response }) => response.json(await kolb.listarEstilos())
  preguntas = async ({ response }) => response.json(await kolb.listarPreguntas())
  preguntasBloques = async ({ response }) => response.json(await kolb.preguntasPorBloque())

  // Estudiantes
  crearEstudiante = async ({ request, response }) => {
    const { nombres_e, apellidos_e, nombres, apellidos } = request.all()

    const data = {
      nombres_e: (nombres_e ?? nombres ?? '').trim(),
      apellidos_e: (apellidos_e ?? apellidos ?? '').trim(),
    }

    if (!data.nombres_e || !data.apellidos_e) {
      return response.badRequest({ msj: 'nombres_e y apellidos_e son obligatorios' })
    }

    try {
      const est = await kolb.crearEstudiante(data)
      return response.created({ msj: 'Estudiante creado', estudiante: est })
    } catch (err: any) {
      console.error('crearEstudiante error:', err?.message, err)
      return response.internalServerError({ msj: 'No se pudo crear el estudiante' })
    }
  }

  estudiantes = async ({ response }) => response.json(await kolb.listarEstudiantes())

  estudiante = async ({ params, response }) =>
    response.json(
      (await kolb.estudianteConEstiloActual(Number(params.id_estudiante))) ??
        { msj: 'No encontrado' }
    )

  // Test
  responderYCalcular = async ({ request, response }) => {
    // Acepta id_estudiante o idestudiante (por si el front envía cualquiera)
    const idEst = Number(
      request.input('id_estudiante') ?? request.input('idestudiante')
    )
    const fecha_presentacion = request.input('fecha_presentacion')
    const respuestas = request.input('respuestas')

    if (!idEst || !Array.isArray(respuestas) || respuestas.length === 0) {
      return response.badRequest({ msj: 'id_estudiante y respuestas son obligatorios' })
    }

    const res = await kolb.registrarRespuestasYCalcularEstilo({
      id_estudiante: idEst,
      fecha_presentacion,
      respuestas,
    })
    return response.json(res)
  }

  resultado = async ({ params, response }) =>
    response.json(
      (await kolb.ultimoResultado(Number(params.id_estudiante))) ??
        { msj: 'Sin resultados' }
    )
}
