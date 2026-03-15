# Estado Actual del Proyecto - PostgreSQL Practice

## Objetivo Actual
Configurar y levantar una base de datos PostgreSQL versión 15 usando Docker Compose para prácticas de aprendizaje en bases de datos relacionales. El setup incluye credenciales básicas y persistencia de datos.

## Estado del Código
- **Archivos creados/modificados recientemente:**
  - `docker/docker-compose.yml`: Archivo de configuración para Docker Compose que define el servicio PostgreSQL con:
    - Imagen: postgres:15
    - Variables de entorno: POSTGRES_USER=admin, POSTGRES_PASSWORD=admin123, POSTGRES_DB=practicadb
    - Puerto expuesto: 5432
    - Volumen para persistencia: postgres_data
  - `projects/01-basic-crud-cli/`:
    - `src/db.js`: Conexión a PostgreSQL usando `pg.Pool` y `.env`.
    - `src/create-table.sql` + `src/create-table.js`: Script que crea (y recrea) la tabla `reservas` con constraint de correo UCAB único y validación de formato.
    - `src/reserva.js`: Lógica CRUD para reservas (create/read/update/delete), validación de errores y búsquedas por correo.
    - `src/cli.js`: CLI interactivo con menú, validación de correo, creación/consulta/edición/eliminación sin pedir ID.
    - `src/index.js`: Punto de entrada para ejecutar el CLI.
  - El contenedor está corriendo en segundo plano (docker-postgres-1).

- **Estructura del proyecto:**
  - `docker/`: Contiene el docker-compose.yml
  - `projects/`: Carpeta con subproyectos (01-basic-crud-cli, 02-advanced-api)
  - `agent/`: Configuración del agente (agent.md)
  - `skills/`: Conocimiento modularizado

## Errores Pendientes
- Ninguno actualmente. El CLI y las funciones CRUD han sido probadas exitosamente con el flujo de demo.
- El proyecto ha sido configurado para validar el correo UCAB en el CLI, y la tabla `reservas` usa `UNIQUE` en `correo_ucab` para evitar múltiples reservas por usuario.

## Próximo Paso
Para continuar, el usuario puede:
1. Ejecutar el CLI con `node src/index.js` desde `projects/01-basic-crud-cli/` y probar los flujos de creación, consulta, edición y eliminación.
2. Opcional: Agregar más validaciones (por ejemplo, límite máximo de caracteres) o extender el modelo de datos con entidades adicionales (libros, usuarios, etc.).
3. Si se desea, crear tests unitarios para las funciones CRUD en `src/reserva.js`.

Instrucción para retomar: Leer este archivo, verificar que el contenedor de PostgreSQL sigue corriendo con `docker ps`, y ejecutar el CLI `node src/index.js` en `projects/01-basic-crud-cli/` para interactuar con el sistema de reservas.