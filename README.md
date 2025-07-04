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

## 🚀 FLUJO COMPLETO PARA LEVANTAR EL PROYECTO DESDE CERO

### 1. 📥 Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/simplictec-backend.git
cd simplictec-backend
```

---

### 2. ⚙️ Crear el archivo `.env`

En la raíz del proyecto, crear un archivo llamado `.env` con el siguiente contenido:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/simplictec_db
JWT_SECRET=supersecret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

> 🔐 Los datos de Cloudinary se pueden dejar vacíos si no vas a trabajar con imágenes por ahora.

---

### 3. 🐳 Levantar todo con Docker Compose

Ejecutá:

```bash
docker-compose up --build
```

Este comando:
- Levanta un contenedor PostgreSQL (`simplictec_db`)
- Construye el backend y aplica las migraciones con `npx prisma migrate deploy`
- Crea automáticamente un usuario admin de prueba en la base de datos

---

### 4. ✅ Usuario admin de prueba creado automáticamente

| Campo     | Valor                 |
|-----------|-----------------------|
| Email     | `admin@gmail.com` |
| Contraseña| `admin123`            |
| Rol       | `admin`               |

Puedes iniciar sesión directamente vía frontend o con herramientas como Postman:

```
POST http://localhost:3001/auth/login
{
  "email": "admin@simplitec.com",
  "password": "admin123"
}
```

---

### 5. 🌐 El backend estará disponible en:

```
http://localhost:3001
```

---

### 6. (Opcional) Ver base de datos en navegador

```bash
npx prisma studio
```

Esto abrirá una interfaz gráfica para explorar tus tablas y datos.

---

## 📥 Comandos útiles

- 🔁 Reiniciar todo desde cero:
```bash
docker-compose down -v
npx prisma migrate reset
```

- 📦 Aplicar migraciones manualmente:
```bash
npx prisma migrate deploy
```

- 📊 Abrir Prisma Studio:
```bash
npx prisma studio
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
