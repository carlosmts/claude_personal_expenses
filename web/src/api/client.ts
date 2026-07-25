// Thin fetch wrapper shared by all API calls. Mirrors the iOS APIClient's
// design: a single request pipeline, typed errors, and a base URL that can
// be overridden at runtime (Settings page) without rebuilding the app.

const BASE_URL_OVERRIDE_KEY = 'backendBaseUrlOverride';

const DEFAULT_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000';

export function getBaseUrl(): string {
  return localStorage.getItem(BASE_URL_OVERRIDE_KEY) ?? DEFAULT_BASE_URL;
}

export function getDefaultBaseUrl(): string {
  return DEFAULT_BASE_URL;
}

export function setBaseUrlOverride(url: string | null): void {
  if (url) {
    localStorage.setItem(BASE_URL_OVERRIDE_KEY, url);
  } else {
    localStorage.removeItem(BASE_URL_OVERRIDE_KEY);
  }
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
  } catch (error) {
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(response.status, body || response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function toQueryString(params?: Record<string, string | number>): string {
  if (!params) return '';
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    query.set(key, String(value));
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number>) =>
    request<T>(`${path}${toQueryString(params)}`),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
