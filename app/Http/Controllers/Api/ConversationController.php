<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Conversation\IndexConversationRequest;
use App\Http\Requests\Conversation\StoreConversationRequest;
use App\Http\Resources\ConversationDetailResource;
use App\Http\Resources\ConversationListResource;
use App\Models\Conversation;
use App\Services\ConversationService;
use Illuminate\Http\JsonResponse;

class ConversationController extends Controller
{
    public function __construct(
        protected ConversationService $conversationService
    ) {
    }

    public function index(IndexConversationRequest $request): JsonResponse
    {
        $user = $request->user('api');

        $conversations = $this->conversationService->getPaginatedForUser(
            $user->id,
            $request->validated()
        );

        return response()->json([
            'data' => ConversationListResource::collection($conversations->items()),
            'meta' => [
                'current_page' => $conversations->currentPage(),
                'per_page' => $conversations->perPage(),
                'total' => $conversations->total(),
                'last_page' => $conversations->lastPage(),
            ],
        ]);
    }

    public function show(Conversation $conversation): JsonResponse
    {
        $user = request()->user('api');

        abort_unless(
            $conversation->participants()->where('users.id', $user->id)->exists(),
            403,
            'You are not allowed to view this conversation.'
        );

        $conversation = $this->conversationService->getDetailForUser(
            $conversation->id,
            $user->id
        );

        return response()->json([
            'data' => new ConversationDetailResource($conversation),
        ]);
    }

    public function store(StoreConversationRequest $request): JsonResponse
    {
        $user = $request->user('api');

        $conversation = $this->conversationService->createConversation(
            $user->id,
            $request->validated()
        );

        return response()->json([
            'message' => 'Conversation created successfully.',
            'data' => [
                'id' => $conversation->id,
                'subject' => $conversation->subject,
                'status' => $conversation->status,
            ],
        ], 201);
    }
}