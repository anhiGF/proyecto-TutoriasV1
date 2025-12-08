<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Laravel\Sanctum\Sanctum;

class AuthController extends Controller
{
    /**
     * POST /api/auth/login
     * Body: { "email": "...", "password": "..." }
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        /** @var \App\Models\User|null $user */
        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

        if ($user->status !== 'ACTIVO') {
            return response()->json([
                'message' => 'La cuenta está inactiva. Contacta a coordinación.',
            ], 403);
        }

        if (!$user->password || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.',
            ], 401);
        }

    //Borramos tokens anteriores de ese dispositivo
        $user->tokens()->delete();

            // Creamos un token personal para el SPA
        $token = $user->createToken('spa-token')->plainTextToken;

        $user->makeHidden(['password', 'remember_token']);

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    /**
     * POST /api/auth/reset-password
     * Body: { "email": "...", "new_password": "...", "new_password_confirmation": "..." }
     *
     * Regla de contraseña:
     * - Mínimo 8 caracteres
     * - Al menos 2 números
     * - No permitir 3 caracteres idénticos seguidos
     */
    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'email'                      => ['required', 'email'],
            'new_password'               => [
                'required',
                'string',
                'min:8',
                'max:255',
                // al menos 2 dígitos y no 3 iguales seguidos
                'regex:/^(?=(?:.*\d){2,})(?!.*([A-Za-z\d])\1\1)[A-Za-z\d]{8,}$/',
            ],
            'new_password_confirmation'  => ['required', 'same:new_password'],
        ], [
            'new_password.regex' => 'La contraseña debe tener al menos 2 números y no puede tener 3 caracteres iguales seguidos.',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'No existe una cuenta con ese correo.',
            ], 404);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json([
            'message' => 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
        ]);
    }
}
