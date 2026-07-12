/**
 * Auth client.
 *
 * The shape mirrors what the backend will return after a successful
 * sign-in / sign-up: a session token (the "code from backend" you'll get).
 *
 * `apiSignIn` / `apiSignUp` are placeholders that simulate a network call.
 * Replace the body of each with a real `fetch` to your backend endpoint once
 * you share it — keep the signatures so the rest of the app doesn't change.
 */

export interface AuthResponse {
  /** The code/token returned by the backend after authentication. */
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

const SESSION_KEY = "authflow.session";

export function saveSession(session: AuthResponse) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** Delay helper so we can show the loading spinner during the simulated call. */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * TODO: replace with a real call to your backend, e.g.
 *   const res = await fetch("/api/signin", { method: "POST", body: JSON.stringify(payload) });
 *   if (!res.ok) throw new Error((await res.json()).message ?? "Sign in failed");
 *   return (await res.json()) as AuthResponse;
 */
export async function apiSignIn(payload: AuthPayload): Promise<AuthResponse> {
  await wait(900);
  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: "u_1",
      name: payload.email.split("@")[0],
      email: payload.email,
    },
  };
}

/**
 * TODO: replace with a real call to your backend, e.g.
 *   const res = await fetch("/api/signup", { method: "POST", body: JSON.stringify(payload) });
 *   if (!res.ok) throw new Error((await res.json()).message ?? "Sign up failed");
 *   return (await res.json()) as AuthResponse;
 */
export async function apiSignUp(payload: AuthPayload): Promise<AuthResponse> {
  await wait(900);
  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: payload.name ?? payload.email.split("@")[0],
      email: payload.email,
    },
  };
}
