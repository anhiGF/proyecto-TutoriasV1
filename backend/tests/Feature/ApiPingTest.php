<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiPingTest extends TestCase
{
    use RefreshDatabase;
    /** @test */
    public function ping_responde_ok()
    {
        $response = $this->getJson('/api/ping');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'API OK',
                 ]);
    }
}
