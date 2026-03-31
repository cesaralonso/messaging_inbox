<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->timestamps();

            $table->index('status');
            $table->index('created_by');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};