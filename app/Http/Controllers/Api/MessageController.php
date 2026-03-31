<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Services\MessageService;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function __construct(
        protected MessageService $messageService
    ) {
    }

    public function store(StoreMessageRequest $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user('api');

        abort_unless(
            $conversation->participants()->where('users.id', $user->id)->exists(),
            403,
            'You are not allowed to reply to this conversation.'
        );

        $message = $this->messageService->replyToConversation(
            $conversation,
            $user->id,
            $request->validated()['body']
        );

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => new MessageResource($message),
        ], 201);
    }
}