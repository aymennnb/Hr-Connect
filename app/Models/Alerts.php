<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alerts extends Model
{
    protected $fillable = [
        'role',
        'user_id',
        'action',
        'type',
        'message',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
