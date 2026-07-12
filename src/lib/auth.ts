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

export type UserRole =
  | "ADMIN"
  | "ASSET_MANAGER"
  | "DEPARTMENT_HEAD"
  | "EMPLOYEE";

export interface AuthResponse {
  /** The code/token returned by the backend after authentication. */
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Demo role mapping. Sign in with one of these emails (any password) to
 * experience the app as that role. Any other email signs in as an EMPLOYEE.
 */
const DEMO_ROLES: Record<string, UserRole> = {
  "admin@assetflow.com": "ADMIN",
  "manager@assetflow.com": "ASSET_MANAGER",
  "head@assetflow.com": "DEPARTMENT_HEAD",
  "employee@assetflow.com": "EMPLOYEE",
};

export function roleForEmail(email: string): UserRole {
  return DEMO_ROLES[email.trim().toLowerCase()] ?? "EMPLOYEE";
}

const DISPLAY_NAMES: Record<string, string> = {
  "admin@assetflow.com": "Ava Admin",
  "manager@assetflow.com": "Manav Manager",
  "head@assetflow.com": "Hana Head",
  "employee@assetflow.com": "Ravi Employee",
};

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
  await wait(600);
  const email = payload.email.trim().toLowerCase();
  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: "u_1",
      name: DISPLAY_NAMES[email] ?? payload.email.split("@")[0],
      email: payload.email,
      role: roleForEmail(payload.email),
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
  await wait(600);
  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: "u_" + Math.random().toString(36).slice(2, 8),
      name: payload.name ?? payload.email.split("@")[0],
      email: payload.email,
      // New signups are always EMPLOYEE (matches the backend rule).
      role: roleForEmail(payload.email),
    },
  };
}
