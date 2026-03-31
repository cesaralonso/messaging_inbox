import { useEffect, useState } from 'react';
import { useApiAuthStore } from '@/features/auth/store/apiAuthStore';
import { useConversations } from '../hooks/useConversations';
import { useConversationDetail } from '../hooks/useConversationDetail';
import { useReplyToConversation } from '../hooks/useReplyToConversation';
import { conversationsApi } from '../api/conversationsApi';

export default function InboxPage() {
  const hydrateFromStorage = useApiAuthStore((state) => state.hydrateFromStorage);
  const isAuthenticated = useApiAuthStore((state) => state.isAuthenticated);
  const user = useApiAuthStore((state) => state.user);

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [replyBody, setReplyBody] = useState('');

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const conversations = useConversations({
    search,
    page: 1,
    per_page: 10,
  });

  const detail = useConversationDetail(selectedConversationId);
  const replyMutation = useReplyToConversation();

  const handleSelectConversation = async (conversationId: number) => {
    setSelectedConversationId(conversationId);

    try {
      await conversationsApi.markAsRead(conversationId);
    } catch {
      //
    }
  };

  const handleReply = async () => {
    if (!selectedConversationId || !replyBody.trim()) {
      return;
    }

    await replyMutation.reply(selectedConversationId, replyBody.trim());
    setReplyBody('');
    await detail.reload();
    await conversations.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <p className="mt-2 text-sm text-gray-600">
          No hay sesión API activa. Primero inicia sesión con JWT.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 p-6">
      <div className="col-span-4 rounded-xl border bg-white p-4">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Inbox</h1>
          <p className="text-sm text-gray-500">{user?.name}</p>
        </div>

        <input
          type="text"
          placeholder="Buscar por asunto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-md border px-3 py-2 text-sm"
        />

        {conversations.isLoading && <p className="text-sm">Cargando conversaciones...</p>}
        {conversations.error && (
          <p className="text-sm text-red-600">{conversations.error}</p>
        )}

        <div className="space-y-2">
          {conversations.items.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => void handleSelectConversation(conversation.id)}
              className="block w-full rounded-lg border p-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{conversation.subject}</span>
                {conversation.unread_count > 0 && (
                  <span className="rounded-full bg-black px-2 py-0.5 text-xs text-white">
                    {conversation.unread_count}
                  </span>
                )}
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {conversation.last_message?.body ?? 'Sin mensajes'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-8 rounded-xl border bg-white p-4">
        {!selectedConversationId && (
          <div className="text-sm text-gray-500">
            Selecciona una conversación para ver el detalle.
          </div>
        )}

        {detail.isLoading && <p className="text-sm">Cargando conversación...</p>}
        {detail.error && <p className="text-sm text-red-600">{detail.error}</p>}

        {detail.conversation && (
          <div>
            <div className="border-b pb-3">
              <h2 className="text-lg font-semibold">{detail.conversation.subject}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Participantes:{' '}
                {detail.conversation.participants.map((participant) => participant.name).join(', ')}
              </p>
            </div>

            <div className="my-4 space-y-3">
              {detail.conversation.messages.map((message) => (
                <div key={message.id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{message.sender.name}</span>
                    <span className="text-xs text-gray-500">{message.created_at}</span>
                  </div>
                  <p className="text-sm text-gray-700">{message.body}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Escribe una respuesta..."
                className="min-h-[100px] w-full rounded-md border px-3 py-2 text-sm"
              />

              {replyMutation.error && (
                <p className="mt-2 text-sm text-red-600">{replyMutation.error}</p>
              )}

              <button
                type="button"
                onClick={() => void handleReply()}
                disabled={replyMutation.isSubmitting}
                className="mt-3 rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {replyMutation.isSubmitting ? 'Enviando...' : 'Responder'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}