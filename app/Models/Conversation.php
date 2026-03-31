<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'subject',
        'created_by',
        'status',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->withPivot('last_read_message_id')
            ->withTimestamps();
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->whereHas('participants', function (Builder $participantQuery) use ($userId) {
            $participantQuery->where('users.id', $userId);
        });
    }
}