import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let connection: ReturnType<typeof drizzle> | null = null;

export function getDatabase() {
  if (!connection) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    connection = drizzle(pool, { schema });
  }

  return connection;
}

export const db = getDatabase();