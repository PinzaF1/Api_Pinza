// database/migrations/1754839450000_create_pregunta_ea_table.ts
import {BaseSchema} from '@adonisjs/lucid/schema'

export default class PreguntaEa extends BaseSchema {
  protected tableName = 'pregunta_ea'

  public async up () {
    if (await this.schema.hasTable(this.tableName)) return

    this.schema.createTable(this.tableName, (table) => {
      // SMALLSERIAL PK (por compatibilidad con tu diagrama)
      table.specificType('idpregunta_ea', 'SMALLSERIAL').primary()
      table.string('pregunta', 200).notNullable()
      table.string('titulo', 45).notNullable()
      table.string('pregunta_escol', 45).nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
