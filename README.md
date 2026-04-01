Qué debes correr en tu máquina

Dentro del proyecto:

composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
touch database/database.sqlite
php artisan migrate --seed
npm install
npm run dev


Credenciales para login:
email: "admin@messaging-inbox.com"
password: "password123"