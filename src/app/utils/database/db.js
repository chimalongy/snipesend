import { Pool } from 'pg';

// const pool = new Pool({
//   // user: 'postgres',
//   // host: 'localhost',
//   // database: 'snipesend',
//   // password: '1',
//   // port: 5432, // default PostgreSQL port


// host:"aws-0-us-east-1.pooler.supabase.com",
// port:"6543",
// database:"postgres",
// user:"postgres.ywuigxwzpmwlgyxodmih",
// pool_mode:"transaction",
// password:"@Chimsyboy2275"

// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required by Supabase
  },
});

export default pool;
