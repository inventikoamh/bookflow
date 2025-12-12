<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Update books table
        Schema::table('books', function (Blueprint $table) {
            $table->string('library_name')->nullable()->after('author');
            $table->timestamp('returned_at')->nullable()->after('return_date');
        });

        // Create reading_sessions table
        Schema::create('reading_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->timestamp('start_datetime');
            $table->timestamp('end_datetime');
            $table->integer('pages_from')->nullable();
            $table->integer('pages_to')->nullable(); // Renamed from pages_read to pages_to for clarity
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_sessions');
        
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['library_name', 'returned_at']);
        });
    }
};
