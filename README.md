# QZMotorCenterElectroBike

Microservicio para la gestion de motocicletas electricas de QZ Motor Center.

## Objetivo del microservicio

Este microservicio permite:

- Registrar marcas de motocicletas electricas.
- Registrar modelos `ElectroBike` asociados a una marca.
- Consultar el catalogo completo o filtrarlo.
- Consultar una unidad por id.
- Actualizar la informacion de una `ElectroBike`.
- Eliminar una `ElectroBike`.
- Obtener un resumen del catalogo con metricas agregadas.

## Tecnologias usadas

- `Node.js`
- `TypeScript`
- `Express`
- `Sequelize`
- `MySQL 8`
- `Docker` y `Docker Compose`
- `Vitest` para pruebas unitarias

## Arquitectura del microservicio

La aplicacion sigue una arquitectura por capas para separar responsabilidades:

- `routes`: expone los endpoints REST.
- `controllers`: recibe la solicitud HTTP y construye la respuesta.
- `services`: contiene la logica de negocio y validaciones.
- `repositories`: encapsula el acceso a datos con Sequelize.
- `models`: define las entidades relacionales.
- `config`: centraliza la conexion a base de datos.

```mermaid
flowchart LR
  Cliente["Cliente REST"] --> API["Express API"]
  API --> Rutas["Routes"]
  Rutas --> Controladores["Controllers"]
  Controladores --> Servicios["Services"]
  Servicios --> Repositorios["Repositories"]
  Repositorios --> ORM["Sequelize ORM"]
  ORM --> DB[("MySQL 8")]
```

## Modelo relacional

El modelo relacional se compone de dos entidades:

- `marcas`: almacena fabricantes o marcas.
- `electrobikes`: almacena los modelos electricos asociados a una marca.

Relacion:

- Una `marca` puede tener muchas `electrobikes`.
- Cada `electrobike` pertenece a una sola `marca`.

```mermaid
erDiagram
  MARCAS ||--o{ ELECTROBIKES : tiene

  MARCAS {
    INT id PK
    VARCHAR nombre UK
    VARCHAR pais
    INT anioFundacion
    VARCHAR sitioWeb
    DATETIME createdAt
    DATETIME updatedAt
  }

  ELECTROBIKES {
    INT id PK
    INT marcaId FK
    VARCHAR modelo
    ENUM categoria
    INT capacidadBateriaWh
    DECIMAL autonomiaKm
    DECIMAL velocidadMaximaKmh
    DECIMAL tiempoCargaHoras
    DECIMAL precio
    INT stock
    ENUM estado
    VARCHAR fotoUrl
    DATETIME createdAt
    DATETIME updatedAt
  }
```

## Como se aprovecha la asincronia

El proyecto usa asincronia de forma real y no solo decorativa:

- Todas las operaciones HTTP estan implementadas con `async/await`.
- La conexion, autenticacion y sincronizacion con MySQL son asincronas.
- Los accesos a repositorio usan operaciones no bloqueantes de Sequelize.
- En `ElectroBikeService.create()` se usa `Promise.all()` para validar en paralelo:
  - existencia de la marca
  - duplicidad de modelo por marca
- En `ElectroBikeService.getCatalogSummary()` se usa `Promise.all()` para consultar en paralelo:
  - total de electrobikes
  - total disponibles
  - precio promedio
  - total de marcas
  - distribucion por estado

Eso permite aprovechar mejor el tiempo de espera de I/O y hace que el microservicio sea mas eficiente bajo carga.

## Estructura del proyecto

```text
src/
  app.ts
  server.ts
  config/
    database.ts
  controllers/
    BrandController.ts
    ElectroBikeController.ts
  errors/
    AppError.ts
  middlewares/
    errorHandler.ts
  models/
    Marca.ts
    ElectroBike.ts
    index.ts
  repositories/
    BrandRepository.ts
    ElectroBikeRepository.ts
    interfaces/
      IBrandRepository.ts
      IElectroBikeRepository.ts
  routes/
    brandRoutes.ts
    electroBikeRoutes.ts
    index.ts
  services/
    BrandService.ts
    ElectroBikeService.ts
  types/
    domain.ts
  utils/
    asyncHandler.ts
    validators.ts

tests/
  unit/
    services/
      BrandService.test.ts
      ElectroBikeService.test.ts
```

## Endpoints disponibles

### Salud del servicio

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/api/health` | Verifica que la API este activa |

### Marcas

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/api/marcas` | Lista todas las marcas |
| `POST` | `/api/marcas` | Crea una marca |

### ElectroBikes

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/api/electrobikes` | Lista todas las electrobikes |
| `GET` | `/api/electrobikes?marcaId=1&estado=disponible` | Filtra por marca o estado |
| `GET` | `/api/electrobikes?minAutonomiaKm=90&maxPrecio=30000` | Filtra por autonomia o precio |
| `GET` | `/api/electrobikes/resumen` | Devuelve metricas del catalogo |
| `GET` | `/api/electrobikes/:id` | Consulta una electrobike por id |
| `POST` | `/api/electrobikes` | Crea una electrobike |
| `PUT` | `/api/electrobikes/:id` | Actualiza una electrobike |
| `DELETE` | `/api/electrobikes/:id` | Elimina una electrobike |

## Ejemplos de payload

### Crear marca

`POST /api/marcas`

```json
{
  "nombre": "Zero Motorcycles",
  "pais": "Estados Unidos",
  "anioFundacion": 2006,
  "sitioWeb": "https://zeromotorcycles.com"
}
```

### Crear ElectroBike

`POST /api/electrobikes`

```json
{
  "marcaId": 1,
  "modelo": "DSR/X",
  "categoria": "doble_proposito",
  "capacidadBateriaWh": 17200,
  "autonomiaKm": 180,
  "velocidadMaximaKmh": 180,
  "tiempoCargaHoras": 3.5,
  "precio": 42000,
  "stock": 4,
  "estado": "disponible",
  "fotoUrl": "https://example.com/dsrx.png"
}
```

## Variables de entorno

El proyecto incluye `.env.example` y una copia local `.env` para facilitar pruebas.

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `3000` |
| `DB_DIALECT` | Motor relacional a usar | `mysql` o `postgres` |
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `DB_NAME` | Nombre de la base de datos | `qz_electrobike` |
| `DB_USER` | Usuario de la base de datos | `electrobike_user` |
| `DB_PASSWORD` | Clave del usuario de la base de datos | `electrobike_pass` |
| `DB_AUTO_CREATE` | Si la API intenta crear la base | `false` |
| `DB_SSL` | Si se fuerza SSL para la conexion | `false` |
| `DATABASE_URL` | Cadena completa de conexion, util en Render | `postgresql://...` |
| `MYSQL_ROOT_PASSWORD` | Password root del contenedor MySQL | `root_secret` |

## Ejecucion local

1. Instalar dependencias:

```bash
npm install
```

2. Levantar una base MySQL.

Opcion recomendada para desarrollo local:

```bash
docker compose up -d db
```

Si prefieres una instalacion local de MySQL, debes asegurarte de que este escuchando en `localhost:3306` con las credenciales del archivo `.env`.

3. Ejecutar en desarrollo:

```bash
npm run dev
```

4. Compilar:

```bash
npm run build
```

5. Ejecutar version compilada:

```bash
npm start
```

## Ejecucion con Docker

1. Levantar base de datos y API:

```bash
docker compose up --build
```

2. Detener contenedores:

```bash
docker compose down
```

3. Eliminar tambien el volumen:

```bash
docker compose down -v
```

## Despliegue en Render

La opcion recomendada para este proyecto es:

- `Web Service` usando el `Dockerfile` del repositorio
- `Render Postgres` como base de datos relacional administrada

Esto ya queda preparado en [render.yaml](/C:/Users/shado/Documents/GitHub/QZMotorCenterElectroBike/render.yaml).

### Por que esta opcion es la recomendada

Render ofrece PostgreSQL administrado de forma nativa, mientras que MySQL en Render normalmente implica desplegarlo como un servicio Docker separado. Para simplificar operacion, backups y conexion interna, el proyecto ahora soporta `PostgreSQL` en Render y mantiene `MySQL` para desarrollo local.

### Pasos para desplegarlo

1. Sube este repositorio a GitHub.
2. En Render, elige `New +` -> `Blueprint`.
3. Conecta el repositorio que contiene este proyecto.
4. Render detectara el archivo `render.yaml`.
5. Acepta la creacion de estos recursos:
   - web service `qzmotorcenter-electrobike-api`
   - database `qzmotorcenter-electrobike-db`
6. Espera el primer deploy.
7. Cuando termine, abre la URL publica del servicio y prueba:

```text
/api/health
```

### Configuracion que usa Render

- El servicio web se despliega con `runtime: docker`.
- Render asigna `PORT`, y la API ya escucha correctamente en `0.0.0.0`.
- `DATABASE_URL` se inyecta desde la base Postgres creada por Render.
- `DB_DIALECT=postgres` ya queda definido en el `render.yaml`.

### Si prefieres seguir con MySQL en Render

Segun la documentacion oficial de Render, MySQL puede desplegarse como `Private Service` con Docker y disco persistente, usando una URL interna tipo `mysql-foo:3306`. Aun asi, para este proyecto recomiendo Postgres en Render porque reduce complejidad operativa y encaja mejor con Blueprints y bases administradas.

## Pruebas unitarias

Las pruebas unitarias se concentran en la capa de servicios para validar la logica de negocio sin depender de una base real.

Casos cubiertos:

- creacion correcta de una marca
- deteccion de marca duplicada
- creacion correcta de una electrobike
- error cuando la marca no existe
- generacion correcta del resumen asincrono del catalogo

Comando:

```bash
npm test
```

## Validaciones ejecutadas sobre este proyecto

Durante la construccion del microservicio se validaron estos comandos:

- `npm run build`
- `npm run check`
- `npm test`
- `docker compose --env-file .env.example config`

## Resumen tecnico final

El microservicio cumple con los requisitos solicitados:

- esta basado en la logica del proyecto de referencia
- usa asincronia con `async/await` y `Promise.all()`
- esta dockerizado
- incluye pruebas unitarias
- usa una base de datos relacional
- documenta la arquitectura y el modelo de datos en el `README`

Si se desea ampliar despues, el siguiente paso natural seria agregar autenticacion, paginacion, migraciones formales y pruebas de integracion.
