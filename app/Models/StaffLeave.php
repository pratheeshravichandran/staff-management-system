<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffLeave extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'leave_type',
        'start_date',
        'end_date',
        'description',
        'supporting_file',
        'hr_status',
    ];

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
