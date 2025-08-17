import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Estudiante from './estudiante.js'
import EstilosAprendizaje from './estilos_aprendizaje.js'
import FormEstudiante from './form_estudiante.js'

export default class Testeaxe extends BaseModel {
  public static table = 'testeaxe'

  @column({ isPrimary: true }) declare idtesteaxe: number
  @column() declare idestudiante: number
  
  @column({columnName: "nombre"})
  declare nombres_e: string

  @column({columnName: "apellido"})
  declare apellidos_e: string
  @column() declare fecha_presentacion: string // date
  @column() declare estilo_aprendizaje: string | null
  @column() declare idestilos_aprendizaje: number | null

  @belongsTo(() => Estudiante, { foreignKey: 'idestudiante' })
  declare estudiante: BelongsTo<typeof Estudiante>

  @belongsTo(() => EstilosAprendizaje, { foreignKey: 'idestilos_aprendizaje' })
  declare estilo: BelongsTo<typeof EstilosAprendizaje>

  @hasMany(() => FormEstudiante, { foreignKey: 'idtesteaxe' })
  declare respuestas: HasMany<typeof FormEstudiante>

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
