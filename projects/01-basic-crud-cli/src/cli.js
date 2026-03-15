const readline = require('readline');
const { createReserva, getReservas, getReservasPorCorreo, updateReserva, deleteReserva } = require('./reserva');
const pool = require('./db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function pregunta(text) {
  return new Promise((resolve) => {
    rl.question(text, (answer) => resolve(answer.trim()));
  });
}

function validarCorreo(correo) {
  return correo.toLowerCase().endsWith('@est.ucab.edu.ve');
}

function mostrarReservas(reservas) {
  if (!reservas || reservas.length === 0) {
    console.log('⚠️  No hay reservas aún.');
    return;
  }

  console.log('📋 Reservas encontradas:');
  reservas.forEach((r) => {
    console.log(`  [id:${r.id}] ${r.nombre_libro} — ${r.nombre_usuario} (${r.correo_ucab})`);
    console.log(`       reservado: ${r.fecha_reserva} | entrega: ${r.fecha_entrega}`);
  });
}

async function crearReservaFlow() {
  const nombre_libro = await pregunta('📘 Nombre del libro: ');
  const nombre_usuario = await pregunta('👤 Nombre del usuario: ');
  const correo_ucab = await pregunta('📧 Correo UCAB (ej: ejemplo@est.ucab.edu.ve): ');

  const result = await createReserva({ nombre_libro, nombre_usuario, correo_ucab });
  if (result.status !== 200) {
    console.log(`${result.status} - ${result.error}`);
    return;
  }

  console.log('✅ Reserva creada:', result.data);
}

async function listarReservasFlow() {
  const result = await getReservas();
  if (result.status !== 200) {
    console.log(`${result.status} - ${result.error}`);
    return;
  }
  mostrarReservas(result.data);
}

async function buscarPorCorreoFlow() {
  const correo = await pregunta('📧 Ingresa correo UCAB para buscar reservas: ');
  const result = await getReservasPorCorreo(correo);
  if (result.status !== 200) {
    console.log(`${result.status} - ${result.error}`);
    return [];
  }
  mostrarReservas(result.data);
  return result.data;
}

async function actualizarReservaFlow() {
  const correo = await pregunta('📧 Ingresa el correo UCAB de la reserva a actualizar: ');
  if (!validarCorreo(correo)) {
    console.log('❌ Correo inválido. Debe terminar en @est.ucab.edu.ve.');
    return;
  }

  const reservas = await getReservasPorCorreo(correo);
  if (reservas.status !== 200 || reservas.data.length === 0) {
    console.log('❌ No se encontró reserva para ese correo.');
    return;
  }

  const reserva = reservas.data[0]; // Solo una por UNIQUE
  console.log('📋 Reserva actual:', reserva);

  const nombre_libro = await pregunta('📘 Nuevo nombre de libro (ENTER para mantener): ');
  const nombre_usuario = await pregunta('👤 Nuevo nombre de usuario (ENTER para mantener): ');
  let nuevo_correo = await pregunta('📧 Nuevo correo UCAB (ENTER para mantener): ');

  if (nuevo_correo && !validarCorreo(nuevo_correo)) {
    console.log('❌ Nuevo correo inválido. Cancelando actualización.');
    return;
  }

  const payload = {};
  if (nombre_libro) payload.nombre_libro = nombre_libro;
  if (nombre_usuario) payload.nombre_usuario = nombre_usuario;
  if (nuevo_correo) payload.correo_ucab = nuevo_correo;

  if (Object.keys(payload).length === 0) {
    console.log('❌ No se proporcionaron cambios.');
    return;
  }

  const result = await updateReserva(reserva.id, payload);
  if (result.status !== 200) {
    console.log(`${result.status} - ${result.error}`);
    return;
  }

  console.log('✅ Reserva actualizada:', result.data);
}

async function eliminarReservaFlow() {
  const correo = await pregunta('📧 Ingresa el correo UCAB de la reserva a eliminar: ');
  if (!validarCorreo(correo)) {
    console.log('❌ Correo inválido. Debe terminar en @est.ucab.edu.ve.');
    return;
  }

  const reservas = await getReservasPorCorreo(correo);
  if (reservas.status !== 200 || reservas.data.length === 0) {
    console.log('❌ No se encontró reserva para ese correo.');
    return;
  }

  const reserva = reservas.data[0]; // Solo una por UNIQUE
  console.log('📋 Reserva a eliminar:', reserva);

  const confirm = await pregunta('¿Estás seguro de eliminar esta reserva? (sí/no): ');
  if (confirm.toLowerCase() !== 'sí' && confirm.toLowerCase() !== 'si') {
    console.log('❌ Eliminación cancelada.');
    return;
  }

  const result = await deleteReserva(reserva.id);
  if (result.status !== 200) {
    console.log(`${result.status} - ${result.error}`);
    return;
  }

  console.log('✅ Reserva eliminada:', result.data);
}

function imprimirMenu() {
  console.log('\n=== MENÚ DE RESERVAS DE BIBLIOTECA UCAB ===');
  console.log('1) Crear reserva');
  console.log('2) Listar todas las reservas');
  console.log('3) Editar reserva (por correo UCAB)');
  console.log('4) Eliminar reserva (por correo UCAB)');
  console.log('0) Salir');
}

async function runCli() {
  let running = true;
  while (running) {
    imprimirMenu();
    const opcion = await pregunta('> ');

    switch (opcion.trim()) {
      case '1':
        await crearReservaFlow();
        break;
      case '2':
        await listarReservasFlow();
        break;
      case '3':
        await actualizarReservaFlow();
        break;
      case '4':
        await eliminarReservaFlow();
        break;
      case '0':
        running = false;
        break;
      default:
        console.log('Opción no válida. Elige 0-4.');
    }
  }

  console.log('👋 Cerrando...');
  rl.close();
  await pool.end();
}

module.exports = { runCli };
