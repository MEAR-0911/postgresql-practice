# 01-basic-crud-cli

CLI de ejemplo para gestionar reservas de biblioteca (UCAB) usando PostgreSQL.

## Requisitos
- Node.js 18+ (o similar)
- Docker (para levantar PostgreSQL con Docker Compose)

## Configuración inicial
1. Levanta Postgres con Docker Compose:
   ```bash
   cd docker
   docker-compose up -d
   ```
2. Crea el archivo `.env` en `projects/01-basic-crud-cli/`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=admin
   DB_PASSWORD=admin123
   DB_NAME=practicadb
   ```
3. Instala dependencias:
   ```bash
   cd projects/01-basic-crud-cli/package
   npm install
   ```

## Uso
Desde `projects/01-basic-crud-cli/package`:

```bash
npm start
```

El CLI permitirá:
- Crear una reserva (se valida que el correo termine en `@est.ucab.edu.ve`)
- Listar todas las reservas
- Actualizar una reserva (buscando por correo UCAB)
- Eliminar una reserva (buscando por correo UCAB)

## Pruebas unitarias
Se usa Jest para ejecutar tests básicos de lógica.

```bash
npm test
```

## Archivo de esquema
La tabla `reservas` se crea mediante `src/create-table.sql` y su creación se puede ejecutar con:

```bash
node src/create-table.js
```

---

> Nota: El archivo `.env` está en `.gitignore` para evitar subir credenciales.
