Messaging-Inbox
Chat

Qué debes correr en tu máquina:

##Dentro del proyecto:
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
touch database/database.sqlite
php artisan migrate --seed
npm install
npm run dev


##Credenciales para login:
email: "admin@messaging-inbox.com"
password: "password123"


##Limpieza:
php artisan optimize:clear
rm -rf public/build
rm -f public/hot
npm run build

##Despues de cambios:
npm run build
php artisan optimize:clear
php artisan serve