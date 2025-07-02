# 🚗 SimpliTEC Backend - Prueba Técnica Fullstack

Este proyecto es la solución completa al desafío técnico Fullstack de SimpliTEC. Implementa un backend profesional usando Node.js, Express, Prisma y PostgreSQL, completamente contenerizado con Docker. Integra autenticación JWT con roles, manejo de archivos con Cloudinary, validaciones, emails automáticos y testing automatizado con Jest + Supertest.

---

## 🔧 Tecnologías utilizadas

* **Node.js** + **Express**
* **Prisma ORM** + **PostgreSQL**
* **Docker + Docker Compose**
* **JWT** para autenticación y control de acceso por rol
* **Multer** + **Cloudinary** para subida de imágenes
* **Nodemailer** para envío de correos automáticos
* **Jest** + **Supertest** para testing
* **dotenv**, **cors**, **bcrypt**, etc.

---

## 📂 Estructura del proyecto

```
/src
├── controllers/         # Lógica de negocio
├── routes/              # Definición de endpoints
├── middlewares/         # Autenticación, validaciones
├── utils/               # Helpers (mailer, etc.)
├── config/              # Cloudinary, Prisma
├── app.js               # Configuración Express
├── index.js             # Entry point
/tests                   # Tests automatizados
```

---

## 🧪 Tests automatizados

* Configurado con Jest + Supertest
* Test para endpoints públicos y protegidos
* Incluye:

  * `GET /dealers`
  * `POST /dealer/:id/leads`
  * `POST /vehicles` con autenticación JWT

Ejecutar tests:

```bash
npm test
```

---

## 🔐 Autenticación y roles

El sistema implementa JWT y control de acceso basado en roles:

* **admin**: puede crear/editar/eliminar dealers
* **dealer**: puede gestionar sus publicaciones, vehículos, accesorios y ver sus leads

### Endpoints:

* `POST /auth/register` → Crear usuario (admin o dealer)
* `POST /auth/login` → Login y generación de token

> El token JWT debe enviarse en `Authorization: Bearer <token>` en rutas protegidas

---

## 📦 Endpoints disponibles (resumen)

### Dealers

* `GET /dealers`
* `GET /dealers/:id`
* `POST /dealers` → solo admin
* `PUT /dealers/:id` → solo admin
* `DELETE /dealers/:id` → solo admin

### Vehicles

* `GET /vehicles/dealers/:id` → público
* `GET /vehicles/dealers/:id/:vehicleId`
* `POST /vehicles` → solo dealer (con imágenes)
* `PUT /vehicles/:id/:vehicleId` → solo dealer (con imágenes)
* `DELETE /vehicles/dealers/:id/:vehicleId`

### Accessories

* `GET /accesory/dealer/:dealerId/accessories`
* `POST /accesory/dealer/:dealerId/accessories` → dealer

### Posts

* `GET /post/dealer/:dealerId/posts`
* `GET /post/dealer/:dealerId/posts/search?text=...`
* `POST /post/dealer/:dealerId/posts` → dealer (con imágenes)
* `DELETE /post/dealer/:dealerId/posts/:id` → dealer

### Leads

* `POST /leads/dealer/:dealerId/leads` → público
* `GET /leads/dealer/:dealerId/leads` → dealer

---

## 📸 Subida de imágenes con Cloudinary

* Se utiliza `multer` con Cloudinary para subir imágenes desde formularios o Postman
* Las imágenes se almacenan por carpeta (`vehicles/`, `posts/`)
* Al editar/eliminar un post o vehículo, se eliminan las imágenes anteriores

---

## 📧 Emails automáticos

* Al crear un lead, se envía un correo al `dealer.email` asociado al post
* El contenido incluye datos del interesado y el título de la publicación
* Configurable por `.env`

---

## ⚙️ Variables de entorno - `.env.example`

```
DATABASE_URL=postgresql://usuario:password@localhost:5432/simplitec
JWT_SECRET=clave_secreta_segura
MAIL_USER=micorreo@gmail.com
MAIL_PASS=clave_app_google
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 🐳 Docker (opcional)

Incluye configuración con Docker Compose para levantar el backend + base PostgreSQL

```bash
docker-compose up --build
```

---

## 📌 Requisitos para correr el proyecto

1. Tener Node.js, npm y Docker instalados
2. Crear un archivo `.env` basado en `.env.example`
3. Instalar dependencias:

```bash
npm install
```

4. Ejecutar migraciones:

```bash
npx prisma migrate dev
```

5. Ejecutar el servidor:

```bash
npm run dev
```

---

## 💬 Contacto

Desarrollado por Lucas Leiro para SimpliTEC - 2025
