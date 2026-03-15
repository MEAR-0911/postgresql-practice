const { createReserva, getReservas, updateReserva, deleteReserva } = require('../src/reserva');

jest.mock('../src/db', () => ({
  query: jest.fn(),
}));

const pool = require('../src/db');

describe('reserva.js (mocked DB)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createReserva devuelve status 200 y datos cuando la query es exitosa', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1, nombre_libro: 'Libro', nombre_usuario: 'Manu', correo_ucab: 'manu@est.ucab.edu.ve' }] });

    const result = await createReserva({ nombre_libro: 'Libro', nombre_usuario: 'Manu', correo_ucab: 'manu@est.ucab.edu.ve' });

    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty('id', 1);
  });

  test('createReserva devuelve status 400 cuando falla constraint de correo', async () => {
    const error = new Error('CHECK violation');
    error.code = '23514';
    pool.query.mockRejectedValue(error);

    const result = await createReserva({ nombre_libro: 'Libro', nombre_usuario: 'Manu', correo_ucab: 'manu@est.ucab.edu' });

    expect(result.status).toBe(400);
    expect(result.error).toContain('Correo UCAB inválido');
  });

  test('getReservas devuelve la lista de reservas', async () => {
    pool.query.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });

    const result = await getReservas();

    expect(result.status).toBe(200);
    expect(result.data).toHaveLength(2);
  });

  test('updateReserva devuelve 404 si no existe la reserva', async () => {
    pool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    const result = await updateReserva(999, { nombre_libro: 'Test' });

    expect(result.status).toBe(404);
  });

  test('deleteReserva devuelve 200 cuando se elimina', async () => {
    pool.query.mockResolvedValue({ rowCount: 1, rows: [{ id: 1 }] });

    const result = await deleteReserva(1);

    expect(result.status).toBe(200);
  });
});