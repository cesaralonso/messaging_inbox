<?php

namespace Tests\Feature\Conversation;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConversationShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_view_conversation_if_not_participant(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();
        $outsider = User::factory()->create();

        $conversation = Conversation::create([
            'subject' => 'Privada',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $conversation->messages()->create([
            'user_id' => $john->id,
            'body' => 'Mensaje privado',
        ]);

        $token = auth('api')->login($outsider);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/conversations/{$conversation->id}");

        $response->assertStatus(403);
    }

    public function test_participant_can_view_conversation_detail(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $conversation = Conversation::create([
            'subject' => 'Soporte',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $conversation->messages()->create([
            'user_id' => $john->id,
            'body' => 'Necesito ayuda',
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/conversations/{$conversation->id}");

        $response
            ->assertOk()
            ->assertJsonFragment([
                'subject' => 'Soporte',
            ]);
    }
}