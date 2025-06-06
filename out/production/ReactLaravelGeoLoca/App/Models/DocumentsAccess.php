<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentsAccess extends Model
{
    protected $fillable = [
        'document_id',
        'user_id',
        'created_at',
        'updated_at'
    ];

    public function document()
    {
        return $this->belongsTo(Documents::class, 'document_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
