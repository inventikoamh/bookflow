<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->text('note')->nullable()->after('status');
            $table->string('duration')->nullable()->after('note');
            $table->longText('description')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn(['note', 'duration']);
            $table->text('description')->nullable()->change();
        });
    }
};
