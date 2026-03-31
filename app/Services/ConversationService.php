<?php

namespace App\Services;

use App\Models\Conversation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

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

    public function createConversation(int $authUserId, array $data): Conversation
    {
        return DB::transaction(function () use ($authUserId, $data) {
            $conversation = Conversation::create([
                'subject' => $data['subject'],
                'created_by' => $authUserId,
                'status' => 'open',
            ]);

            $participantIds = collect($data['participant_ids'])
                ->push($authUserId)
                ->unique()
                ->values();

            $attachData = $participantIds->mapWithKeys(function ($participantId) {
                return [
                    $participantId => [
                        'last_read_message_id' => null,
                    ],
                ];
            })->toArray();

            $conversation->participants()->attach($attachData);

            $firstMessage = $conversation->messages()->create([
                'user_id' => $authUserId,
                'body' => $data['message'],
            ]);

            $conversation->participants()->updateExistingPivot($authUserId, [
                'last_read_message_id' => $firstMessage->id,
            ]);

            return $conversation->load([
                'participants',
                'messages.user',
            ]);
        });
    }
    use App\Models\ConversationParticipant;

    public function getUnreadCount(int $userId): int
    {
        $participants = ConversationParticipant::with(['conversation.messages'])
            ->where('user_id', $userId)
            ->get();

        $totalUnread = 0;

        foreach ($participants as $participant) {
            $lastReadId = $participant->last_read_message_id ?? 0;

            $unread = $participant->conversation->messages
                ->where('id', '>', $lastReadId)
                ->where('user_id', '!=', $userId)
                ->count();

            $totalUnread += $unread;
        }

        return $totalUnread;
    }
    
    public function markAsRead(int $conversationId, int $userId): void
    {
        $conversation = Conversation::with('messages')
            ->forUser($userId)
            ->findOrFail($conversationId);

        $lastMessage = $conversation->messages->sortByDesc('id')->first();

        if (! $lastMessage) {
            return;
        }

        $conversation->participants()->updateExistingPivot($userId, [
            'last_read_message_id' => $lastMessage->id,
        ]);
    }
}