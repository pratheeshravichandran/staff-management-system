<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_title',
        'description',
        'staff_id',
        'priority',
        'status',
        'due_date',
    ];

    // Relationship with User (staff)
    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    // Relationship with Department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
