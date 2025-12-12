<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $books = Book::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Books/Index', [
            'books' => $books
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Books/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'library_name' => 'nullable|string|max:255',
            'note' => 'nullable|string',
            'duration' => 'nullable|string',
            'issue_date' => 'nullable|date',
            'return_date' => 'nullable|date|after_or_equal:issue_date',
            'total_pages' => 'nullable|integer|min:1',
            'cover_image' => 'nullable|image|max:20480',
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = uniqid() . '.webp';
            $path = storage_path('app/public/book-covers/' . $filename);
            
            // Create directory if it doesn't exist
            if (!file_exists(storage_path('app/public/book-covers'))) {
                mkdir(storage_path('app/public/book-covers'), 0755, true);
            }
            
            // Optimize image: resize to max 800x1200, convert to WebP at 80% quality
            Image::read($file)
                ->scaleDown(800, 1200)
                ->toWebp(80)
                ->save($path);
            
            $validated['cover_image'] = 'book-covers/' . $filename;
        }

        $book = Book::create($validated);

        return redirect()->route('books.show', $book)->with('success', 'Book added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        // Ensure user owns this book
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Books/Show', [
            'book' => $book->load('readingSessions'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        // Ensure user owns this book
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Books/Edit', [
            'book' => $book
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        // Ensure user owns this book
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'library_name' => 'nullable|string|max:255',
            'note' => 'nullable|string',
            'duration' => 'nullable|string',
            'issue_date' => 'nullable|date',
            'return_date' => 'nullable|date|after_or_equal:issue_date',
            'returned_at' => 'nullable|date',
            'status' => 'in:active,completed,wishlist',
            'current_page' => 'nullable|integer|min:0',
            'total_pages' => 'nullable|integer|min:1',
            'cover_image' => 'nullable|image|max:20480',
        ]);

        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($book->cover_image) {
                \Storage::disk('public')->delete($book->cover_image);
            }
            
            $file = $request->file('cover_image');
            $filename = uniqid() . '.webp';
            $path = storage_path('app/public/book-covers/' . $filename);
            
            // Create directory if it doesn't exist
            if (!file_exists(storage_path('app/public/book-covers'))) {
                mkdir(storage_path('app/public/book-covers'), 0755, true);
            }
            
            // Optimize image: resize to max 800x1200, convert to WebP at 80% quality
            Image::read($file)
                ->scaleDown(800, 1200)
                ->toWebp(80)
                ->save($path);
            
            $validated['cover_image'] = 'book-covers/' . $filename;
        } else {
            // Don't update cover_image if no new file was uploaded
            unset($validated['cover_image']);
        }

        // Auto-set returned_at if status changes to completed
        if (isset($validated['status']) && $validated['status'] === 'completed' && !$book->returned_at) {
            $validated['returned_at'] = now();
        } 
        // Optional: clear returned_at if moving back to active? 
        // The prompt says "If return_datetime is set -> status = returned". 
        // So let's ensure consistency.
        if (isset($validated['status']) && $validated['status'] !== 'completed') {
             $validated['returned_at'] = null;
        }

        $book->update($validated);

        return redirect()->route('books.show', $book)->with('success', 'Book updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        // Ensure user owns this book
        if ($book->user_id !== auth()->id()) {
            abort(403);
        }

        // Delete cover image if exists
        if ($book->cover_image) {
            \Storage::disk('public')->delete($book->cover_image);
        }

        $book->delete();

        return redirect()->route('books.index')->with('success', 'Book deleted successfully!');
    }
}
