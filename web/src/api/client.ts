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

const CREDENTIALS_KEY = 'authCredentials';

export interface Credentials {
  username: string;
  password: string;
}

export function getStoredCredentials(): Credentials | null {
  const raw = localStorage.getItem(CREDENTIALS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Credentials;
  } catch {
    return null;
  }
}

export function setStoredCredentials(credentials: Credentials | null): void {
  if (credentials) {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  } else {
    localStorage.removeItem(CREDENTIALS_KEY);
  }
}

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

function authHeader(): Record<string, string> {
  const credentials = getStoredCredentials();
  if (!credentials) return {};
  return { Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}` };
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
        ...authHeader(),
        ...init.headers,
      },
    });
  } catch (error) {
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }

  if (!response.ok) {
    if (response.status === 401) {
      setStoredCredentials(null);
      onUnauthorized?.();
    }
    const body = await response.text();
    let message = body || response.statusText;
    try {
      const parsed: unknown = JSON.parse(body);
      if (parsed && typeof parsed === 'object' && 'detail' in parsed && typeof parsed.detail === 'string') {
        message = parsed.detail;
      }
    } catch {
      // Body wasn't JSON — fall back to the raw text set above.
    }
    throw new ApiError(response.status, message);
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
