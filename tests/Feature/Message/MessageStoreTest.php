<?php

namespace Tests\Feature\Message;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_participant_can_reply_to_conversation(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $conversation = Conversation::create([
            'subject' => 'Incidencia',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $conversation->messages()->create([
            'user_id' => $john->id,
            'body' => 'Tengo una incidencia',
        ]);

        $token = auth('api')->login($ana);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson("/api/conversations/{$conversation->id}/messages", [
                'body' => 'Te ayudo a revisarla.',
            ]);

        $response
            ->assertCreated()
            ->assertJsonFragment([
                'message' => 'Message sent successfully.',
                'body' => 'Te ayudo a revisarla.',
            ]);

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'user_id' => $ana->id,
            'body' => 'Te ayudo a revisarla.',
        ]);
    }

    public function test_non_participant_cannot_reply_to_conversation(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();
        $outsider = User::factory()->create();

        $conversation = Conversation::create([
            'subject' => 'Incidencia',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $token = auth('api')->login($outsider);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson("/api/conversations/{$conversation->id}/messages", [
                'body' => 'No debería poder responder.',
            ]);

        $response->assertStatus(403);
    }
}