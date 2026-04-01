import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useApiLogin } from '@/features/auth/hooks/useApiLogin';
import InboxShellLayout from '@/layouts/inbox-shell-layout';

export default function ApiLoginPage() {
    const { login, isLoading, error } = useApiLogin();

    const [email, setEmail] = useState('admin@messaging-inbox.com');
    const [password, setPassword] = useState('123456');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login({ email, password });
            window.location.href = '/inbox';
        } catch {
            //
        }
    };

    return (
        <InboxShellLayout> <>
            <Head title="API Login" />

            <div className="mx-auto mt-16 max-w-md rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900">
                <h1 className="text-xl font-semibold">API Login</h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Inicia sesión con JWT para usar el inbox.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </>
        </InboxShellLayout>
    );
}
