# api-mobile

API REST sencilla construida con Node.js, Express y PostgreSQL. Incluye autenticacion mediante login (JWT) y tres modulos: usuarios, clientes y productos. El modulo de productos permite subir una imagen que se guarda en el servidor y se expone mediante una URL publica.

## Estructura del proyecto

```
api-mobile/
├── server.js                 # Punto de entrada
├── database.sql              # Script de creacion de tablas
├── .env.example               # Variables de entorno de ejemplo
├── uploads/
│   └── productos/             # Imagenes de productos subidas
└── src/
    ├── app.js                 # Configuracion de Express
    ├── config/
    │   └── db.js               # Conexion (pool) a PostgreSQL
    ├── middleware/
    │   ├── auth.js              # Verificacion de JWT
    │   └── upload.js             # Configuracion de multer para imagenes
    ├── models/
    │   ├── usuarioModel.js
    │   ├── clienteModel.js
    │   └── productoModel.js
    ├── controllers/
    │   ├── authController.js     # Login
    │   ├── usuarioController.js
    │   ├── clienteController.js
    │   └── productoController.js
    └── routes/
        ├── authRoutes.js
        ├── usuarioRoutes.js
        ├── clienteRoutes.js
        └── productoRoutes.js
```

## Requisitos

- Node.js 18+
- PostgreSQL 12+

## Instalacion

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear la base de datos en PostgreSQL:

   ```sql
   CREATE DATABASE api_mobile;
   ```

3. Ejecutar el script `database.sql` sobre esa base de datos para crear las tablas:

   ```bash
   psql -U postgres -d api_mobile -f database.sql
   ```

4. Copiar `.env.example` a `.env` y ajustar los valores (usuario, password y nombre de la base de datos, secreto de JWT, etc.):

   ```bash
   cp .env.example .env
   ```

5. Iniciar el servidor:

   ```bash
   npm start
   # o en modo desarrollo (recarga automatica)
   npm run dev
   ```

El servidor quedara disponible en `http://localhost:3000` (o el puerto que definas en `.env`).

## Autenticacion

Todas las rutas de `clientes` y `productos`, y la mayoria de las de `usuarios`, requieren un token JWT. El token se obtiene haciendo login y se envia en cada peticion protegida mediante el header:

```
Authorization: Bearer <token>
```

## Endpoints

### Usuarios / Autenticacion

| Metodo | Ruta                  | Protegido | Descripcion                          |
|--------|-----------------------|-----------|---------------------------------------|
| POST   | `/api/usuarios`       | No        | Registra un nuevo usuario (username, password) |
| POST   | `/api/auth/login`     | No        | Login. Body: `{ "username", "password" }`. Devuelve un token JWT |
| GET    | `/api/usuarios`       | Si        | Lista todos los usuarios |
| GET    | `/api/usuarios/:id`   | Si        | Obtiene un usuario por id |
| DELETE | `/api/usuarios/:id`   | Si        | Elimina un usuario |

Ejemplo de registro:

```json
POST /api/usuarios
{
  "username": "admin",
  "password": "123456"
}
```

Ejemplo de login:

```json
POST /api/auth/login
{
  "username": "admin",
  "password": "123456"
}
```

Respuesta:

```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": 1, "username": "admin" }
}
```

### Clientes (todas las rutas requieren token)

| Metodo | Ruta                 | Descripcion |
|--------|----------------------|-------------|
| POST   | `/api/clientes`      | Crea un cliente |
| GET    | `/api/clientes`      | Lista todos los clientes |
| GET    | `/api/clientes/:id`  | Obtiene un cliente por id |
| PUT    | `/api/clientes/:id`  | Actualiza un cliente |
| DELETE | `/api/clientes/:id`  | Elimina un cliente |

Body de ejemplo (JSON):

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "numero_identificacion": "V-12345678",
  "telefono": "04121234567"
}
```

### Productos (todas las rutas requieren token)

| Metodo | Ruta                  | Descripcion |
|--------|-----------------------|-------------|
| POST   | `/api/productos`      | Crea un producto (soporta imagen) |
| GET    | `/api/productos`      | Lista todos los productos |
| GET    | `/api/productos/:id`  | Obtiene un producto por id |
| PUT    | `/api/productos/:id`  | Actualiza un producto (soporta imagen) |
| DELETE | `/api/productos/:id`  | Elimina un producto (y su imagen) |

Para crear/actualizar un producto con imagen, la peticion debe enviarse como `multipart/form-data`, con los campos:

- `nombre` (texto)
- `marca` (texto)
- `stock` (numero)
- `precio` (numero)
- `imagen` (archivo: jpg, jpeg, png, gif o webp, maximo 5MB)

Ejemplo con `curl`:

```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Authorization: Bearer <token>" \
  -F "nombre=Camisa" \
  -F "marca=Nike" \
  -F "stock=10" \
  -F "precio=25.99" \
  -F "imagen=@/ruta/a/imagen.jpg"
```

La respuesta incluye el campo `imagen` con la URL publica del archivo guardado, por ejemplo:

```json
{
  "id": 1,
  "nombre": "Camisa",
  "marca": "Nike",
  "stock": 10,
  "precio": "25.99",
  "imagen": "http://localhost:3000/uploads/productos/producto_1699999999999_123456789.jpg"
}
```

Esa URL puede usarse directamente en un `<img src="...">` o en la app movil para mostrar la imagen.

## Notas

- Las contrasenas de usuarios se guardan encriptadas con bcrypt, nunca en texto plano.
- El token JWT expira segun `JWT_EXPIRES_IN` (por defecto 8 horas).
- Las imagenes se sirven de forma estatica desde `/uploads/productos`.
- Ajusta `BASE_URL` en `.env` si despliegas el servidor en un dominio distinto de `localhost`, para que las URLs de las imagenes sean correctas.
