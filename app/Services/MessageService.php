<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class MessageService
{
    public function replyToConversation(
        Conversation $conversation,
        int $authUserId,
        string $body
    ): Message {
        return DB::transaction(function () use ($conversation, $authUserId, $body) {
            $message = $conversation->messages()->create([
                'user_id' => $authUserId,
                'body' => $body,
            ]);

            $conversation->participants()->updateExistingPivot($authUserId, [
                'last_read_message_id' => $message->id,
            ]);

            return $message->load('user');
        });
    }
}