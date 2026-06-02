<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogAuditoria extends Model
{
    protected $table = 'log_auditorias';
    protected $fillable = ['admin_id', 'accion'];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'id_usuario');
    }
}