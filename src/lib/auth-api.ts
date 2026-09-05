"use client";

import { apiUrl } from "@/lib/api";
import { getValidSession } from "@/lib/auth-client";

export async function authApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await getValidSession();
  if (!session) throw new Error("AUTH_REQUIRED");

  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error?.message ?? body?.message ?? `API ${response.status}`;
    throw new Error(message);
  }
  return body as T;
}
