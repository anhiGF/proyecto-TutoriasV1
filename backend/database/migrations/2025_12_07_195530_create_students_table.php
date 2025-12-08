<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id(); // id autoincrement
            $table->string('num_control')->unique();
            $table->string('nombre');
            $table->string('carrera');
            $table->unsignedTinyInteger('semestre');
            $table->string('periodo'); // ej: 2025-1
            $table->string('estado')->default('REGULAR'); // REGULAR / IRREGULAR / RIESGO
            $table->unsignedBigInteger('tutor_id')->nullable();
            $table->string('tutor_nombre')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
