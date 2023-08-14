import { useState, useEffect } from "react";
import { signIn } from "../../api/auth/authApi";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const storedToken = token;
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem("token", JSON.stringify(token));
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await signIn({ email, password });
      if (!response.ok) throw new Error("로그인 실패");
      const data = await response.json();
      const newToken = data.token;
      if (!newToken) throw new Error("로그인 실패");
      setToken(newToken);
      saveToken(newToken);
    } catch (error) {
      throw new Error("Authentication failed");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return { token, login, logout };
}
