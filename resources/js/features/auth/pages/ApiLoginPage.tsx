import { useState } from 'react';
import { useApiLogin } from '../hooks/useApiLogin';

export default function ApiLoginPage() {
  const { login, isLoading, error } = useApiLogin();

  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password123');

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
    <div className="mx-auto mt-16 max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-xl font-semibold">API Login</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
  );
}