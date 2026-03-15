CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  nombre_libro VARCHAR(255) NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  correo_ucab VARCHAR(255) NOT NULL UNIQUE CHECK (correo_ucab ILIKE '%@est.ucab.edu.ve'),
  fecha_reserva TIMESTAMP DEFAULT NOW(),
  fecha_entrega TIMESTAMP NOT NULL
);