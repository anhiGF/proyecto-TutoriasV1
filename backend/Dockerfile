# Imagen base PHP 8.3 con Apache
FROM php:8.3-apache

# 1) Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    nano \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    curl \
    && docker-php-ext-install zip pdo pdo_mysql pdo_pgsql

# 2) Xdebug (para cobertura de PHPUnit)
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Opcional: config extra de Xdebug (si tienes archivo)
COPY xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# 3) Composer dentro del contenedor
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4) Código del backend (este Dockerfile debe estar dentro de /backend)
WORKDIR /var/www/html
COPY . .

# 5) Permisos para Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 6) Dependencias PHP
RUN composer install --no-interaction --prefer-dist

# 7) Generar APP_KEY (no truena si ya existe)
RUN php artisan key:generate || true

# 8) Habilitar mod_rewrite para rutas bonitas
RUN a2enmod rewrite

EXPOSE 80

CMD ["apache2-foreground"]
