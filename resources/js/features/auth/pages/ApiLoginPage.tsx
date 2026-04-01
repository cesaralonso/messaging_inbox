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
        <InboxShellLayout>
            <Head title="API Login" />

            <div className="mx-auto max-w-xl border border-[#8a8a8a] p-8">
                <h1 className="text-2xl font-semibold">API Login</h1>
                <p className="mt-2 text-sm text-[#cfcfcf]">
                    Inicia sesión con JWT para usar el inbox.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm">Email</label>
                        <input
                            type="email"
                            className="w-full border border-[#8a8a8a] bg-[#262626] px-3 py-3 text-sm text-white outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm">Password</label>
                        <input
                            type="password"
                            className="w-full border border-[#8a8a8a] bg-[#262626] px-3 py-3 text-sm text-white outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="border border-[#8a8a8a] px-5 py-3 hover:bg-[#2d2d2d] disabled:opacity-50"
                    >
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </InboxShellLayout>
    );
}