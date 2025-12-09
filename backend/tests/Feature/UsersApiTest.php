<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UsersApiTest extends TestCase
{
    use RefreshDatabase;
    /** @test */
    public function listado_usuarios()
    {
        // 1) Usuario autenticado (coordinadora)
        $coord = User::create([
            'name'     => 'Coordinadora Usuarios',
            'email'    => 'coord-users@itsj.edu.mx',
            'password' => Hash::make('secret123'),
            'role'     => 'coordinadora',
            'division' => 'Sistemas',
            'status'   => 'activo',
        ]);

        $this->actingAs($coord, 'sanctum');

        // 2) Creamos algunos usuarios extra
        User::create([
            'name'     => 'Tutor Demo',
            'email'    => 'tutor-demo@itsj.edu.mx',
            'password' => Hash::make('secret123'),
            'role'     => 'tutor',
            'division' => 'Sistemas',
            'status'   => 'activo',
        ]);

        User::create([
            'name'     => 'Alumno Demo',
            'email'    => 'alumno-demo@itsj.edu.mx',
            'password' => Hash::make('secret123'),
            'role'     => 'alumno',
            'division' => 'Sistemas',
            'status'   => 'activo',
        ]);

        // 3) Llamamos al endpoint real de usuarios
        $response = $this->getJson('/api/users');

        // 4) Verificamos
        // (3 usuarios: coord, tutor, alumno)
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }
}
