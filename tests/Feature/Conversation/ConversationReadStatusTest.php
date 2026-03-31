<?php

namespace Tests\Feature\Conversation;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConversationReadStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_unread_count_is_returned_correctly(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $conversation = Conversation::create([
            'subject' => 'Pendiente',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $firstMessage = $conversation->messages()->create([
            'user_id' => $john->id,
            'body' => 'Primer mensaje',
        ]);

        $secondMessage = $conversation->messages()->create([
            'user_id' => $ana->id,
            'body' => 'Respuesta de Ana',
        ]);

        $conversation->participants()->updateExistingPivot($john->id, [
            'last_read_message_id' => $firstMessage->id,
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/conversations/unread-count');

        $response
            ->assertOk()
            ->assertJson([
                'data' => [
                    'unread_count' => 1,
                ],
            ]);
    }

    public function test_user_can_mark_conversation_as_read(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $conversation = Conversation::create([
            'subject' => 'Pendiente',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $message1 = $conversation->messages()->create([
            'user_id' => $john->id,
            'body' => 'Hola',
        ]);

        $message2 = $conversation->messages()->create([
            'user_id' => $ana->id,
            'body' => 'Respuesta',
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->patchJson("/api/conversations/{$conversation->id}/read");

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Conversation marked as read.',
            ]);

        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $john->id,
            'last_read_message_id' => $message2->id,
        ]);
    }
}