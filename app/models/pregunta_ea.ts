import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import FormEstudiante from './form_estudiante.js'

export default class PreguntaEa extends BaseModel {
  public static table = 'pregunta_ea'

  @column({ isPrimary: true })
  declare idpregunta_ea: number // smallint

  @column() declare pregunta_ea: string
  @column() declare titulo: string
  @column() declare pregunta_escol: string

  @hasMany(() => FormEstudiante, { foreignKey: 'idpregunta_ea' })
  declare respuestas: HasMany<typeof FormEstudiante>

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
