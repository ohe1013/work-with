import { useEffect, useState } from "react";
import { signIn } from "../../api/auth/authApi";
import type { AuthSession, LoginForm } from "../../types/auth";

const AUTH_SESSION_STORAGE_KEY = "work-with.auth.session";

const readStoredSession = (): AuthSession | null => {
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

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(readStoredSession());
  }, []);

  const saveSession = (nextSession: AuthSession) => {
    localStorage.setItem(
      AUTH_SESSION_STORAGE_KEY,
      JSON.stringify(nextSession)
    );
  };

  const login = async ({ email, password }: LoginForm) => {
    const nextSession = await signIn({ email, password });
    setSession(nextSession);
    saveSession(nextSession);
    return nextSession;
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  };

  return {
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
    token: session?.token ?? null,
    user: session?.user ?? null,
  };
}
