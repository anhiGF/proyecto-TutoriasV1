<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'role' => fake()->randomElement(['coordinador', 'tutor', 'alumno']),
            'division' => fake()->randomElement(['Sistemas', 'Industrial', 'Administración']),
            'status' => fake()->randomElement(['activo', 'inactivo']),
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }
}
