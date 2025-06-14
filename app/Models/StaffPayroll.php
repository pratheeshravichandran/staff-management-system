<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffPayroll extends Model
{
    use HasFactory;

    protected $table = 'staff_payroll';

    protected $fillable = [
        'staff_id',
        'basic_pay',
        'hra',
        'da',
        'ta',
        'pf_deduction',
        'esi_deduction',
        'sd_deduction',
        'professional_tax',
        'income_tax',
        'other_tax',
        'loan_penalty',
        'gross_salary',
        'net_salary',
        'payment_month',
        'payment_status'
    ];

    protected $casts = [
        'payment_month' => 'date',
        'basic_pay' => 'float',
        'hra' => 'float',
        'da' => 'float',
        'ta' => 'float',
        'pf_deduction' => 'float',
        'esi_deduction' => 'float',
        'sd_deduction' => 'float',
        'professional_tax' => 'float',
        'income_tax' => 'float',
        'other_tax' => 'float',
        'loan_penalty' => 'float',
        'gross_salary' => 'float',
        'net_salary' => 'float',
    ];

    public function staff()
    {
        return $this->belongsTo(User::class);
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

}
