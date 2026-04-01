<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $currentUserId = $request->user('api')->id;

        $participant = $this->participants->firstWhere('id', $currentUserId);
        $lastReadMessageId = $participant?->pivot?->last_read_message_id;

        $lastMessage = $this->messages->sortByDesc('id')->first();

        $unreadCount = $this->messages
            ->where('id', '>', $lastReadMessageId ?? 0)
            ->where('user_id', '!=', $currentUserId)
            ->count();

        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'status' => $this->status,
            'unread_count' => $unreadCount,
            'last_message' => $lastMessage ? [
                'id' => $lastMessage->id,
                'body' => $lastMessage->body,
                'created_at' => $lastMessage->created_at?->toISOString(),
                'sender' => [
                    'id' => $lastMessage->user?->id,
                    'name' => $lastMessage->user?->name,
                    'email' => $lastMessage->user?->email,
                ],
            ] : null,
        ];
    }
}