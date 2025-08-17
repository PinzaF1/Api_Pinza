// config/database.ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const useUrl = !!env.get('DATABASE_URL')

// SSL sólo si usas la External URL de Render y pones DB_SSL=true
const sslEnabled =
  String(env.get('DB_SSL', 'false')).toLowerCase() === 'true'
    ? { rejectUnauthorized: false }
    : false

export default defineConfig({
  // Debe coincidir con la clave dentro de "connections"
  connection: 'postgres',

  connections: {
    postgres: {
      client: 'pg',
      // Cuando hay DATABASE_URL (producción en Render) usamos connectionString
      // y metemos "ssl" DENTRO del objeto de conexión para evitar problemas de tipos
      connection: useUrl
        ? {
            connectionString: env.get('DATABASE_URL'),
            ssl: sslEnabled,
          }
        : {
            host: env.get('DB_HOST', '127.0.0.1'),
            port: Number(env.get('DB_PORT', '5432')),
            user: env.get('DB_USER', 'postgres'),
            password: env.get('DB_PASSWORD', ''),
            database: env.get('DB_DATABASE', 'Api'),
            ssl: false,
          },

      // Pool pequeño para Render (evita agotar conexiones)
      pool: {
        min: 0,
        max: Number(env.get('DB_POOL_MAX', '5')),
      },

      // Ruta y orden de migraciones (puede quedarse aquí)
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})
