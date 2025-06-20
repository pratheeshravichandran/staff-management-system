<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'sent_by',
        'file',
        'published_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'sent_by', 'id');
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
