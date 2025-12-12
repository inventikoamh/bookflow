<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'author',
        'library_name',
        'issue_date',
        'return_date',
        'returned_at',
        'cover_image',
        'status',
        'current_page',
        'total_pages',
        'note',
        'duration',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'return_date' => 'date',
        'returned_at' => 'datetime',
    ];

    protected $appends = ['progress_percentage'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function readingSessions()
    {
        return $this->hasMany(ReadingSession::class)->orderBy('start_datetime', 'desc');
    }

    public function getProgressPercentageAttribute()
    {
        if (!$this->total_pages || $this->total_pages == 0) {
            return 0;
        }
        return round(($this->current_page / $this->total_pages) * 100);
    }
}
