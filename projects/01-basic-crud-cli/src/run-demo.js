const { createReserva, getReservas, getReservasPorCorreo, updateReserva, deleteReserva } = require('./reserva');

async function run() {
  console.log('--- Creando reserva de prueba ---');
  const create = await createReserva({
    nombre_libro: 'Cien años de soledad',
    nombre_usuario: 'Manu',
    correo_ucab: 'manu@est.ucab.edu.ve',
  });
  console.log(create);

  console.log('--- Listando reservas ---');
  const all = await getReservas();
  console.log(all);

  console.log('--- Buscando por correo ---');
  const porCorreo = await getReservasPorCorreo('manu@est.ucab.edu.ve');
  console.log(porCorreo);

  if (porCorreo.data && porCorreo.data.length > 0) {
    const id = porCorreo.data[0].id;
    console.log('--- Actualizando reserva ---');
    const updated = await updateReserva(id, { nombre_libro: 'El Principito' });
    console.log(updated);

    console.log('--- Eliminando reserva ---');
    const deleted = await deleteReserva(id);
    console.log(deleted);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error('Error en demo:', err);
  process.exit(1);
});