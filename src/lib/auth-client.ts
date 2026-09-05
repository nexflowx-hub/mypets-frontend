"use client";

const STORAGE_KEY = "mypets.auth.session.v1";
const AUTH_EVENT = "mypets-auth-changed";

export type AuthUser = {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type?: string;
  user: AuthUser;
};

type AuthErrorPayload = {
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
};

function config() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) throw new Error("Supabase Auth is not configured");
  return { url, key };
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mypets.lat").replace(/\/$/, "");
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
}

function normalizeSession(value: AuthSession): AuthSession {
  return {
    ...value,
    expires_at: value.expires_at ?? Math.floor(Date.now() / 1000) + Number(value.expires_in || 3600),
  };
}

export function saveSession(value: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (!value) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSession(value)));
  notify();
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.access_token || !parsed?.refresh_token || !parsed?.user?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function authRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = config();
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => ({}))) as T & AuthErrorPayload;
  if (!response.ok) {
    throw new Error(body.message ?? body.msg ?? body.error_description ?? body.error ?? `Auth error ${response.status}`);
  }
  return body;
}

export async function signIn(email: string, password: string) {
  const session = await authRequest<AuthSession>("/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  saveSession(session);
  return session;
}

export async function signUp(email: string, password: string) {
  const result = await authRequest<AuthSession & { user: AuthUser }>("/signup", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  if (result.access_token && result.refresh_token) saveSession(result);
  return result;
}

export async function requestPasswordReset(email: string) {
  const redirect = encodeURIComponent(`${siteUrl()}/auth/update-password`);
  return authRequest<{ message?: string }>(`/recover?redirect_to=${redirect}`, {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
}

export async function consumeImplicitSessionFromUrl(): Promise<AuthSession | null> {
  if (typeof window === "undefined" || !window.location.hash) return readSession();
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  if (!accessToken || !refreshToken) return readSession();

  const user = await authRequest<AuthUser>("/user", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const session: AuthSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: Number(params.get("expires_in") ?? 3600),
    token_type: params.get("token_type") ?? "bearer",
    user,
  };
  saveSession(session);
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  return session;
}

export async function updatePassword(password: string) {
  const session = await getValidSession();
  if (!session) throw new Error("Recovery session is missing or expired");
  return authRequest<AuthUser>("/user", {
    method: "PUT",
    headers: { Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ password }),
  });
}

export async function refreshSession(current?: AuthSession | null): Promise<AuthSession | null> {
  const session = current ?? readSession();
  if (!session?.refresh_token) return null;
  try {
    const refreshed = await authRequest<AuthSession>("/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    saveSession(refreshed);
    return refreshed;
  } catch {
    saveSession(null);
    return null;
  }
}

export async function getValidSession(): Promise<AuthSession | null> {
  const session = readSession();
  if (!session) return null;
  const expiresAt = session.expires_at ?? 0;
  if (expiresAt > Math.floor(Date.now() / 1000) + 60) return session;
  return refreshSession(session);
}

export async function signOut() {
  const session = readSession();
  if (session?.access_token) {
    try {
      await authRequest("/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
    } catch {
      // Local logout still proceeds if remote logout fails.
    }
  }
  saveSession(null);
}

export function onAuthChanged(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(AUTH_EVENT, listener);
  return () => window.removeEventListener(AUTH_EVENT, listener);
}
