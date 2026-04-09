import { signIn } from "../../api/auth/authApi";
import type { AuthSession, LoginForm } from "../../types/auth";

const AUTH_SESSION_STORAGE_KEY = "work-with.auth.session";

const fetchSession = async ({
  email,
  password,
}: LoginForm): Promise<AuthSession> => {
  const session = await signIn({ email, password });
  saveSession(session);
  return session;
};

const getStoredSession = (): AuthSession | null => {
  const stored = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthSession;
  } catch (_error) {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
};

const saveSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export { fetchSession, getStoredSession, saveSession };
