<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    $totalBooks = $user->books()->count();
    $activeBooks = $user->books()->where('status', 'active')->count();
    $completedBooks = $user->books()->where('status', 'completed')->count();
    
    // Calculate total reading time
    $sessions = App\Models\ReadingSession::whereHas('book', function($q) use ($user) {
        $q->where('user_id', $user->id);
    })->get();
    
    $totalMinutes = 0;
    foreach($sessions as $session) {
        $start = \Carbon\Carbon::parse($session->start_datetime);
        $end = \Carbon\Carbon::parse($session->end_datetime);
        // Calculate duration from start to end (always positive)
        $duration = $start->diffInMinutes($end);
        $totalMinutes += $duration;
    }
    
    // Format reading time properly
    if ($totalMinutes < 60) {
        // Less than an hour - show only minutes
        $readingTime = "{$totalMinutes}m";
    } else {
        $hours = floor($totalMinutes / 60);
        $minutes = $totalMinutes % 60;
        if ($minutes > 0) {
            $readingTime = "{$hours}h {$minutes}m";
        } else {
            $readingTime = "{$hours}h";
        }
    }

    // Get active books for timer and recent books display
    $books = $user->books()->whereIn('status', ['active', 'wishlist'])->select('id', 'title', 'author', 'cover_image', 'status', 'current_page', 'total_pages')->latest()->get();

    return Inertia::render('Dashboard', [
        'stats' => [
            'totalBooks' => $totalBooks,
            'activeBooks' => $activeBooks,
            'completedBooks' => $completedBooks,
            'readingTime' => $readingTime
        ],
        'books' => $books
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Book routes
    Route::resource('books', App\Http\Controllers\BookController::class);
    Route::post('/books/{book}/sessions', [App\Http\Controllers\ReadingSessionController::class, 'store'])->name('sessions.store');
    Route::delete('/sessions/{readingSession}', [App\Http\Controllers\ReadingSessionController::class, 'destroy'])->name('sessions.destroy');
});

require __DIR__.'/auth.php';
