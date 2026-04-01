import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useApiLogin } from '@/features/auth/hooks/useApiLogin';

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
            // el error ya se refleja en pantalla
        }
    };

    return (
        <>
            <Head title="API Login" />

            <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-white p-6 shadow-sm dark:bg-neutral-900">
                <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                        JWT + Inertia
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold">API Login</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        Inicia sesión con el guard API para abrir el inbox sin usar la sesión web de Laravel.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="rounded-lg border bg-neutral-50 p-3 text-xs text-neutral-600 dark:bg-neutral-950/40">
                        Demo seed: <strong>admin@messaging-inbox.com</strong> / <strong>123456</strong>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-black px-4 py-2.5 text-sm text-white disabled:opacity-50"
                    >
                        {isLoading ? 'Ingresando...' : 'Ingresar al inbox'}
                    </button>
                </form>
            </div>
        </>
    );
}
