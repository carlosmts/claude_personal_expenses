import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  ApiError,
  apiClient,
  getStoredCredentials,
  setStoredCredentials,
  setUnauthorizedHandler,
  type Credentials,
} from '../api/client';

export function AuthGate({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<Credentials | null>(() => getStoredCredentials());

  useEffect(() => {
    setUnauthorizedHandler(() => setCredentials(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  if (!credentials) {
    return (
      <LoginPage
        onSuccess={(nextCredentials) => {
          setStoredCredentials(nextCredentials);
          setCredentials(nextCredentials);
        }}
      />
    );
  }

  return <>{children}</>;
}

function LoginPage({ onSuccess }: { onSuccess: (credentials: Credentials) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    // Tentatively store so the request below actually sends this attempt's credentials.
    setStoredCredentials({ username, password });
    try {
      await apiClient.get('/users');
      onSuccess({ username, password });
    } catch (err) {
      setStoredCredentials(null);
      setError(
        err instanceof ApiError && err.status === 401
          ? 'Incorrect username or password.'
          : "Couldn't reach the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm dark:bg-gray-800"
      >
        <div className="mb-6 flex items-center gap-2">
          <img src="/logo.png" alt="Finbond" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Finbond</span>
        </div>

        <label className="mb-4 flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Username
          </span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            autoFocus
            required
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </label>

        <label className="mb-2 flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </label>

        <p className="mb-4 text-xs text-gray-400 dark:text-gray-500">
          First time signing in? Just pick a password — it'll be set for your username.
        </p>

        {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-950 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
