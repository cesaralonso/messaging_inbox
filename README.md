# Messaging Inbox

Aplicación full stack construida con **Laravel + Inertia + React + Vite**, enfocada en un flujo de mensajería interna con autenticación JWT e interfaz de inbox.

## Objetivo

Esta práctica implementa un inbox funcional con:

- login por API usando JWT
- listado de conversaciones
- vista de detalle de conversación
- respuesta a mensajes
- contador de no leídos
- creación de nuevas conversaciones
- interfaz moderna con layout propio

Además, se integró correctamente **Inertia + Vite** evitando conflictos con páginas starter que no formaban parte del alcance real de la práctica.

---

## Stack

### Backend
- Laravel
- PHP
- SQLite o MySQL
- JWT Auth
- Eloquent ORM

### Frontend
- React
- Inertia.js
- Vite
- TypeScript
- Tailwind CSS
- Lucide React

---

## Flujo principal del sistema

### 1. Login API
El usuario entra por:

```bash
/api-login


Desde esa pantalla se autentica contra el backend JWT.


### 2. Persistencia de sesión

Al autenticarse:

se obtiene el token JWT
se guarda en frontend
se hidrata sesión desde storage
posteriormente se consume la API protegida

### 3. Inbox

El usuario entra a:

/inbox

y puede:

ver conversaciones
consultar detalle
responder mensajes
marcar como leído
crear una nueva conversación

## Rutas web principales
/              -> redirige a /home
/home          -> redirige a /inbox
/dashboard     -> página Inertia protegida
/api-login     -> login por API/JWT
/inbox         -> inbox principal
Rutas API principales
Auth
POST /api/auth/login
Usuarios
GET /api/users
Conversaciones
GET    /api/conversations
POST   /api/conversations
GET    /api/conversations/unread-count
GET    /api/conversations/{conversation}
PATCH  /api/conversations/{conversation}/read
POST   /api/conversations/{conversation}/messages

## Estructura relevante del frontend
resources/js/
├── app.tsx
├── layouts/
│   └── inbox-shell-layout.tsx
├── pages/
│   ├── api-login.tsx
│   ├── inbox.tsx
│   └── dashboard.tsx
└── features/
    ├── auth/
    │   ├── hooks/
    │   ├── pages/
    │   │   └── ApiLoginPage.tsx
    │   └── store/
    └── inbox/
        ├── api/
        ├── hooks/
        ├── pages/
        │   └── InboxPage.tsx
        └── types/

### Punto importante sobre Inertia + Vite

Se corrigió el problema de integración evitando que Vite intentara compilar páginas starter no utilizadas, especialmente las de:

resources/js/pages/settings/*

La resolución de páginas Inertia quedó enfocada únicamente en las páginas reales del proyecto.

Wrapper pages usadas por Inertia

Se usan páginas wrapper en:

resources/js/pages/api-login.tsx
resources/js/pages/inbox.tsx

Estas exportan las páginas reales dentro de features.


### Layout del inbox

Se creó un layout propio para el sistema:

resources/js/layouts/inbox-shell-layout.tsx


## Este layout incorpora:

encabezado superior
buscador visual
navegación principal
botón “Nuevo mensaje”
estructura visual alineada al mockup solicitado
Inbox UI implementado


## La pantalla de inbox incluye:

Panel izquierdo
listado de conversaciones
búsqueda
badge de no leídos
botón de nuevo mensaje
Panel derecho
encabezado de conversación
lectura del historial
textarea para responder
acción de envío
Modal de creación
destinatario
asunto
cuerpo del mensaje
Login de prueba


## Credenciales de prueba:

Email: admin@messaging-inbox.com
Password: 123456

### Instalación
1. Clonar proyecto
git clone <repo-url>
cd messaging-inbox

### 2. Instalar dependencias backend
composer install

### 3. Instalar dependencias frontend
npm install

### 4. Configurar entorno
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

### 5. Base de datos


### Si usas SQLite:
touch database/database.sqlite
Asegúrate de configurar en .env:
DB_CONNECTION=
DB_DATABASE=

Después:

php artisan migrate --seed

### Ejecución en desarrollo
Terminal 1
npm run dev
Terminal 2
php artisan serve

Abrir:

http://127.0.0.1:8000/api-login
http://127.0.0.1:8000/inbox

### Build de producción
php artisan optimize:clear
rm -rf public/build
rm -f public/hot
npm run build
php artisan serve

### Tests

Ejecutar:

php artisan test

## Nota importante sobre los tests

Durante la integración real del proyecto se eliminaron algunos tests heredados del starter original de Laravel porque ya no correspondían al alcance funcional de esta práctica.

En particular, se descartaron pruebas relacionadas con módulos starter no implementados actualmente, como:

perfil completo de usuario del starter
seguridad del starter
ejemplos base que dependían de rutas no usadas por la práctica real


### Se conservaron y ajustaron las pruebas relevantes para:

autenticación
JWT login
dashboard
conversaciones
mensajes
lectura / no leídos

### Decisiones técnicas tomadas
1. Se mantuvo el flujo JWT separado del auth web tradicional

/api-login autentica contra API y /inbox consume endpoints protegidos vía token.

2. Se desacopló el inbox del starter visual de Laravel

Se creó un layout propio en lugar de depender del layout original del starter.

3. Se corrigió el resolve de Inertia

Se evitó el bucle de errores de tipado y compilación ajustando correctamente la resolución de páginas reales.

4. Se evitó compilar páginas starter no utilizadas

Esto resolvió errores de build por imports inexistentes en módulos legacy de settings.



#To - do
mostrar fecha y hora real del último mensaje
crear conversación con autocomplete de usuarios
agregar estados de conversación
mejorar paginación del inbox
agregar modal de confirmación para cerrar conversación
agregar tests del flujo “nuevo mensaje”
agregar notificaciones toast
soportar archivos adjuntos

## Comandos útiles

### Limpiar caché
php artisan optimize:clear

### Ver rutas
php artisan route:list

### Ejecutar tests
php artisan test

### Build frontend
npm run build

### Desarrollo frontend
npm run dev

## Estado actual

### Proyecto funcional con:

Inertia + React + Vite funcionando
login JWT funcionando
inbox principal funcionando
detalle y reply funcionando
creación de conversación lista para seguir refinando
test suite ajustada al alcance real del proyecto







##Dentro del proyecto:
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
npm install
npm run dev

##Credenciales para login:
email: "admin@messaging-inbox.com"
password: "123456"

##Limpieza:
php artisan optimize:clear
rm -rf public/build
rm -f public/hot
npm run build

##Despues de cambios:
npm run build
php artisan optimize:clear
php artisan serve
