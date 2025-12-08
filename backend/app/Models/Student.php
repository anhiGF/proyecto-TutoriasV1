<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'num_control',
        'nombre',
        'carrera',
        'semestre',
        'periodo',
        'estado',
        'tutor_id',
        'tutor_nombre',
    ];
}
