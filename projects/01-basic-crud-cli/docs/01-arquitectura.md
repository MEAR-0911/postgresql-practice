# Arquitectura del Proyecto: CLI para Gestión de Reservas de Biblioteca UCAB

## Plan Técnico
- **Lenguaje y Framework:** Node.js puro (sin framework web, ya que es un CLI). Usamos librerías como `pg` para PostgreSQL y `readline` para interfaz de terminal.
- **Arquitectura General:** CLI ejecutable en terminal que simula operaciones CRUD de una API REST. El programa presenta un menú interactivo, maneja input del usuario, ejecuta queries a PostgreSQL, y devuelve respuestas con códigos HTTP-like (200 OK, 400 Bad Request, etc.) para claridad educativa.
- **Funcionalidades Clave:**
  - **Crear Reserva:** Solicita nombre_libro, nombre_usuario, correo_ucab (valida formato @est.ucab.edu.ve). Calcula fecha_entrega automáticamente (fecha_reserva + 7 días).
  - **Leer Reservas:** Lista todas las reservas; si no hay, mensaje "No hay reservas aún".
  - **Actualizar Reserva:** Busca la reserva por correo_ucab (el sistema asume que hay solo una reserva por correo). Permite editar nombre_libro, nombre_usuario o correo_ucab. El correo se valida en el CLI antes de consultar para evitar errores de constraint y no se requiere identificar la reserva por ID.
  - **Eliminar Reserva:** Busca la reserva por correo_ucab, muestra el registro y pide confirmación antes de eliminar.
  - **Manejo de Errores:** Captura errores de PostgreSQL (e.g., violación de CHECK, unicidad) y los mapea a mensajes claros con códigos HTTP-like, explicando qué significa cada uno (e.g., 400: "Datos inválidos - El correo debe terminar en @est.ucab.edu.ve").
- **Buenas Prácticas de PostgreSQL (de skills/postgres/skill.md):** 
  - Usar transacciones para operaciones atómicas (evita estados inconsistentes).
  - Indexación en campos de búsqueda (correo_ucab, fecha_entrega) para optimizar queries.
  - Tipos de datos precisos (VARCHAR con límites, TIMESTAMP para fechas).
  - Pooling de conexiones con `pg.Pool` para eficiencia y evitar agotamiento.
  - Validaciones en BD (CHECK constraints) y en código (Node.js).
- **Dependencias:** `pg` (cliente PostgreSQL), `dotenv` (variables de entorno), `readline` (incluido en Node.js).
- **Seguridad:** Credenciales en `.env`, no hardcodeadas. Conexión SSL si es necesario.

## Modelo de Datos
- **Tabla: `reservas`** (simple, enfocada en CRUD básico).
  - `id` (SERIAL PRIMARY KEY): ID único auto-incremental.
  - `nombre_libro` (VARCHAR(255) NOT NULL): Nombre del libro reservado.
  - `nombre_usuario` (VARCHAR(255) NOT NULL): Nombre del usuario que reserva.
  - `correo_ucab` (VARCHAR(255) NOT NULL UNIQUE CHECK (correo_ucab ILIKE '%@est.ucab.edu.ve')): Correo UCAB válido. Se garantiza unicidad para que un usuario tenga una sola reserva activa.
  - `fecha_reserva` (TIMESTAMP DEFAULT NOW()): Fecha de creación automática.
  - `fecha_entrega` (TIMESTAMP NOT NULL): Calculada como fecha_reserva + 7 días.
- **Relaciones:** Ninguna (tabla independiente).
- **Índices Recomendados:** 
  - `CREATE INDEX idx_correo_ucab ON reservas(correo_ucab);` (para búsquedas rápidas por correo).
  - `CREATE INDEX idx_fecha_entrega ON reservas(fecha_entrega);` (para queries por fechas).

## Estructura de Archivos Recomendada
```
projects/01-basic-crud-cli/
├── docs/
│   └── 01-arquitectura.md          # Este documento (plan técnico)
├── src/
│   ├── db.js                       # Conexión a PostgreSQL con pooling
│   ├── reserva.js                  # Modelo con queries CRUD
│   ├── cli.js                      # Interfaz de terminal (menú y prompts)
│   └── index.js                    # Punto de entrada
├── .env                            # Variables de entorno (credenciales BD)
├── package.json                    # Dependencias y scripts
├── create-table.sql                # Script para crear tabla (ejecutado una vez)
└── README.md                       # Instrucciones de uso
```

## Próximos Pasos
1. Instalar dependencias con `npm install`.
2. Crear `.env` con credenciales de BD.
3. Implementar `src/db.js` para conexión.
4. Crear tabla con `create-table.sql`.
5. Implementar `src/reserva.js` con queries CRUD y validaciones de error.
6. Crear `src/cli.js` para interfaz.
7. Unir todo en `src/index.js` y probar.

Este plan asegura un aprendizaje paso a paso de PostgreSQL con Node.js, enfocándonos en CRUD y manejo de errores.