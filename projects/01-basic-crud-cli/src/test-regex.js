require('dotenv').config({ path: __dirname + '/../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function test() {
  const sql = "SELECT ($1 ~* $2) AS match";
  const values = ['manu@est.ucab.edu.ve', '@est\\.ucab\\.edu\\.ve$'];
  try {
    const res = await pool.query(sql, values);
    console.log('result:', res.rows);
  } catch (err) {
    console.error('error:', err);
  } finally {
    await pool.end();
  }
}

test();