const pool = require('./db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('200 OK: Conexión exitosa a PostgreSQL. Fecha/hora actual:', res.rows[0].now);
  } catch (err) {
    console.error('500 Internal Server Error: Error al conectar a PostgreSQL:', err.message);
  } finally {
    pool.end(); // Cierra el pool al finalizar
  }
}

testConnection();