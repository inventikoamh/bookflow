<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReadingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'start_datetime',
        'end_datetime',
        'pages_from',
        'pages_to',
        'notes',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
