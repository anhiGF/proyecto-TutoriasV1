<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class StudentFactory extends Factory
{
    public function definition()
    {
        return [
            'num_control' => fake()->unique()->regexify('2[0-9]{7}'),
            'nombre' => fake()->name(),
            'carrera' => fake()->randomElement(['ISC', 'II', 'ADM']),
            'semestre' => fake()->numberBetween(1, 9),
            'periodo' => fake()->randomElement(['ENE-JUN', 'AGO-DIC']),
            'estado' => fake()->randomElement(['regular', 'irregular']),
            'tutor_id' => User::factory(),
            'tutor_nombre' => fake()->name(),
        ];
    }
}
