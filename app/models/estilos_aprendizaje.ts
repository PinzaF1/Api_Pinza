import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Testeaxe from './testeaxe.js'

export default class EstilosAprendizaje extends BaseModel {
  public static table = 'estilos_aprendizaje'

  @column({ isPrimary: true })
  declare idestilos_aprendizaje: number

  @column() declare estilo: string
  @column() declare descripcion: string | null
  @column() declare caracteristicas: string | null
  @column() declare recomendaciones: string | null

  @column.dateTime({ autoCreate: true }) declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) declare updatedAt: DateTime

  @hasMany(() => Testeaxe, { foreignKey: 'idestilos_aprendizaje' })
  declare tests: HasMany<typeof Testeaxe>
}
