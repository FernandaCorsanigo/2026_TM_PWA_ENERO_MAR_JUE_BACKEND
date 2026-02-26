# Backend – Aplicación de Mensajería tipo Slack

Este es el **backend** de una aplicación web de mensajería en tiempo real, similar a Slack. Permite a los usuarios crear espacios de trabajo (*workspaces*), organizarlos en canales y enviarse mensajes entre sí.

---

## ¿Qué hace este proyecto?

- Registro e inicio de sesión de usuarios con contraseña encriptada
- Creación y gestión de **espacios de trabajo** (workspaces)
- Creación de **canales** dentro de cada workspace
- Envío y lectura de **mensajes** por canal

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Para qué se usa |
|---|---|
| **Node.js** | Entorno de ejecución de JavaScript en el servidor |
| **Express** | Framework para crear el servidor y las rutas de la API |
| **MongoDB + Mongoose** | Base de datos NoSQL para guardar usuarios, workspaces, canales y mensajes |
| **JWT** | Autenticación mediante tokens (JSON Web Tokens) |
| **bcrypt** | Encriptación segura de contraseñas |
| **Nodemailer** | Envío de emails (por ejemplo, invitaciones a workspaces) |
| **CORS** | Permite la comunicación entre el frontend y el backend desde distintos dominios |
| **dotenv** | Manejo de variables de entorno (datos sensibles como claves y URLs) |

---

## Estructura del proyecto

```
Backend/
├── main.js                  # Punto de entrada: configura y levanta el servidor
├── config/                  # Conexión a MongoDB y configuración de variables de entorno
├── routes/                  # Definición de las rutas de la API
│   ├── auth.router.js       # Rutas de autenticación (registro, login)
│   └── workspace.router.js  # Rutas de workspaces, canales y mensajes
├── controllers/             # Lógica de cada endpoint
│   ├── auth.controller.js
│   ├── workspace.controller.js
│   ├── channel.controller.js
│   └── messages.controller.js
├── middlewares/             # Verificaciones intermedias (autenticación, permisos, etc.)
├── models/                  # Esquemas de la base de datos (MongoDB)
│   ├── Users.model.js
│   ├── Workspace.model.js
│   ├── Channels.model.js
│   ├── ChannelMessages.model.js
│   └── Memberworkspace.model.js
├── repository/              # Acceso a la base de datos (operaciones CRUD)
├── helpers/                 # Funciones auxiliares (ej: manejo de errores)
└── .env                     # Variables de entorno (NO subir a GitHub)
```

---

## 🔗 Rutas principales de la API

### Autenticación – `/api/auth`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de nuevo usuario |
| POST | `/api/auth/login` | Inicio de sesión |

### Workspaces – `/api/workspace`
> Todas requieren autenticación con token JWT.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/workspace` | Obtener todos los workspaces del usuario |
| POST | `/api/workspace` | Crear un nuevo workspace |
| GET | `/api/workspace/:id` | Obtener un workspace por ID |
| POST | `/api/workspace/:id/channels` | Crear un canal (solo Owner o Admin) |
| GET | `/api/workspace/:id/channels` | Obtener canales de un workspace |
| POST | `/api/workspace/:id/channels/:channel_id/messages` | Enviar un mensaje |
| GET | `/api/workspace/:id/channels/:channel_id/messages` | Leer mensajes de un canal |

---

## ⚙️ Cómo correr el proyecto localmente

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd Backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz con los siguientes datos:
   ```env
   MONGODB_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_clave_secreta
   API_KEY=tu_api_key
   GMAIL_USERNAME=tu_correo@gmail.com
   GMAIL_PASSWORD=tu_contraseña_de_aplicacion
   ```

4. **Correr el servidor en modo desarrollo**
   ```bash
   npm run dev
   ```
   El servidor quedará escuchando en `http://localhost:8080`

---

## Despliegue

El proyecto está configurado para desplegarse en **Vercel** mediante el archivo `vercel.json`.

---

## Colección de Postman

Incluye el archivo `API-1.postman_collection.json` para importar y probar todos los endpoints fácilmente desde Postman.
