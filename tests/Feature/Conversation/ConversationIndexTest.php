<?php

namespace Tests\Feature\Conversation;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConversationIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_only_their_conversations(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();
        $other = User::factory()->create();

        $conversationA = Conversation::create([
            'subject' => 'Admin and Ana',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversationA->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $conversationA->messages()->create([
            'user_id' => $john->id,
            'body' => 'Hola Ana',
        ]);

        $conversationB = Conversation::create([
            'subject' => 'Only other user',
            'created_by' => $other->id,
            'status' => 'open',
        ]);

        $conversationB->participants()->attach([
            $other->id => ['last_read_message_id' => null],
        ]);

        $conversationB->messages()->create([
            'user_id' => $other->id,
            'body' => 'Conversación privada',
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/conversations');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment([
                'subject' => 'Admin and Ana',
            ])
            ->assertJsonMissing([
                'subject' => 'Only other user',
            ]);
    }
}