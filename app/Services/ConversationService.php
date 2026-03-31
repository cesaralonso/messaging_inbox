<?php

namespace App\Services;

use App\Models\Conversation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ConversationService
{
    public function getPaginatedForUser(
        int $userId,
        array $filters = []
    ): LengthAwarePaginator {
        $perPage = $filters['per_page'] ?? 10;

        return Conversation::query()
            ->forUser($userId)
            ->when(
                ! empty($filters['search']),
                fn ($query) => $query->where('subject', 'like', '%' . $filters['search'] . '%')
            )
            ->when(
                ! empty($filters['status']),
                fn ($query) => $query->where('status', $filters['status'])
            )
            ->with([
                'messages.user',
                'participants',
            ])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getDetailForUser(int $conversationId, int $userId): Conversation
    {
        return Conversation::query()
            ->forUser($userId)
            ->with([
                'participants',
                'messages.user',
            ])
            ->findOrFail($conversationId);
    }
}