<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\ConversationParticipant;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ConversationService
{
    public function getPaginatedForUser(
        int $userId,
        array $filters = []
    ): LengthAwarePaginator {
        $perPage = (int) ($filters['per_page'] ?? 10);
        $search = trim((string) ($filters['search'] ?? ''));
        $status = $filters['status'] ?? null;

        return Conversation::query()
            ->forUser($userId)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('subject', 'like', "%{$search}%")
                        ->orWhereHas('participants', function ($participantQuery) use ($search) {
                            $participantQuery
                                ->where('users.name', 'like', "%{$search}%")
                                ->orWhere('users.email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('messages', function ($messageQuery) use ($search) {
                            $messageQuery->where('body', 'like', "%{$search}%");
                        });
                });
            })
            ->when(
                !empty($status),
                fn ($query) => $query->where('status', $status)
            )
            ->with([
                'participants:id,name,email',
                'messages' => function ($query) {
                    $query->with('user:id,name,email')->latest('id');
                },
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
                'participants:id,name,email',
                'messages' => function ($query) {
                    $query->with('user:id,name,email')->oldest('id');
                },
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
                'participants:id,name,email',
                'messages.user:id,name,email',
            ]);
        });
    }

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

        if (!$lastMessage) {
            return;
        }

        $conversation->participants()->updateExistingPivot($userId, [
            'last_read_message_id' => $lastMessage->id,
        ]);
    }
}