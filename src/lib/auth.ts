export type AuthUser = { id: string; email?: string };

export function saveSession(access_token: string, user?: AuthUser) {
  localStorage.setItem("access_token", access_token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function isAuthed() {
  return (
    typeof window !== "undefined" && !!localStorage.getItem("access_token")
  );
}
