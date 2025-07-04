# 📦 SimpliTEC - Backend

Este es el backend oficial del sistema **SimpliTEC**, una plataforma para gestión de concesionarios, vehículos, publicaciones, accesorios y leads.

> Este backend está desarrollado con **Node.js**, **Express**, **Prisma** y **PostgreSQL**, y se ejecuta fácilmente con **Docker**.

---

## 🚀 Tecnologías principales

- Node.js 18
- Express
- Prisma ORM
- PostgreSQL
- JWT Auth
- Cloudinary (para imágenes)
- Docker / Docker Compose

---

## 📁 Estructura del proyecto

```
├── prisma/               # Migraciones y schema.prisma
├── src/                  # Código fuente del backend
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   └── index.js
├── Dockerfile            # Backend Dockerfile
├── docker-compose.yml    # Compose para backend + PostgreSQL
├── .env                  # Variables de entorno (local)
├── package.json
└── README.md
```

---

## 🔧 Requisitos

- Docker y Docker Compose instalados ✅

---

## 🛠️ Configuración inicial (con Docker)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/simplitec-backend.git
cd simplictec-backend
```

### 2. Crear archivo `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/simplictec_db
JWT_SECRET=supersecret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Podés dejar los valores de Cloudinary vacíos si no los vas a usar aún.


### 3. Levantar los contenedores

```bash
docker-compose up --build
```

Esto va a:
- Crear un contenedor `simplictec_db` (PostgreSQL)
- Crear un contenedor `simplictec_backend` (Node.js)
- Aplicar las migraciones (`prisma migrate deploy`)
- Crear automáticamente un usuario admin

### 4. Backend activo en:

```
http://localhost:3001
```

---

## 👤 Usuario admin creado automáticamente

| Campo     | Valor                 |
|-----------|-----------------------|
| Email     | `admin@simplitec.com` |
| Contraseña| `admin123`            |
| Rol       | `ADMIN`               |

Podés iniciar sesión y obtener el token JWT desde el frontend o vía Postman:

```
POST /auth/login
{
  "email": "admin@simplitec.com",
  "password": "admin123"
}
```

---

## 📥 Comandos útiles

### 🔄 Reiniciar todo desde cero (solo para desarrollo):
```bash
docker-compose down -v
npx prisma migrate reset
```

### 🧱 Ver base de datos en navegador:
```bash
npx prisma studio
```

### 🛠 Volver a aplicar migraciones:
```bash
npx prisma migrate deploy
```

---

## 📦 Scripts disponibles (en `package.json`)

```json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js",
  "migrate": "prisma migrate dev",
  "deploy": "prisma migrate deploy",
  "studio": "prisma studio"
}
```

---

## 🧪 Endpoints principales (resumen)

- **/auth/login** → Login con JWT
- **/auth/register** → Registro de usuario
- **/vehicles** → CRUD de vehículos
- **/posts** → Publicaciones
- **/leads** → Leads (cotizaciones)
- **/accessories** → Accesorios

Todas las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

---

## 🧑‍💻 Contribución

1. Cloná el repo
2. Instalá dependencias
3. Usá Docker para levantar todo rápido
4. ¡Enviá tus mejoras con un pull request!

---

## 📬 Contacto

Para soporte o consultas: **lucasleiroa@gmail.com**

---

¡Gracias por usar **SimpliTEC Backend**! 🚗🔧
