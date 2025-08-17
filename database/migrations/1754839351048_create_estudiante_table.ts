import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'estudiante'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idestudiante') // serial PK
      table.string('nombres_e', 45).notNullable()
      table.string('apellidos_e', 45).notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
