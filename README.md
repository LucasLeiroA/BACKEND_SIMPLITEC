# 🚀 SimpliTEC - Backend

Este proyecto corresponde al backend del sistema **SimpliTEC**, desarrollado en **Node.js** con **Express**, **Prisma**, **PostgreSQL**, **Redis** y **Bull** para la gestión de colas. A continuación se detalla el flujo completo para levantar el entorno de desarrollo desde cero.

## 📦 Tecnologías principales

- **Node.js** + **Express**
- **PostgreSQL**
- **Prisma ORM**
- **Redis** + **Bull** (queue)
- **Docker** y **Docker Compose**
- **Cloudinary** (almacenamiento de imágenes)
- **Nodemailer** + **Gmail**
- **JWT** (autenticación)
- **Swagger** (documentación de la API)

## ⚙️ FLUJO COMPLETO PARA LEVANTAR EL BACKEND

### 1. 📥 Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/simplictec-backend.git
cd simplictec-backend
```

### 2. 📦 Instalar dependencias

```bash
npm install
```

### 3. 🔐 Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completalo con tus credenciales reales:

```bash
cp .env.example .env
```

⚠️ **IMPORTANTE:** Nunca subas tu archivo `.env` a GitHub. Está protegido por `.gitignore`.

Ejemplo de `.env`:

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

### 4. 🐳 Iniciar servicios necesarios (PostgreSQL y Redis)

Asegurate de tener **Docker** instalado y ejecuta:

```bash
docker compose up -d
```

Esto iniciará automáticamente los contenedores necesarios:
- PostgreSQL (puerto 5432)
- Redis (puerto 6379)

### 5. 🧱 Ejecutar comandos de Prisma

Genera el cliente de Prisma y aplica las migraciones:

```bash
npx prisma generate
npx prisma migrate deploy
```

### 6. ▶️ Levantar el backend

```bash
npm run dev
```

Esto iniciará tanto el backend principal como el **worker de leads**, que se encarga de enviar correos de forma asíncrona mediante Redis + Bull.

## ✅ Acceder a la API

Una vez iniciado, puedes acceder a la API desde:

```
http://localhost:3001
```


## 📁 Estructura del proyecto

```
simplictec-backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docker-compose.yml
├── .env.example
└── README.md
```


**Desarrollado con ❤️ por el equipo de SimpliTEC**
