# RecetasApp — Backend API

REST API para una aplicación de gestión de recetas de cocina, desarrollada como Obligatorio 1 de Desarrollo Fullstack en la Universidad ORT Uruguay.

## Descripción

API que permite a los usuarios registrarse, gestionar sus recetas, categorías, ingredientes y reseñas. Incluye integración con Inteligencia Artificial (Google Gemini 2.5 Flash) para generar y adaptar recetas automáticamente, y almacenamiento de imágenes en Cloudinary. La API está versionada en `/V1` y desplegada en Vercel.

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| Node.js | — | Runtime |
| Express | 5.x | Framework HTTP |
| MongoDB | — | Base de datos |
| Mongoose | 9.x | ODM |
| JSON Web Token | 9.x | Autenticación |
| Joi | 18.x | Validación de datos |
| BcryptJS | 3.x | Hash de contraseñas |
| Multer | 2.x | Manejo de archivos |
| Cloudinary | 2.x | Almacenamiento de imágenes |
| express-rate-limit | 8.x | Rate limiting (OWASP) |
| Axios | 1.x | Consumo de API de Gemini |
| dotenv | 17.x | Variables de entorno |

## Arquitectura

```
OBLIGATORIO_FULLSTACK/
├── app.js                  # Configuración de Express, CORS, middlewares globales
├── server.js               # Entry point
├── vercel.json             # Configuración de deploy
└── V1/
    ├── index.js            # Router principal V1
    ├── config/
    │   ├── db.js           # Conexión a MongoDB
    │   └── cloudinary.js   # Configuración de Cloudinary
    ├── controllers/        # Lógica HTTP (recibe req, llama a service, devuelve res)
    ├── services/           # Lógica de negocio
    ├── models/             # Schemas de Mongoose
    ├── routes/             # Definición de rutas
    ├── middlewares/        # Autorización, validación, rate limit, errores
    ├── validators/         # Schemas de Joi
    └── utils/              # Helpers (cloudinary, multer, números)
```

## Endpoints

**Base URL:** `https://obligatorio-fullstack-six.vercel.app/V1`

### Rutas desprotegidas (sin token)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registro de usuario (roles: `user` / `admin`) |
| `POST` | `/auth/login` | Login — devuelve JWT |

### Rutas protegidas (requieren `Authorization: Bearer <token>`)

#### Recetas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/recetas` | Listar recetas del usuario (paginado, con filtros) |
| `GET` | `/recetas/combinadas` | Listar recetas con datos de API externa |
| `GET` | `/recetas/:id` | Obtener receta por ID |
| `POST` | `/recetas` | Crear receta (imagen opcional via multipart) |
| `POST` | `/recetas/ia` | Generar receta con Gemini AI |
| `POST` | `/recetas/:id/adaptar` | Adaptar receta existente con Gemini AI |
| `PATCH` | `/recetas/:id` | Actualizar receta |
| `DELETE` | `/recetas/:id` | Eliminar receta |

#### Categorías

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/categorias` | Listar categorías |
| `GET` | `/categorias/:id` | Obtener categoría por ID |
| `POST` | `/categorias` | Crear categoría |
| `PATCH` | `/categorias/:id` | Actualizar categoría |
| `DELETE` | `/categorias/:id` | Eliminar categoría |

#### Ingredientes

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/ingredientes` | Listar ingredientes |
| `POST` | `/ingredientes` | Crear ingrediente |
| `PATCH` | `/ingredientes/:id` | Actualizar ingrediente |
| `DELETE` | `/ingredientes/:id` | Eliminar ingrediente |

#### Reviews

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/reviews` | Listar reviews |
| `POST` | `/reviews` | Crear review |
| `PATCH` | `/reviews/:id` | Actualizar review |
| `DELETE` | `/reviews/:id` | Eliminar review |

#### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/usuarios` | Listar usuarios |
| `PATCH` | `/usuarios/:id/plan` | Cambiar plan de `plus` a `premium` |

#### Uploads

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/uploads` | Subir imagen a Cloudinary |

## Modelos principales

### Usuario
```js
{
  nombre:        String,
  correo:        String (unique),
  contrasenia:   String (hashed con BcryptJS),
  plan:          "plus" | "premium",   // plus por defecto
  rol:           "user" | "admin",
  fechaCreacion: Date
}
```

### Receta
```js
{
  titulo:          String (unique),
  descripcion:     String,
  ingredientes:    [String],
  pasos:           [String],
  autor:           String (correo del usuario),
  autorNombre:     String,
  dificultad:      "Fácil" | "Media" | "Difícil",
  categoria:       ObjectId -> Categoria,
  reviews:         [ObjectId -> Review],
  imagen:          String (URL Cloudinary),
  fechaDeCreacion: Date
}
```

## Sistema de planes

- **Plus** (asignado por defecto al registrarse): máximo **4 recetas** por usuario.
- **Premium**: recetas **ilimitadas**.
- El usuario con rol `user` puede cambiar su plan de plus a premium.
- Los usuarios con rol `admin` no gestionan planes.

## Integración con IA

Utiliza **Google Gemini 2.5 Flash** para dos flujos:

- **Generar receta** (`POST /recetas/ia`): dado un conjunto de ingredientes y una dificultad, Gemini genera una receta completa en JSON y la persiste en la base de datos. Si la respuesta llega en inglés, un segundo prompt la traduce al español automáticamente.
- **Adaptar receta** (`POST /recetas/:id/adaptar`): toma una receta existente y la convierte a una variante indicada (ej: vegana, sin gluten, sin lactosa). El resultado se guarda como nueva receta.

Si Gemini no está disponible, la aplicación devuelve el error correspondiente sin interrumpir otros flujos.

## Variables de entorno

Crear un archivo `.env` en la raíz:

```env
MONGODB_URI=<connection_string>
JWT_SECRET=<secret>
CLOUDINARY_CLOUD_NAME=<nombre>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
GEMINI_25_API_KEY=<key>
PORT=3000
```

## Instalación y uso local

```bash
# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Producción
npm start
```

La API quedará disponible en `http://localhost:3000/V1`.

## Testing con Postman

La colección incluye todos los endpoints organizados por carpetas, con:

- Tests automatizados por status code para cada request.
- Variable de colección `prod_base_url` apuntando a la URL de producción.
- Flujos encadenados (registro → login → CRUD de recetas → cambio de plan → generación con IA).

## Seguridad (OWASP Top 10 API)

- Autenticación JWT en todas las rutas protegidas.
- Hash de contraseñas con BcryptJS.
- Validación estricta de entrada con Joi en todos los endpoints.
- Rate limiting global con `express-rate-limit`.
- CORS configurado para orígenes permitidos explícitamente.
- Middleware de manejo de errores centralizado.
- No se permiten campos vacíos ni usuarios duplicados.
