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
        if (!email || !password) {
            return res(ctx.status(400), ctx.json({ message: "이메일과 비밀번호를 모두 입력해 주세요." }));
        }
        if (email === user.email && password === user.password) {
            return res(
              ctx.status(200),
              ctx.json({
                token: "testToken",
                expiresIn: 3600,
                user: {
                  email: user.email,
                  role: "user",
                  displayName: "워크위드 메이트",
                },
              })
            );
        }
        return res(ctx.status(401), ctx.json({ message: "이메일 또는 비밀번호가 올바르지 않아요." }));
    }),
];
