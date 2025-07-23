import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'snipesend',
  password: '1',
  port: 5432, // default PostgreSQL port
});

export default pool;
