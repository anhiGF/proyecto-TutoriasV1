<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Datos básicos
            $table->string('name');
            $table->string('email')->unique();

            // Rol dentro del sistema
            // COORDINACION, DIRECCION, JEFE_DIVISION, TUTOR, ESTUDIANTE, etc.
            $table->string('role')->default('ESTUDIANTE');

            // División / programa / carrera (nullable porque dirección quizá no tiene)
            $table->string('division')->nullable();

            // Estado de la cuenta
            // ACTIVO / INACTIVO
            $table->string('status')->default('ACTIVO');

            // Autenticación
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
