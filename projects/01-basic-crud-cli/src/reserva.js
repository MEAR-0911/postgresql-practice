const pool = require('./db');

/**
 * Crea una reserva en la base de datos.
 * @param {{ nombre_libro: string, nombre_usuario: string, correo_ucab: string }} datos
 * @returns {Promise<object>} La fila insertada.
 */
async function createReserva(datos) {
  const { nombre_libro, nombre_usuario, correo_ucab } = datos;

  const sql = `
    INSERT INTO reservas (nombre_libro, nombre_usuario, correo_ucab, fecha_entrega)
    VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')
    RETURNING *;
  `;

  try {
    const result = await pool.query(sql, [nombre_libro, nombre_usuario, correo_ucab]);
    return { status: 200, data: result.rows[0] };
  } catch (err) {
    if (err.code === '23514') { // CHECK constraint violation
      return { status: 400, error: 'Correo UCAB inválido. Debe terminar en @est.ucab.edu.ve' };
    }
    return { status: 500, error: 'Error interno de base de datos: ' + err.message };
  }
}

/**
 * Obtiene todas las reservas.
 * @returns {Promise<object>} Lista de reservas.
 */
async function getReservas() {
  const sql = `SELECT * FROM reservas ORDER BY fecha_reserva DESC;`;
  try {
    const result = await pool.query(sql);
    return { status: 200, data: result.rows };
  } catch (err) {
    return { status: 500, error: 'Error al leer reservas: ' + err.message };
  }
}

/**
 * Obtiene reservas filtradas por correo UCAB.
 * @param {string} correo_ucab
 * @returns {Promise<object>}
 */
async function getReservasPorCorreo(correo_ucab) {
  const sql = `SELECT * FROM reservas WHERE correo_ucab = $1 ORDER BY fecha_reserva DESC;`;
  try {
    const result = await pool.query(sql, [correo_ucab]);
    return { status: 200, data: result.rows };
  } catch (err) {
    return { status: 500, error: 'Error al leer reservas por correo: ' + err.message };
  }
}

/**
 * Actualiza una reserva por su id.
 * @param {number} id
 * @param {{ nombre_libro?: string, nombre_usuario?: string, correo_ucab?: string }} datos
 * @returns {Promise<object>}
 */
async function updateReserva(id, datos) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (datos.nombre_libro) {
    fields.push(`nombre_libro = $${idx++}`);
    values.push(datos.nombre_libro);
  }
  if (datos.nombre_usuario) {
    fields.push(`nombre_usuario = $${idx++}`);
    values.push(datos.nombre_usuario);
  }
  if (datos.correo_ucab) {
    fields.push(`correo_ucab = $${idx++}`);
    values.push(datos.correo_ucab);
  }

  if (fields.length === 0) {
    return { status: 400, error: 'No se proporcionaron campos a actualizar.' };
  }

  // Recalcular fecha_entrega cada vez que se actualiza la reserva
  fields.push(`fecha_entrega = NOW() + INTERVAL '7 days'`);

  const sql = `
    UPDATE reservas
    SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING *;
  `;
  values.push(id);

  try {
    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      return { status: 404, error: 'Reserva no encontrada.' };
    }
    return { status: 200, data: result.rows[0] };
  } catch (err) {
    if (err.code === '23514') {
      return { status: 400, error: 'Correo UCAB inválido. Debe terminar en @est.ucab.edu.ve' };
    }
    return { status: 500, error: 'Error al actualizar reserva: ' + err.message };
  }
}

/**
 * Elimina una reserva por su id.
 * @param {number} id
 * @returns {Promise<object>}
 */
async function deleteReserva(id) {
  const sql = `DELETE FROM reservas WHERE id = $1 RETURNING *;`;
  try {
    const result = await pool.query(sql, [id]);
    if (result.rowCount === 0) {
      return { status: 404, error: 'Reserva no encontrada.' };
    }
    return { status: 200, data: result.rows[0] };
  } catch (err) {
    return { status: 500, error: 'Error al eliminar reserva: ' + err.message };
  }
}

module.exports = {
  createReserva,
  getReservas,
  getReservasPorCorreo,
  updateReserva,
  deleteReserva,
};
