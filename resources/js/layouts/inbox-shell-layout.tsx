import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

const navItems = [
    { label: 'Inbox', href: '/inbox' },
    { label: 'API Login', href: '/api-login' },
    { label: 'Dashboard', href: '/dashboard' },
];

export default function InboxShellLayout({ children }: PropsWithChildren) {
    const page = usePage();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-900/70 lg:flex lg:flex-col">
                    <div className="border-b border-zinc-800 px-6 py-5">
                        <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                            Messaging Inbox
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-white">
                            Control Panel
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-4">
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const active = page.url === item.href || page.url.startsWith(item.href + '/');

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={[
                                            'block rounded-xl px-4 py-3 text-sm font-medium transition',
                                            active
                                                ? 'bg-white text-zinc-900'
                                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white',
                                        ].join(' ')}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </aside>

                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    <header className="border-b border-zinc-800 bg-zinc-950/80 px-4 py-4 lg:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                                    Workspace
                                </div>
                                <div className="text-lg font-semibold text-white">
                                    Messaging Inbox
                                </div>
                            </div>

                            <div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                                {page.url}
                            </div>
                        </div>
                    </header>

                    <main className="min-h-0 flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}