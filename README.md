# 📦 SimpliTEC - Backend

Este es el backend oficial del sistema **SimpliTEC**, una plataforma para gestión de concesionarios, vehículos, publicaciones, accesorios y leads.

> Este backend está desarrollado con **Node.js**, **Express**, **Prisma** y **PostgreSQL**, y puede ejecutarse con o sin Docker.

---

## 🚀 Tecnologías principales

- Node.js 18
- Express
- Prisma ORM
- PostgreSQL
- JWT Auth
- Cloudinary (para imágenes)
- Docker (opcional)

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
├── Dockerfile (opcional)
├── docker-compose.yml    # Servicios opcionales: PostgreSQL, Redis
├── .env                  # Variables de entorno
├── package.json
└── README.md
```

---

## 🔧 Requisitos

- Node.js >= 18
- Docker y Docker Compose (solo si lo usás)

---

## 🚀 FLUJO COMPLETO PARA LEVANTAR EL BACKEND (MODO LOCAL)

### 1. 📥 Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/simplictec-backend.git
cd simplictec-backend
```

---

### 2. ⚙️ Instalar dependencias

```bash
npm install
```

---

### 3. 🧪 Crear el archivo `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplictec_db
PORT=3001

CLOUDINARY_CLOUD_NAME=deyja2bgv
CLOUDINARY_API_KEY=321482273426451
CLOUDINARY_API_SECRET=sj2kGEouf4knlTT9UWPFRKpZAPM

JWT_SECRET=mi_super_clave_secreta_123456789

MAIL_USER=lucasleiroa@gmail.com
MAIL_PASS=ghbv vzjh cqns eion

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

> 🔐 Asegurate de tener PostgreSQL y Redis corriendo (por Docker o servicios locales)

---

### 4. 🧱 Ejecutar comandos de Prisma

```bash
npx prisma generate
npx prisma migrate deploy
```

---

### 5. ▶️ Levantar el servidor

```bash
npm run dev
```

Esto iniciará tanto el backend como el worker de leads. El backend correrá en:

```
http://localhost:3001
```

---

### ✅ Usuario admin creado automáticamente (por migración)

| Campo     | Valor                 |
|-----------|-----------------------|
| Email     | `admin@simplitec.com` |
| Contraseña| `admin123`            |
| Rol       | `ADMIN`               |

Podés hacer login con:

```http
POST http://localhost:3001/auth/login
{
  "email": "admin@simplitec.com",
  "password": "admin123"
}
```

---

## 📥 Comandos útiles

- Regenerar cliente Prisma:
```bash
npx prisma generate
```

- Aplicar migraciones:
```bash
npx prisma migrate deploy
```

- Ver base de datos:
```bash
npx prisma studio
```

---

## 📦 Scripts disponibles (en `package.json`)

```json
"scripts": {
  "dev": "concurrently \"npm run dev:api\" \"npm run start:worker\"",
  "dev:api": "nodemon src/index.js",
  "start": "node src/index.js",
  "start:worker": "node src/workers/leadWorker.js"
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
3. Configurá `.env`
4. Aplicá migraciones
5. Ejecutá `npm run dev`

---

## 📬 Contacto

Para soporte o consultas: **lucasleiroa@gmail.com**

---

¡Gracias por usar **SimpliTEC Backend**! 🚗🔧
