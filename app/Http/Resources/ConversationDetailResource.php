<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'status' => $this->status,
            'participants' => $this->participants->map(fn ($participant) => [
                'id' => $participant->id,
                'name' => $participant->name,
                'email' => $participant->email,
            ])->values(),
            'messages' => MessageResource::collection($this->messages),
        ];
    }
}