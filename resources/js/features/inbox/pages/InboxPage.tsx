import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { conversationsApi } from '@/features/inbox/api/conversationsApi';
import { useApiAuthStore } from '@/features/auth/store/apiAuthStore';
import { useConversationDetail } from '@/features/inbox/hooks/useConversationDetail';
import { useConversations } from '@/features/inbox/hooks/useConversations';
import { useReplyToConversation } from '@/features/inbox/hooks/useReplyToConversation';
import { useUnreadCount } from '@/features/inbox/hooks/useUnreadCount';

export default function InboxPage() {
    const hydrateFromStorage = useApiAuthStore((s) => s.hydrateFromStorage);
    const clearSession = useApiAuthStore((s) => s.clearSession);
    const hydrated = useApiAuthStore((s) => s.hydrated);
    const isAuthenticated = useApiAuthStore((s) => s.isAuthenticated);
    const user = useApiAuthStore((s) => s.user);

    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [replyBody, setReplyBody] = useState('');

    useEffect(() => {
        hydrateFromStorage();
    }, [hydrateFromStorage]);

    const apiEnabled = hydrated && isAuthenticated;

    const conversations = useConversations(
        {
            search,
            page: 1,
            per_page: 10,
        },
        { enabled: apiEnabled },
    );

    const detail = useConversationDetail(selectedConversationId, {
        enabled: apiEnabled,
    });

    const replyMutation = useReplyToConversation();
    const unread = useUnreadCount({ enabled: apiEnabled });

    useEffect(() => {
        if (!selectedConversationId && conversations.items.length > 0) {
            setSelectedConversationId(conversations.items[0].id);
        }
    }, [selectedConversationId, conversations.items]);

    const selectedConversation = useMemo(
        () => conversations.items.find((conversation) => conversation.id === selectedConversationId) ?? null,
        [conversations.items, selectedConversationId],
    );

    const handleSelectConversation = async (id: number) => {
        setSelectedConversationId(id);

        try {
            await conversationsApi.markAsRead(id);
            await Promise.all([unread.reload(), conversations.reload()]);
        } catch {
            // el detalle se carga por efecto al cambiar el id seleccionado
        }
    };

    const handleReply = async () => {
        if (!selectedConversationId || !replyBody.trim()) {
            return;
        }

        await replyMutation.reply(selectedConversationId, replyBody.trim());
        setReplyBody('');
        await Promise.all([detail.reload(), conversations.reload(), unread.reload()]);
    };

    const handleLogout = () => {
        clearSession();
        window.location.href = '/api-login';
    };

    if (!hydrated) {
        return (
            <>
                <Head title="Inbox" />
                <div className="p-6 text-sm text-neutral-500">Cargando sesión API...</div>
            </>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <Head title="Inbox" />
                <div className="mx-auto max-w-xl p-6">
                    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-neutral-900">
                        <h1 className="text-xl font-semibold">Inbox</h1>
                        <p className="mt-2 text-sm text-neutral-600">
                            No hay sesión API activa. Primero entra por el login JWT.
                        </p>

                        <a
                            href="/api-login"
                            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm text-white"
                        >
                            Ir a API Login
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Inbox" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Internal Messaging
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold">Inbox</h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            {user?.name} · {unread.isLoading ? 'actualizando...' : `${unread.count} no leídos`}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                        Cerrar sesión API
                    </button>
                </div>

                <div className="grid flex-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
                    <section className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-neutral-900">
                        <div className="mb-4 space-y-3">
                            <input
                                type="text"
                                placeholder="Buscar conversación..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />

                            <div className="text-xs text-neutral-500">
                                {conversations.meta ? `${conversations.meta.total} conversaciones` : 'Sin datos'}
                            </div>
                        </div>

                        {conversations.isLoading && (
                            <p className="text-sm text-neutral-500">Cargando conversaciones...</p>
                        )}

                        {conversations.error && (
                            <p className="text-sm text-red-600">{conversations.error}</p>
                        )}

                        {!conversations.isLoading && conversations.items.length === 0 && (
                            <div className="rounded-xl border border-dashed p-6 text-sm text-neutral-500">
                                No hay conversaciones para mostrar.
                            </div>
                        )}

                        <div className="space-y-2">
                            {conversations.items.map((conversation) => {
                                const active = conversation.id === selectedConversationId;

                                return (
                                    <button
                                        key={conversation.id}
                                        onClick={() => handleSelectConversation(conversation.id)}
                                        className={[
                                            'block w-full rounded-xl border p-3 text-left transition',
                                            active
                                                ? 'border-neutral-900 bg-neutral-100 dark:border-neutral-200 dark:bg-neutral-800'
                                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                                        ].join(' ')}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-semibold">
                                                    {conversation.subject}
                                                </div>
                                                <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                                                    {conversation.last_message?.body ?? 'Sin mensajes'}
                                                </p>
                                            </div>

                                            {conversation.unread_count > 0 && (
                                                <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
                                                    {conversation.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="flex min-h-[540px] flex-col rounded-2xl border bg-white shadow-sm dark:bg-neutral-900">
                        {!selectedConversationId && (
                            <div className="flex flex-1 items-center justify-center p-8 text-sm text-neutral-500">
                                Selecciona una conversación.
                            </div>
                        )}

                        {selectedConversationId && (
                            <>
                                <div className="border-b p-5">
                                    <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                                        Conversación
                                    </div>
                                    <h2 className="mt-1 text-xl font-semibold">
                                        {detail.conversation?.subject ?? selectedConversation?.subject ?? 'Cargando...' }
                                    </h2>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto p-5">
                                    {detail.isLoading && (
                                        <p className="text-sm text-neutral-500">Cargando detalle...</p>
                                    )}

                                    {detail.error && (
                                        <p className="text-sm text-red-600">{detail.error}</p>
                                    )}

                                    {detail.conversation?.messages.map((message) => (
                                        <article key={message.id} className="rounded-xl border p-4">
                                            <div className="mb-1 text-sm font-semibold">
                                                {message.sender.name}
                                            </div>
                                            <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                                                {message.body}
                                            </p>
                                        </article>
                                    ))}
                                </div>

                                <div className="border-t p-5">
                                    <textarea
                                        value={replyBody}
                                        onChange={(e) => setReplyBody(e.target.value)}
                                        placeholder="Escribe una respuesta..."
                                        className="min-h-28 w-full rounded-xl border p-3 text-sm"
                                    />

                                    {replyMutation.error && (
                                        <p className="mt-2 text-sm text-red-600">{replyMutation.error}</p>
                                    )}

                                    <div className="mt-3 flex justify-end">
                                        <button
                                            onClick={handleReply}
                                            disabled={replyMutation.isSubmitting || !replyBody.trim()}
                                            className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                                        >
                                            {replyMutation.isSubmitting ? 'Enviando...' : 'Responder'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

InboxPage.layout = {
    breadcrumbs: [
        {
            title: 'Inbox',
            href: '/inbox',
        },
    ],
};
