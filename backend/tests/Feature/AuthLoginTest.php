<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthLoginTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function usuario_puede_iniciar_sesion()
    {
        // 1) Poblar BD de pruebas con el UserSeeder
        $this->seed(\Database\Seeders\UserSeeder::class);

        // 2) Hacer login contra /api/auth/login
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'coord@itsj.edu.mx',
            'password' => '12345678',
        ]);

        // 3) Verificar respuesta
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                ],
            ]);
    }
}
