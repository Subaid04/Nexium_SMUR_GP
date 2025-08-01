// src/lib/api.ts

/** Read once at module load. NEXT_PUBLIC_* is exposed to the browser */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function requireApiUrl(): string {
  if (!API_URL) {
    // Helpful error in the browser console during dev
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error(
        "NEXT_PUBLIC_API_URL is not set. Create .env.local in the frontend root and restart `npm run dev`."
      );
    }
    throw new Error("Frontend misconfigured: NEXT_PUBLIC_API_URL is undefined");
  }
  return API_URL;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Build URL safely (no double slashes)
  const base = requireApiUrl().replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${suffix}`;

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    // Try to read JSON error shape; fall back to status text
    let message = `Request failed: ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string; message?: string };
      message = data?.error || data?.message || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  // If empty body (204), return undefined as any
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}
