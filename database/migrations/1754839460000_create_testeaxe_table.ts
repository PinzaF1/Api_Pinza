import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'testeaxe'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('idtesteaxe') // serial PK

      table.integer('idestudiante').notNullable()
           .references('idestudiante').inTable('estudiante')
           .onDelete('CASCADE')        // si borras estudiante, se borran sus tests

      table.date('fecha_presentacion').notNullable()

      table.string('estilo_aprendizaje', 45).nullable()
      table.integer('idestilos_aprendizaje').nullable()
           .references('idestilos_aprendizaje').inTable('estilos_aprendizaje')
           .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
