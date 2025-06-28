<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankDetail extends Model
{
    use HasFactory;

    protected $fillable =[
        'user_id',
        'bank_name',
        'branch',
        'ifsc_code',
        'account_holder_name',
        'account_number',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
