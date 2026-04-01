<?php

namespace Tests\Feature\Conversation;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConversationIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_filter_conversations_by_status(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $openConversation = Conversation::create([
            'subject' => 'Soporte abierto',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $closedConversation = Conversation::create([
            'subject' => 'Soporte cerrado',
            'created_by' => $john->id,
            'status' => 'closed',
        ]);

        $openConversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $closedConversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/conversations?status=open');

        $response->assertOk()
            ->assertJsonFragment(['subject' => 'Soporte abierto'])
            ->assertJsonMissing(['subject' => 'Soporte cerrado']);
    }

    public function test_user_can_search_conversations_by_subject(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $targetConversation = Conversation::create([
            'subject' => 'Factura pendiente',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $otherConversation = Conversation::create([
            'subject' => 'Reunión semanal',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $targetConversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $otherConversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/conversations?search=Factura');

        $response->assertOk()
            ->assertJsonFragment(['subject' => 'Factura pendiente'])
            ->assertJsonMissing(['subject' => 'Reunión semanal']);
    }

    public function test_user_can_search_conversations_by_participant_name(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create(['name' => 'Ana Soporte']);
        $pedro = User::factory()->create(['name' => 'Pedro Finanzas']);

        $conversationWithAna = Conversation::create([
            'subject' => 'Incidencia técnica',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversationWithPedro = Conversation::create([
            'subject' => 'Consulta administrativa',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversationWithAna->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $conversationWithPedro->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $pedro->id => ['last_read_message_id' => null],
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/conversations?search=Ana');

        $response->assertOk()
            ->assertJsonFragment(['subject' => 'Incidencia técnica'])
            ->assertJsonMissing(['subject' => 'Consulta administrativa']);
    }

    public function test_user_can_search_conversations_by_message_body(): void
    {
        $john = User::factory()->create();
        $ana = User::factory()->create();

        $targetConversation = Conversation::create([
            'subject' => 'Tema A',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $otherConversation = Conversation::create([
            'subject' => 'Tema B',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $targetConversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $otherConversation->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $targetConversation->messages()->create([
            'user_id' => $john->id,
            'body' => 'Necesito revisar el contrato urgente',
        ]);

        $otherConversation->messages()->create([
            'user_id' => $john->id,
            'body' => 'Solo es un saludo general',
        ]);

        $token = auth('api')->login($john);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/conversations?search=contrato');

        $response->assertOk()
            ->assertJsonFragment(['subject' => 'Tema A'])
            ->assertJsonMissing(['subject' => 'Tema B']);
    }
}