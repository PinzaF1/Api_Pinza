import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'form_estudiante'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idform_estudiante') // serial PK

      table.integer('idtesteaxe').notNullable()
           .references('idtesteaxe').inTable('testeaxe')
           .onDelete('CASCADE')               // si se borra el test, se borran sus respuestas

      table.specificType('idpregunta_ea', 'smallint').notNullable()
           .references('idpregunta_ea').inTable('pregunta_ea')
           .onDelete('RESTRICT')

      table.string('valor', 45).nullable()  // 1..4 como string (si lo prefieres int, usa smallint)
      table.specificType('valorx', 'smallint').nullable()
      table.specificType('valory', 'smallint').nullable()

      // Evita duplicar la misma pregunta dentro del mismo test
      table.unique(['idtesteaxe', 'idpregunta_ea'])

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
