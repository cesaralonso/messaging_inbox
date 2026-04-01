import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import {
    Search,
    MailPlus,
    SendHorizontal,
    LogOut,
    Clock3,
    MailOpen,
    X,
} from 'lucide-react';

import { conversationsApi } from '@/features/inbox/api/conversationsApi';
import { useApiAuthStore } from '@/features/auth/store/apiAuthStore';
import { useConversationDetail } from '@/features/inbox/hooks/useConversationDetail';
import { useConversations } from '@/features/inbox/hooks/useConversations';
import { useReplyToConversation } from '@/features/inbox/hooks/useReplyToConversation';
import { useUnreadCount } from '@/features/inbox/hooks/useUnreadCount';
import type { InboxUserOption } from '@/features/inbox/types/inbox.types';
import InboxShellLayout from '@/layouts/inbox-shell-layout';

export default function InboxPage() {
    const hydrateFromStorage = useApiAuthStore((s) => s.hydrateFromStorage);
    const clearSession = useApiAuthStore((s) => s.clearSession);
    const hydrated = useApiAuthStore((s) => s.hydrated);
    const isAuthenticated = useApiAuthStore((s) => s.isAuthenticated);
    const user = useApiAuthStore((s) => s.user);

    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'open' | 'closed' | ''>('');
    const [replyBody, setReplyBody] = useState('');

    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeParticipantId, setComposeParticipantId] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [isComposeSubmitting, setIsComposeSubmitting] = useState(false);
    const [composeError, setComposeError] = useState<string | null>(null);

    const [users, setUsers] = useState<InboxUserOption[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);

    useEffect(() => {
        hydrateFromStorage();
    }, [hydrateFromStorage]);

    const apiEnabled = hydrated && isAuthenticated;

    const conversations = useConversations(
        {
            search,
            status,
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

    useEffect(() => {
        const loadUsers = async () => {
            if (!apiEnabled) return;

            try {
                setUsersLoading(true);
                setUsersError(null);

                const response = await conversationsApi.users();
                setUsers(response.data);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'No se pudieron cargar los usuarios.';
                setUsersError(message);
            } finally {
                setUsersLoading(false);
            }
        };

        void loadUsers();
    }, [apiEnabled]);

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
            //
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

    const openCompose = () => {
        setComposeError(null);
        setIsComposeOpen(true);
    };

    const closeCompose = () => {
        setIsComposeOpen(false);
        setComposeParticipantId('');
        setComposeSubject('');
        setComposeBody('');
        setComposeError(null);
        setIsComposeSubmitting(false);
    };

    const handleComposeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!composeParticipantId || !composeSubject.trim() || !composeBody.trim()) {
            setComposeError('Completa destinatario, asunto y mensaje.');
            return;
        }

        try {
            setIsComposeSubmitting(true);
            setComposeError(null);

            const response = await conversationsApi.create({
                subject: composeSubject.trim(),
                participant_ids: [Number(composeParticipantId)],
                message: composeBody.trim(),
            });

            closeCompose();

            await Promise.all([conversations.reload(), unread.reload()]);

            setSelectedConversationId(response.data.id);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo crear la conversación.';
            setComposeError(message);
        } finally {
            setIsComposeSubmitting(false);
        }
    };

    return (
        <InboxShellLayout onNewMessage={openCompose}>
            <Head title="Inbox" />

            {!hydrated && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                    Cargando sesión API...
                </div>
            )}

            {hydrated && !isAuthenticated && (
                <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-xl font-semibold text-slate-900">Inbox</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        No hay sesión API activa. Primero entra por el login JWT.
                    </p>

                    <a
                        href="/api-login"
                        className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                        Ir a API Login
                    </a>
                </div>
            )}

            {hydrated && isAuthenticated && (
                <>
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid min-h-[740px] grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <aside className="border-b border-slate-200 bg-slate-50/70 lg:border-b-0 lg:border-r">
                                <div className="border-b border-slate-200 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h1 className="text-lg font-semibold text-slate-900">
                                                Lista de conversaciones
                                            </h1>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {user?.name} · {unread.isLoading ? 'Actualizando...' : `${unread.count} no leídos`}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={openCompose}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800"
                                            title="Nuevo mensaje"
                                        >
                                            <MailPlus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="relative mt-4">
                                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar conversación..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as 'open' | 'closed' | '')}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
                                        >
                                            <option value="">Todos los estados</option>
                                            <option value="open">Abiertas</option>
                                            <option value="closed">Cerradas</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="max-h-[calc(740px-120px)] space-y-2 overflow-y-auto p-3">
                                    {conversations.isLoading && (
                                        <p className="px-2 py-3 text-sm text-slate-500">
                                            Cargando conversaciones...
                                        </p>
                                    )}

                                    {conversations.error && (
                                        <p className="px-2 py-3 text-sm text-red-600">
                                            {conversations.error}
                                        </p>
                                    )}

                                    {!conversations.isLoading && conversations.items.length === 0 && (
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                                            No hay conversaciones para mostrar.
                                        </div>
                                    )}

                                    {conversations.items.map((conversation) => {
                                        const active = conversation.id === selectedConversationId;

                                        return (
                                            <button
                                                key={conversation.id}
                                                onClick={() => handleSelectConversation(conversation.id)}
                                                className={[
                                                    'block w-full rounded-2xl border p-4 text-left transition',
                                                    active
                                                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                                                ].join(' ')}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-sm font-semibold">
                                                            {conversation.subject}
                                                        </div>
                                                        <div
                                                            className={[
                                                                'mt-2 line-clamp-2 text-sm',
                                                                active ? 'text-slate-200' : 'text-slate-500',
                                                            ].join(' ')}
                                                        >
                                                            {conversation.last_message?.body ?? 'Sin mensajes'}
                                                        </div>
                                                    </div>

                                                    {conversation.unread_count > 0 && (
                                                        <span
                                                            className={[
                                                                'inline-flex min-w-6 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold',
                                                                active
                                                                    ? 'bg-white text-slate-900'
                                                                    : 'bg-slate-900 text-white',
                                                            ].join(' ')}
                                                        >
                                                            {conversation.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </aside>

                            <section className="flex flex-col">
                                {!selectedConversationId && (
                                    <div className="flex flex-1 items-center justify-center p-10 text-sm text-slate-500">
                                        Selecciona una conversación.
                                    </div>
                                )}

                                {selectedConversationId && (
                                    <>
                                        <div className="border-b border-slate-200 px-6 py-5">
                                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-500">
                                                        Área de lectura / redacción
                                                    </div>

                                                    <div className="mt-3 inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-900">
                                                        {detail.conversation?.subject ??
                                                            selectedConversation?.subject ??
                                                            'Asunto del mensaje'}
                                                    </div>

                                                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                                        <Clock3 className="h-4 w-4" />
                                                        <span>[Fecha y hora]</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <MailOpen className="h-4 w-4" />
                                                        Marcar leído
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={handleLogout}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Cerrar sesión
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/40 px-6 py-6">
                                            {detail.isLoading && (
                                                <p className="text-sm text-slate-500">Cargando detalle...</p>
                                            )}

                                            {detail.error && (
                                                <p className="text-sm text-red-600">{detail.error}</p>
                                            )}

                                            {detail.conversation?.messages.map((message) => (
                                                <article
                                                    key={message.id}
                                                    className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                                >
                                                    <div className="mb-2 text-sm font-semibold text-slate-900">
                                                        {message.sender.name}
                                                    </div>
                                                    <p className="text-sm leading-7 text-slate-700">
                                                        {message.body}
                                                    </p>
                                                </article>
                                            ))}
                                        </div>

                                        <div className="border-t border-slate-200 bg-white px-6 py-5">
                                            <div className="mx-auto max-w-4xl">
                                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                                    Escribir respuesta...
                                                </label>

                                                <textarea
                                                    value={replyBody}
                                                    onChange={(e) => setReplyBody(e.target.value)}
                                                    placeholder="Redacta tu mensaje..."
                                                    className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                                />

                                                {replyMutation.error && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {replyMutation.error}
                                                    </p>
                                                )}

                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        onClick={handleReply}
                                                        disabled={replyMutation.isSubmitting || !replyBody.trim()}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                                                    >
                                                        <SendHorizontal className="h-4 w-4" />
                                                        {replyMutation.isSubmitting ? 'Enviando...' : 'Enviar'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>
                    </div>

                    {isComposeOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
                                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Nuevo mensaje
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Crea una conversación nueva desde el inbox.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={closeCompose}
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleComposeSubmit} className="space-y-5 px-6 py-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Destinatario
                                        </label>

                                        <select
                                            value={composeParticipantId}
                                            onChange={(e) => setComposeParticipantId(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                                        >
                                            <option value="">
                                                Selecciona un usuario
                                            </option>

                                            {users.map((recipient) => (
                                                <option key={recipient.id} value={recipient.id}>
                                                    {recipient.name} · {recipient.email}
                                                </option>
                                            ))}
                                        </select>

                                        {usersLoading && (
                                            <p className="mt-2 text-sm text-slate-500">
                                                Cargando usuarios...
                                            </p>
                                        )}

                                        {usersError && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {usersError}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Asunto
                                        </label>
                                        <input
                                            type="text"
                                            value={composeSubject}
                                            onChange={(e) => setComposeSubject(e.target.value)}
                                            placeholder="Asunto del mensaje"
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Mensaje
                                        </label>
                                        <textarea
                                            value={composeBody}
                                            onChange={(e) => setComposeBody(e.target.value)}
                                            placeholder="Escribe el contenido del mensaje..."
                                            className="min-h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                                        />
                                    </div>

                                    {composeError && (
                                        <p className="text-sm text-red-600">{composeError}</p>
                                    )}

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeCompose}
                                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                isComposeSubmitting ||
                                                !composeParticipantId ||
                                                !composeSubject.trim() ||
                                                !composeBody.trim()
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
                                        >
                                            <SendHorizontal className="h-4 w-4" />
                                            {isComposeSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </InboxShellLayout>
    );
}