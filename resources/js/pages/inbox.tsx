import InboxShellLayout from '@/layouts/inbox-shell-layout';

type Conversation = {
    id: number;
    subject: string;
    customer_name: string;
    last_message: string;
    updated_at: string;
    unread_count: number;
};

const mockConversations: Conversation[] = [
    {
        id: 1,
        subject: 'Pedido #1042',
        customer_name: 'Carlos Ramírez',
        last_message: 'Necesito confirmar la dirección de entrega.',
        updated_at: 'Hace 8 min',
        unread_count: 2,
    },
    {
        id: 2,
        subject: 'Factura pendiente',
        customer_name: 'María Torres',
        last_message: '¿Me pueden reenviar el PDF de la factura?',
        updated_at: 'Hace 25 min',
        unread_count: 0,
    },
    {
        id: 3,
        subject: 'Soporte técnico',
        customer_name: 'Empresa Delta',
        last_message: 'Seguimos viendo el mismo error al iniciar sesión.',
        updated_at: 'Hace 1 h',
        unread_count: 4,
    },
];

export default function InboxPage() {
    return (
        <InboxShellLayout>
            <div className="flex h-[calc(100vh-73px)] min-h-0">
                <aside className="flex w-full max-w-md flex-col border-r border-zinc-800 bg-zinc-950">
                    <div className="border-b border-zinc-800 px-5 py-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-semibold text-white">Inbox</h1>
                                <p className="text-sm text-zinc-400">
                                    Conversaciones recientes y seguimiento.
                                </p>
                            </div>

                            <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200">
                                Nuevo
                            </button>
                        </div>

                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Buscar conversación..."
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="p-3">
                            {mockConversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    className="mb-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-900"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-white">
                                                {conversation.customer_name}
                                            </div>
                                            <div className="truncate text-sm text-zinc-400">
                                                {conversation.subject}
                                            </div>
                                        </div>

                                        <div className="shrink-0 text-xs text-zinc-500">
                                            {conversation.updated_at}
                                        </div>
                                    </div>

                                    <div className="mt-3 truncate text-sm text-zinc-300">
                                        {conversation.last_message}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400">
                                            Ticket
                                        </span>

                                        {conversation.unread_count > 0 && (
                                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-zinc-900">
                                                {conversation.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="hidden min-w-0 flex-1 flex-col bg-zinc-950 md:flex">
                    <div className="border-b border-zinc-800 px-6 py-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Carlos Ramírez
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    Pedido #1042 · Última actividad hace 8 min
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                                    Marcar leído
                                </button>
                                <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
                                    Archivar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                        <div className="mx-auto flex max-w-3xl flex-col gap-4">
                            <div className="max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                                <div className="text-xs text-zinc-500">Cliente</div>
                                <div className="mt-1 text-sm leading-6 text-zinc-200">
                                    Hola, necesito confirmar si mi pedido ya salió a ruta.
                                </div>
                            </div>

                            <div className="ml-auto max-w-xl rounded-2xl bg-white px-4 py-3 text-zinc-900">
                                <div className="text-xs text-zinc-500">Agente</div>
                                <div className="mt-1 text-sm leading-6">
                                    Sí, ya fue procesado. Solo necesito validar la dirección de entrega.
                                </div>
                            </div>

                            <div className="max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                                <div className="text-xs text-zinc-500">Cliente</div>
                                <div className="mt-1 text-sm leading-6 text-zinc-200">
                                    Perfecto, la dirección correcta es la del pedido original.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 px-6 py-4">
                        <div className="mx-auto flex max-w-3xl items-end gap-3">
                            <textarea
                                rows={3}
                                placeholder="Escribe una respuesta..."
                                className="min-h-[88px] flex-1 resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                            />

                            <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200">
                                Enviar
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </InboxShellLayout>
    );
}