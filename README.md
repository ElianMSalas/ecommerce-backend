# Ecommerce Backend API

API REST de un ecommerce construida con **Node.js**, **Express 5** y **PostgreSQL**. Incluye autenticación con JWT, gestión de productos, carrito de compras y pedidos con control de stock transaccional.

## Tabla de contenidos

- [Características](#características)
- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución con Docker](#ejecución-con-docker)
- [Ejecución local](#ejecución-local)
- [Tests](#tests)
- [Endpoints](#endpoints)
- [Decisiones técnicas](#decisiones-técnicas)

## Características

- Registro e inicio de sesión con contraseñas hasheadas (bcrypt) y JWT.
- Roles de usuario (`customer` / `admin`) con middleware de autorización.
- CRUD de productos con paginación, búsqueda y filtros por categoría y rango de precio.
- Carrito de compras por usuario con validación de stock.
- Creación de pedidos dentro de una **transacción SQL** con bloqueo de filas (`SELECT ... FOR UPDATE`) para evitar condiciones de carrera sobre el stock.
- Validación de entrada con `express-validator`.
- Seguridad básica con `helmet` y `cors`.
- Suite de tests automatizados con Jest y Supertest.

## Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Base de datos | PostgreSQL 16 |
| Auth | JSON Web Tokens, bcrypt |
| Validación | express-validator |
| Seguridad | helmet, cors |
| Logs | morgan |
| Tests | Jest, Supertest |
| Infra | Docker, Docker Compose |

## Arquitectura

El proyecto sigue una arquitectura por capas que separa responsabilidades:

    routes  ->  controllers  ->  services  ->  models  ->  PostgreSQL

- **routes**: definen los endpoints y encadenan middlewares (auth, validación).
- **controllers**: manejan la petición/respuesta HTTP y los códigos de estado.
- **services**: contienen la lógica de negocio (validaciones de stock, reglas).
- **models**: encapsulan el acceso a datos con consultas SQL parametrizadas.

Estructura de carpetas:

    src/
    ├── app.js              # configuración de Express y middlewares
    ├── server.js           # arranque del servidor
    ├── config/             # conexión a PostgreSQL
    ├── controllers/        # capa HTTP
    ├── services/           # lógica de negocio
    ├── models/             # acceso a datos
    ├── middlewares/        # auth, roles y validación
    └── routes/             # definición de rutas

## Requisitos

- [Docker](https://www.docker.com/) y Docker Compose, **o**
- Node.js 20+ y PostgreSQL 16+ instalados localmente.

## Instalación

```bash
git clone https://github.com/ElianMSalas/ecommerce-backend.git
cd ecommerce-backend
npm install
cp .env.example .env   # y completa los valores
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de la BD | `admin` |
| `DB_PASSWORD` | Contraseña de la BD | `admin123` |
| `DB_NAME` | Nombre de la BD | `ecommerce_db` |
| `JWT_SECRET` | Secreto para firmar tokens | `una_cadena_larga_y_aleatoria` |
| `JWT_EXPIRES_IN` | Expiración del token | `1d` |

## Ejecución con Docker

Levanta la API y la base de datos (con el esquema ya inicializado) en un solo comando:

```bash
docker compose up --build
```

La API queda disponible en `http://localhost:3000`. El archivo `db/init.sql` se ejecuta automáticamente al crear el contenedor de Postgres.

## Ejecución local

Con una instancia de PostgreSQL corriendo y el esquema cargado (`db/init.sql`):

```bash
npm run dev    # con recarga automática (nodemon)
npm start      # modo producción
```

Comprueba que está vivo:

```bash
curl http://localhost:3000/health
# { "status": "ok" }
```

## Tests

El proyecto incluye una suite de tests de integración con Jest y Supertest. Los tests **mockean la capa de acceso a datos**, por lo que no requieren una base de datos en ejecución.

```bash
npm test
```

Cubren el flujo de autenticación (registro, login, validación de entrada y manejo de credenciales inválidas) y el de productos (listado con paginación, detalle, y protección de rutas por rol de usuario).

## Endpoints

Base URL: `/api`. Las rutas marcadas con 🔒 requieren `Authorization: Bearer <token>`. Las marcadas con 👑 requieren rol `admin`.

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registra un usuario |
| POST | `/auth/login` | Inicia sesión y devuelve un token |

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Lista productos (`?page`, `?limit`, `?category`, `?search`, `?minPrice`, `?maxPrice`) |
| GET | `/products/:id` | Detalle de un producto |
| POST | `/products` 🔒👑 | Crea un producto |
| PUT | `/products/:id` 🔒👑 | Actualiza un producto |
| DELETE | `/products/:id` 🔒👑 | Elimina un producto |

### Carrito

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/cart` 🔒 | Ver el carrito |
| POST | `/cart/items` 🔒 | Agregar un producto (`productId`, `quantity`) |
| PUT | `/cart/items/:id` 🔒 | Actualizar cantidad de un item |
| DELETE | `/cart/items/:id` 🔒 | Eliminar un item |
| DELETE | `/cart` 🔒 | Vaciar el carrito |

### Pedidos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/orders` 🔒 | Crear un pedido a partir del carrito |
| GET | `/orders` 🔒 | Listar pedidos del usuario |
| GET | `/orders/:id` 🔒 | Detalle de un pedido |

### Ejemplo de uso

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","surname":"Perez","email":"ana@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"secret123"}'
```

## Decisiones técnicas

- **Transacciones en pedidos**: la creación de un pedido descuenta stock dentro de una transacción con `SELECT ... FOR UPDATE`, garantizando consistencia si varios usuarios compran el mismo producto a la vez.
- **Consultas parametrizadas**: todo el acceso a datos usa parámetros (`$1, $2...`) para prevenir inyección SQL.
- **Errores con código de estado**: los servicios lanzan errores con una propiedad `statusCode` que los controllers traducen a respuestas HTTP.
- **Separación en capas**: routes → controllers → services → models, lo que facilita testear y mantener cada parte de forma aislada.
- **Tests con mocks**: la suite mockea la capa de modelos para correr de forma rápida y aislada, sin depender de una base de datos real.
- **Contenedor no-root**: el `Dockerfile` ejecuta la app con el usuario `node` en lugar de root, siguiendo buenas prácticas de seguridad.

## Posibles mejoras futuras

- Rate limiting en el login y manejador de errores global centralizado.
- Refresh tokens y revocación.
- Estados de pedido y pasarela de pago.
- Integración continua (CI) que ejecute los tests en cada push.
- Documentación OpenAPI/Swagger.