<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'staff_id',
        'dob',
        'designation',
        'role',
        'gender',
        'email',
        'department_id',
        'phone_number',
        'password',
        'profile_pic',
        'verified_at',
        'verified_by',
        'denied_at',
        'denied_by',
        'status',
        'joining_date',
        'address',
        'salary',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'dob' => 'date',
        'joining_date' => 'date',   
        'salary' => 'decimal:2',
    ];

    public function roles()
    {
        return $this->belongsTo(Role::class, 'role');
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function latestPayroll(): HasOne
    {
        return $this->hasOne(\App\Models\StaffPayroll::class, 'staff_id')->latestOfMany();
    }
}
