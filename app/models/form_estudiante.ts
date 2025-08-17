import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Testeaxe from './testeaxe.js'
import PreguntaEa from './pregunta_ea.js'

export default class FormEstudiante extends BaseModel {
  public static table = 'form_estudiante'

  @column({ isPrimary: true }) declare idform_estudiante: number
  @column() declare idtesteaxe: number
  @column() declare idpregunta_ea: number
  @column() declare valor: string | null
  @column() declare valorx: number | null
  @column() declare valory: number | null

  @belongsTo(() => Testeaxe, { foreignKey: 'idtesteaxe' })
  declare test: BelongsTo<typeof Testeaxe>

  @belongsTo(() => PreguntaEa, { foreignKey: 'idpregunta_ea' })
  declare pregunta: BelongsTo<typeof PreguntaEa>

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime
}
