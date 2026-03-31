<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        $john = User::where('email', 'admin@messaging-inbox.com')->first();
        $ana = User::where('email', 'ana@example.com')->first();
        $support = User::where('email', 'soporte@example.com')->first();

        if (! $john || ! $ana || ! $support) {
            return;
        }

        $conversation1 = Conversation::create([
            'subject' => 'Factura pendiente',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation1->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $ana->id => ['last_read_message_id' => null],
        ]);

        $message1 = $conversation1->messages()->create([
            'user_id' => $john->id,
            'body' => 'Hola, necesito ayuda con una factura pendiente.',
        ]);

        $message2 = $conversation1->messages()->create([
            'user_id' => $ana->id,
            'body' => 'Claro, compárteme más detalle y lo reviso.',
        ]);

        $conversation1->participants()->updateExistingPivot($john->id, [
            'last_read_message_id' => $message1->id,
        ]);

        $conversation2 = Conversation::create([
            'subject' => 'Acceso al sistema',
            'created_by' => $john->id,
            'status' => 'open',
        ]);

        $conversation2->participants()->attach([
            $john->id => ['last_read_message_id' => null],
            $support->id => ['last_read_message_id' => null],
        ]);

        $conversation2->messages()->create([
            'user_id' => $john->id,
            'body' => 'No puedo iniciar sesión en el panel.',
        ]);
    }
}