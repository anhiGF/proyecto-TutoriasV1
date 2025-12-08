<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // GET /api/students
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->filled('carrera') && $request->carrera !== 'TODAS') {
            $query->where('carrera', $request->carrera);
        }

        if ($request->filled('estado') && $request->estado !== 'TODOS') {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('tutorId') && $request->tutorId !== 'TODOS') {
            $query->where('tutor_id', $request->tutorId);
        }

        if ($request->filled('periodo')) {
            $query->where('periodo', $request->periodo);
        }

        return response()->json($query->orderBy('nombre')->get());
    }

    // POST /api/students
    public function store(Request $request)
    {
        $data = $request->validate([
            'num_control'  => 'required|string|unique:students,num_control',
            'nombre'       => 'required|string',
            'carrera'      => 'required|string',
            'semestre'     => 'required|integer',
            'periodo'      => 'required|string',
            'estado'       => 'required|string',
            'tutor_id'     => 'nullable|integer',
            'tutor_nombre' => 'nullable|string',
        ]);

        $student = Student::create($data);

        return response()->json($student, 201);
    }

    // PUT /api/students/{id}
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $data = $request->validate([
            'num_control'  => 'sometimes|string|unique:students,num_control,' . $student->id,
            'nombre'       => 'sometimes|string',
            'carrera'      => 'sometimes|string',
            'semestre'     => 'sometimes|integer',
            'periodo'      => 'sometimes|string',
            'estado'       => 'sometimes|string',
            'tutor_id'     => 'nullable|integer',
            'tutor_nombre' => 'nullable|string',
        ]);

        $student->update($data);

        return response()->json($student);
    }

    // DELETE /api/students/{id}
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Eliminado']);
    }

    // POST /api/students/assign-tutor
    public function assignTutor(Request $request)
    {
        $data = $request->validate([
            'tutor_email'  => 'required|email',
            'student_ids'  => 'required|array',
            'student_ids.*'=> 'exists:students,id',
        ]);

        // Buscar datos del tutor (ahorita solo usamos el correo como nombre)
        $tutorEmail = $data['tutor_email'];
        $tutorNombre = $tutorEmail; // Luego lo cambias por tabla de usuarios

        \App\Models\Student::whereIn('id', $data['student_ids'])
            ->update([
                'tutor_id'     => null,         // si luego tienes tabla de tutores, aquí iría el id
                'tutor_nombre' => $tutorNombre,
            ]);

        return response()->json([
            'message' => 'Tutor asignado correctamente',
        ]);
    }

}
