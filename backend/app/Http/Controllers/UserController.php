<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Filtros: ?role=...&status=...&division=...&search=...&with_trashed=1
     */
    public function index(Request $request)
    {
        $query = User::query();

        // incluir soft-deleted si lo pides
        if ($request->boolean('with_trashed')) {
            $query->withTrashed();
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('division')) {
            $query->where('division', $request->division);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // opcional: paginación real
        $perPage = $request->integer('per_page', 15);

        return response()->json(
            $query->orderBy('name')->paginate($perPage)
        );
    }

    /**
     * POST /api/users
     * Crea nuevo usuario (con contraseña inicial).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255',
    'regex:/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/u', ],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'role'     => ['required', 'string', Rule::in(['COORDINACION', 'TUTOR', 'JEFE_DIVISION', 'DIRECCION'])],
            'division' => ['nullable', 'string', 'max:255'],
            'status'   => ['required', 'string', Rule::in(['ACTIVO', 'INACTIVO'])],
            // contraseña inicial simple (luego se cambia en reset-password)
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // si no mandas password, genera una temporal
        if (empty($data['password'])) {
            $data['password'] = 'ITSJtutorias2025';
        }

        // 👇 Cifrado correcto
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json($user, 201);
    }

    /**
     * GET /api/users/{id}
     */
    public function show($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        return response()->json($user);
    }

    /**
     * PUT /api/users/{id}
     * Actualiza datos generales (no contraseña).
     */
    public function update(Request $request, $id)
{
    $user = User::withTrashed()->findOrFail($id);

    $data = $request->validate([
        'name'     => ['sometimes', 'required', 'string', 'max:255',
    'regex:/^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/u', ],
        'email'    => [
            'sometimes', 'required', 'email', 'max:255',
            Rule::unique('users', 'email')->ignore($user->id),
        ],
        'role'     => ['sometimes', 'required', 'string', Rule::in(['COORDINACION', 'TUTOR', 'JEFE_DIVISION', 'DIRECCION'])],
        'division' => ['sometimes', 'nullable', 'string', 'max:255'],
        'status'   => ['sometimes', 'required', 'string', Rule::in(['ACTIVO', 'INACTIVO'])],

        // 🔐 Password OPCIONAL al editar
        'password' => [
            'nullable',
            'string',
            'min:8',
            'regex:/^(?=(?:.*\d){2,})(?!.*(.)\1\1).+$/',
            'confirmed',
        ],
    ]);

    // si mandaron password, la ciframos
    if (!empty($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    } else {
        // si viene null o no viene, no la actualizamos
        unset($data['password']);
    }

    $user->update($data);

    return response()->json($user);
}


    /**
     * DELETE /api/users/{id}
     * Soft delete (eliminación lógica).
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete(); // SoftDeletes -> filled deleted_at

        return response()->json(['message' => 'Usuario eliminado (soft delete).']);
    }

    /**
     * POST /api/users/{id}/restore
     * Restaurar un usuario soft-deleted.
     */
    public function restore($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return response()->json(['message' => 'Usuario restaurado.', 'user' => $user]);
    }

    /**
     * PATCH /api/users/{id}/role
     * Cambiar rol (COORDINACION, TUTOR, JEFE_DIVISION, DIRECCION).
     */
    public function updateRole(Request $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);

        $data = $request->validate([
            'role' => ['required', 'string', Rule::in(['COORDINACION', 'TUTOR', 'JEFE_DIVISION', 'DIRECCION'])],
        ]);

        $user->role = $data['role'];
        $user->save();

        return response()->json(['message' => 'Rol actualizado.', 'user' => $user]);
    }

    /**
     * PATCH /api/users/{id}/status
     * Activar / desactivar cuenta.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);

        $data = $request->validate([
            'status' => ['required', 'string', Rule::in(['ACTIVO', 'INACTIVO'])],
        ]);

        $user->status = $data['status'];
        $user->save();

        return response()->json(['message' => 'Estado actualizado.', 'user' => $user]);
    }

    /**
     * POST /api/users/{id}/reset-password
     * Body: { "new_password": "..." }
     */
    public function resetPassword(Request $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);

        $data = $request->validate([
            'new_password' => ['required', 'string', 'min:8', 'max:255'],
        ]);

        // 👇 Cifrado de contraseña
        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }
}
