<?php

namespace Tests\Feature\Conversation;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConversationStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_conversation(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/conversations', [
                'subject' => 'Nuevo hilo',
                'participant_ids' => [$ana->id],
                'message' => 'Hola Ana, te escribo por soporte.',
            ]);

        $response
            ->assertCreated()
            ->assertJsonFragment([
                'message' => 'Conversation created successfully.',
                'subject' => 'Nuevo hilo',
                'status' => 'open',
            ]);

        $this->assertDatabaseHas('conversations', [
            'subject' => 'Nuevo hilo',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $this->assertDatabaseHas('messages', [
            'body' => 'Hola Ana, te escribo por soporte.',
            'user_id' => $john->id,
        ]);

        $this->assertDatabaseHas('conversation_participants', [
            'user_id' => $john->id,
        ]);

        $this->assertDatabaseHas('conversation_participants', [
            'user_id' => $ana->id,
        ]);
    }
}