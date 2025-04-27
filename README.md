# Proyecto Decameron - Desarrollo Full-Stack

Aplicativo web con backend en **Laravel 9**, y frontend usando **React + Vite** , mas el framework de estilos **Tailwind**
y la UI Suite de React llamada **PrimeReact** y base de datos en **PostgreSQL**

## Requisitos para ejecución

- PHP ^8.1
- Composer - Gestión de paqueteria
- Node.js ^18
- NPM - Gestión de paqueteria
- PostgreSQL
- Git - para clonacion de repositorio

## Clonar e instalar proyecto backend de Laravel

1. Clonar el repositorio backend:
   - git clone https://github.com/SantiPEC/decameron_back.git

2. Configurar codigo:
    - En el archivo env.ejemplo, estan ajustadas las configuraciones para poder conectar el proyecto con la base de datos, solo sería poner, nombre de la bd, usuario y contraseña de la base de datos que se configure de manera local.

3. Instalar backend:
    - cd ruta_a_la_carpeta/decameron_back
    - composer install
    - cp .env.example .env
    - php artisan key:generate
    - php artisan migrate
    - php artisan serve
    - iniciar en consola: php artisan serve

## Clonar e instalar proyecto frontend de React

1. Clonar repositorio frontend:
    - git clone https://github.com/SantiPEC/decameron_front.git

2. Instalar frontend:
    - cd ruta_a_la_carpeta/decameron_front
    - npm install
    - npm run dev
    - http://localhost:5173


