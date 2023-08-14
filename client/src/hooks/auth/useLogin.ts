import { loginForm } from "../../types/auth";

const fetchToken = async ({ email, password }: loginForm): Promise<string> => {
  try {
    const token = await login({ email, password });
    saveToken(token);
    return token;
  } catch (error) {
    throw new Error("Failed to fetch token");
  }
};

const login = async ({ email, password }: loginForm): Promise<string> => {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("Authentication failed");
  }
  const data = await response.json();
  console.log(data);
  return data.token;
};

const getToken = () => {
  return localStorage.getItem("token");
};

const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export { fetchToken, login, saveToken, getToken };
