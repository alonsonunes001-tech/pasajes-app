# 🚌 RutaExpress — Sistema de venta de pasajes

Aplicación web para buscar, comprar y gestionar pasajes de bus, con selección de asientos, comprobante en PDF y panel de operador.

## 🔗 URLs públicas

- **Frontend:** https://pasajes-app-cyan.vercel.app/viajes
- **API:** https://pasajes-api.onrender.com/api

> Nota: la API está en Render (plan free), puede tardar unos segundos en "despertar" si estuvo inactiva.

## 🛠️ Stack

- **Frontend:** React 19, React Router, Tailwind CSS, Axios, jsPDF
- **Backend:** Node.js, Express, Sequelize (ORM)
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT + bcrypt
- **Deploy:** Vercel (frontend) + Render (backend + PostgreSQL)

## 📁 Estructura del proyecto

```
pasajes-app/
├── client/          # Frontend React
│   ├── src/
│   │   ├── pages/         # Login, Registro, Viajes, Asientos, MisPasajes, Comprobante, Operador
│   │   ├── context/        # AuthContext (manejo de sesión JWT)
│   │   └── services/        # api.js (cliente Axios)
│   └── .env.example
├── server/          # Backend API
│   ├── controllers/  # Lógica de negocio
│   ├── routes/        # Endpoints REST
│   ├── models/          # Modelos Sequelize (Usuario, Viaje, Asiento, Pasaje)
│   ├── migrations/    # Migraciones de base de datos
│   ├── middlewares/  # Autenticación JWT
│   └── .env.example
└── package.json     # Scripts raíz para correr todo junto
```

## ⚙️ Requisitos previos

- Node.js 18 o superior
- PostgreSQL instalado y corriendo localmente

## 🚀 Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/alonsonunes001-tech/pasajes-app.git
cd pasajes-app
```

### 2. Instalar dependencias

```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configurar variables de entorno

Copiar los archivos de ejemplo y completar con tus datos locales:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Variables del **server** (`server/.env`):

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host de PostgreSQL (ej. `localhost`) |
| `DB_PORT` | Puerto de PostgreSQL (default `5432`) |
| `DB_NAME` | Nombre de la base de datos |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña de PostgreSQL |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Duración del token (ej. `24h`) |
| `PORT` | Puerto del servidor (default `3001`) |
| `NODE_ENV` | `development` o `production` |
| `CLIENT_URL` | URL del frontend, para CORS |

Variables del **client** (`client/.env`):

| Variable | Descripción |
|---|---|
| `REACT_APP_API_URL` | URL base de la API (ej. `http://localhost:3001/api`) |

### 4. Crear la base de datos y ejecutar migraciones

Crear manualmente la base en PostgreSQL (con el nombre que pusiste en `DB_NAME`), luego:

```bash
npm run migrate
npm run seed
```

### 5. Levantar el proyecto (API + frontend juntos)

```bash
npm run dev
```

Esto levanta:
- API en `http://localhost:3001`
- Frontend en `http://localhost:3000`

También se pueden levantar por separado:

```bash
npm run server   # solo la API
npm run client   # solo el frontend
```

## 👤 Roles

- **Pasajero:** se registra, busca viajes, compra pasajes con selección de asiento, ve "Mis pasajes" y descarga el comprobante en PDF.
- **Operador:** gestiona (crea, edita, elimina) viajes desde el panel `/operador`.

## 📄 Funcionalidades principales

- Registro y login con JWT
- Búsqueda de viajes por origen, destino y fecha
- Ordenamiento de resultados por precio u horario
- Selección visual de asientos (disponibles/ocupados)
- Compra de pasajes con bloqueo transaccional (evita doble venta del mismo asiento)
- Historial "Mis pasajes"
- Comprobante de compra con descarga en PDF