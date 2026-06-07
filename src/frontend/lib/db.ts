import { Pool, QueryResult } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:KynzTJwlTObLYqzh@db.qcstxdbrtkzzipjrvwmy.supabase.co:5432/postgres';

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    // Log in development or staging
    if (process.env.NODE_ENV !== 'production') {
      console.log('executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}
