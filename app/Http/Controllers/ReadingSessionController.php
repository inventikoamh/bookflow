<?php

namespace App\Http\Controllers;

use App\Models\ReadingSession;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ReadingSessionController extends Controller
{
    public function store(Request $request, Book $book)
    {
        // Ensure user owns this book
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'pages_from' => 'nullable|integer',
            'pages_to' => 'nullable|integer|gte:pages_from',
            'notes' => 'nullable|string',
        ]);

        $validated['book_id'] = $book->id;

        ReadingSession::create($validated);

        // Optional: Update book's current page if this session extends further
        if (isset($validated['pages_to']) && $validated['pages_to'] > $book->current_page) {
            $book->update(['current_page' => $validated['pages_to']]);
        }
        
        // If status is wishlist, auto-move to active
        if ($book->status === 'wishlist') {
            $book->update(['status' => 'active']);
        }

        return Redirect::back()->with('success', 'Reading session logged!');
    }

    public function destroy(ReadingSession $readingSession)
    {
        // Ensure user owns the book of this session
        if ($readingSession->book->user_id !== auth()->id()) {
            abort(403);
        }

        $readingSession->delete();

        return Redirect::back()->with('success', 'Session deleted.');
    }
}
