<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentsApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function listado_students()
    {
        // 1) Poblar BD con usuarios + estudiantes
        $this->seed([
            \Database\Seeders\UserSeeder::class,
            \Database\Seeders\StudentSeeder::class,
        ]);

        // 2) Login de la coordinadora para obtener token
        $loginResponse = $this->postJson('/api/auth/login', [
            'email'    => 'coord@itsj.edu.mx',
            'password' => '12345678',
        ]);

        $token = $loginResponse->json('token');

        // 3) Llamar /api/students con Bearer token
        $response = $this
            ->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/students');

        // 4) Verificamos que responde 200
        $response->assertStatus(200);

        // 5) Obtenemos el JSON como arreglo
        $students = $response->json();

        // Debe ser un arreglo
        $this->assertIsArray($students);

        // Deben venir 15 registros porque el seeder crea 15
        $this->assertCount(15, $students);

        // 6) Verificamos la estructura de cada alumno
        $response->assertJsonStructure([
            '*' => [ // "*" = cada elemento del array raíz
                'id',
                'num_control',
                'nombre',
                'carrera',
                'semestre',
                'periodo',
                'estado',
                'tutor_id',
                'tutor_nombre',
                'created_at',
                'updated_at',
            ],
        ]);
    }
}
