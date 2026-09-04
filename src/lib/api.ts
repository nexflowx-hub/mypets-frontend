const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.mypets.lat/v1").replace(/\/$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`MyPets API ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}
