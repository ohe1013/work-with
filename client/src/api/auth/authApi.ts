import { loginForm } from "../../types/auth";

const baseUrl = import.meta.env.DEV ? "http://localhost:3000" : "";
const signIn = async ({ email, password }: loginForm) => {
  const response = await fetch(baseUrl + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response;
};

export { signIn };
