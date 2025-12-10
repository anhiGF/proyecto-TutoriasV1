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

# 2) Xdebug (para pruebas / cobertura)
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Config Xdebug (puedes tunear luego)
COPY xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# 3) Composer dentro del contenedor
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4) Código del backend
WORKDIR /var/www/html
COPY . .

# Permisos Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 5) Dependencias PHP
RUN composer install --no-interaction --prefer-dist

# 6) Generar APP_KEY (si no existe)
RUN php artisan key:generate || true

# 7) Habilitar rewrite
RUN a2enmod rewrite

EXPOSE 80

CMD ["apache2-foreground"]
