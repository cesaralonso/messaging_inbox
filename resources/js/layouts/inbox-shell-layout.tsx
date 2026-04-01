import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { Search, SquarePen, Inbox, KeyRound, LayoutDashboard } from 'lucide-react';

const navItems = [
    { label: 'Inbox', href: '/inbox', icon: Inbox },
    { label: 'API Login', href: '/api-login', icon: KeyRound },
];

type InboxShellLayoutProps = PropsWithChildren<{
    onNewMessage?: () => void;
}>;

export default function InboxShellLayout({
    children,
    onNewMessage,
}: InboxShellLayoutProps) {
    const page = usePage();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto min-h-screen max-w-7xl bg-white shadow-sm">
                <header className="border-b border-slate-200">
                    <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                                <Inbox className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                    Messaging
                                </div>
                                <div className="text-2xl font-bold text-slate-900">
                                    MiInbox
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <div className="relative min-w-[260px]">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={onNewMessage}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                            >
                                <SquarePen className="h-4 w-4" />
                                Nuevo mensaje
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 px-6 py-3">
                        <nav className="flex flex-wrap gap-2">
                            {navItems.map((item) => {
                                const active = page.url === item.href || page.url.startsWith(item.href + '/');
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={[
                                            'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                                            active
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                        ].join(' ')}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}