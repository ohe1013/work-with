import { rest } from "msw";

const todos = ["먹기", "자기", "놀기"];
const user = { email: "test123@naver.com", password: "test123" };

export const handlers = [
    rest.get("/todos", (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json(todos));
    }),
    rest.post("/todos", (req, res, ctx) => {
        todos.push(req.body as string);
        return res(ctx.status(201));
    }),
    rest.post("/api/login", async (req, res, ctx) => {
        const body = await req.json();
        const { email, password } = body;
        if (email !== user.email) {
            return res(ctx.status(401), ctx.json({ message: "아이디가 존재하지 않습니다." }));
        }
        if (email === user.email && password === user.password) {
            return res(ctx.status(200), ctx.json({ token: "testToken" }));
        } else {
            return res(ctx.status(401), ctx.json({ message: "Auth failed" }));
        }
    }),
];
