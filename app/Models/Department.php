<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hod_id',
    ];
    public function hod()
    {
        return $this->belongsTo(User::class, 'hod_id');
    }
}
