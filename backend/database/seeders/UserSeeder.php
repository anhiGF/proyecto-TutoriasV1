<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Usuario real para login en frontend
        User::create([
            'name' => 'Coordinadora ITSJ',
            'email' => 'coord@itsj.edu.mx',
            'password' => bcrypt('12345678'),
            'role' => 'coordinador',
            'division' => 'Sistemas',
            'status' => 'ACTIVO',
            'email_verified_at' => now(),
        ]);

        // Usuarios falsos de prueba
        User::factory(5)->create();
    }
}
