# MiInbox
## Messaging Inbox

Aplicación web full stack desarrollada con Laravel + Inertia + React + Vite y Tailwind, que implementa un sistema de mensajería interna con autenticación mediante JWT.

## Requisitos cubiertos
- JWT auth
- usuario actual
- listado de conversaciones con paginación, búsqueda y filtro por estado
- detalle de conversación con mensajes
- creación de conversación con primer mensaje
- respuesta a conversación
- contador de no leídos
- tests backend con PHPUnit
- tests frontend con Jest + React Testing Library

## Ejecución

### Backend
php artisan serve

### Frontend
npm install
npm run dev



## Descripción

Messaging Inbox permite a los usuarios autenticarse mediante API y gestionar conversaciones en una interfaz tipo inbox:

- Login con JWT
- Listado de conversaciones
- Vista de detalle
- Respuesta de mensajes
- Contador de no leídos
- Creación de nuevas conversaciones
- Interfaz moderna desacoplada del starter de Laravel

---

## Stack Tecnológico

### Backend
- Laravel
- PHP
- MySQL
- JWT Auth
- Eloquent ORM

### Frontend
- React + TypeScript
- Inertia.js
- Vite
- Tailwind CSS
- Lucide React

---

## Flujo de la aplicación

1. El usuario accede a /api-login
2. Se autentica contra la API (JWT)
3. Se almacena el token en frontend
4. Se accede a /inbox
5. Se consumen endpoints protegidos para:
   - listar conversaciones
   - ver mensajes
   - responder
   - crear nuevas conversaciones

---

## Rutas principales

### Web

/              -> redirige a /home  
/home          -> redirige a /inbox  
/api-login     -> login JWT  
/inbox         -> inbox principal  
/dashboard     -> vista protegida  

---

### API

POST   /api/auth/login  
GET    /api/users  

GET    /api/conversations  
POST   /api/conversations  
GET    /api/conversations/unread-count  
GET    /api/conversations/{id}  
PATCH  /api/conversations/{id}/read  
POST   /api/conversations/{id}/messages  

---

## Estructura del frontend

resources/js/
- app.tsx
- layouts/
  - inbox-shell-layout.tsx
- pages/
  - api-login.tsx
  - inbox.tsx
  - dashboard.tsx
- features/
  - auth/
  - inbox/

---

## UI del Inbox

Layout principal:
- Header superior con navegación
- Buscador global
- Botón "Nuevo mensaje"

Panel izquierdo:
- Lista de conversaciones
- Búsqueda
- Indicador de no leídos

Panel derecho:
- Detalle de conversación
- Historial de mensajes
- Área de respuesta

Modal:
- Creación de nueva conversación
- Selección de usuario
- Asunto y mensaje

---

## Credenciales de prueba

Email: admin@messaging-inbox.com  
Password: 123456  

---

## Instalación

### 1. Clonar repositorio

git clone <repo-url>
cd messaging-inbox

### 2. Backend

composer install  
cp .env.example .env  
php artisan key:generate  
php artisan jwt:secret  

### 3. Base de datos (MySQL)

Crear base de datos:

CREATE DATABASE messaging_inbox;

Configurar .env:

DB_CONNECTION=mysql  
DB_HOST=127.0.0.1  
DB_PORT=3306  
DB_DATABASE=messaging_inbox  
DB_USERNAME=root  
DB_PASSWORD=  

Migrar:

php artisan migrate --seed  

---

### 4. Frontend

npm install  

---

## Ejecución

### Desarrollo

npm run dev  
php artisan serve  

Acceder a:

http://127.0.0.1:8000/api-login  
http://127.0.0.1:8000/inbox  

---

### Producción

php artisan optimize:clear  
rm -rf public/build  
rm -f public/hot  
npm run build  
php artisan serve  

---

## Tests backend

php artisan test  

Nota:
Se eliminaron tests del starter original que no corresponden al alcance actual del proyecto (profile, security, etc.), manteniendo únicamente los relevantes para:

- autenticación
- inbox
- conversaciones
- mensajes


## Tests frontend
npm test



---

## Consideraciones técnicas

- Se desacopló el layout del starter de Laravel
- Se resolvieron conflictos de Vite/Inertia evitando cargar páginas no utilizadas
- Se implementó autenticación JWT independiente del auth tradicional
- Se utilizaron wrappers en /pages para compatibilidad con Inertia

---

## Próximos pasos

- Mostrar fechas reales en mensajes
- Autocomplete en destinatarios
- Adjuntar archivos
- Notificaciones en tiempo real
- Paginación avanzada

---

## Estado actual

- Login JWT funcional
- Inbox completamente funcional
- UI moderna implementada
- Integración Inertia + Vite estable
- Tests ajustados al alcance real

---

## Autor

Desarrollado como práctica técnica full stack.
