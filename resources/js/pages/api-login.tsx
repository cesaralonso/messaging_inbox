import InboxShellLayout from '@/layouts/inbox-shell-layout';

export default function ApiLoginPage() {
    return (
        <InboxShellLayout>
            <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-10">
                <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/30">
                    <div className="mb-6">
                        <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                            API Access
                        </div>
                        <h1 className="mt-2 text-2xl font-semibold text-white">
                            Iniciar sesión por API
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Usa las credenciales del backend JWT para entrar al inbox.
                        </p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Email</label>
                            <input
                                type="email"
                                defaultValue="admin@messaging-inbox.com"
                                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-zinc-300">Password</label>
                            <input
                                type="password"
                                defaultValue="123456"
                                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </InboxShellLayout>
    );
}