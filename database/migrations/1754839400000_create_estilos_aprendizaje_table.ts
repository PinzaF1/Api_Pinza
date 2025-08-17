// database/migrations/1754839400000_create_estilos_aprendizaje_table.ts
import {BaseSchema} from '@adonisjs/lucid/schema'

export default class EstilosAprendizaje extends BaseSchema {
  protected tableName = 'estilos_aprendizaje'

  public async up () {
    if (await this.schema.hasTable(this.tableName)) return

    this.schema.createTable(this.tableName, (table) => {
      table.increments('idestilos_aprendizaje') // SERIAL PK
      table.string('estilo', 45).notNullable().unique() // ACOMODADOR, DIVERGENTE, ...
      table.text('descripcion').nullable()
      table.text('caracteristicas').nullable()
      table.text('recomendaciones').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    await this.schema.dropTableIfExists(this.tableName)
  }
}
