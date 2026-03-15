const pool = require('./db');
const fs = require('fs');

async function createTable() {
  try {
    // Si la tabla ya existía con un constraint diferente, la borramos para recrearla.
    await pool.query('DROP TABLE IF EXISTS reservas;');

    const sql = fs.readFileSync(__dirname + '/create-table.sql', 'utf8');
    await pool.query(sql);
    console.log('200 OK: Tabla "reservas" creada exitosamente.');
  } catch (err) {
    console.error('500 Internal Server Error: Error al crear tabla:', err.message);
  } finally {
    pool.end();
  }
}

createTable();