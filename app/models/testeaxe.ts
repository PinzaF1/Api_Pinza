import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Estudiante from './estudiante.js'
import EstilosAprendizaje from './estilos_aprendizaje.js'

export default class Testeaxe extends BaseModel {
  public static table = 'testeaxe'
  public static primaryKey = 'idtesteaxe'

  @column({ isPrimary: true })
  declare idtesteaxe: number

  @column()
  declare fecha_presentacion: string

  @column()
  declare estilo_aprendizaje: string | null

  // Campo tal como está en la migración
  @column({ columnName: 'idestudiante' })
  declare idestudiante: number

  // Campo tal como está en la migración
  @column({ columnName: 'idestilos_aprendizaje' })
  declare idestilos_aprendizaje: number | null

  @belongsTo(() => Estudiante, { foreignKey: 'idestudiante' })
  declare estudiante: BelongsTo<typeof Estudiante>

  @belongsTo(() => EstilosAprendizaje, { foreignKey: 'idestilos_aprendizaje' })
  declare estilo: BelongsTo<typeof EstilosAprendizaje>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
