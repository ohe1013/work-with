import { rest } from "msw";
import type {
  CreateWorkWithRequest,
  WorkoutType,
  WorkWithItem,
  WorkWithLevel,
} from "@/types/workWith";

const todos = ["먹기", "자기", "놀기"];
const user = { email: "test123@naver.com", password: "test123" };

const buildMockSchedule = (hoursFromNow: number) =>
  new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();

const buildMockDueAt = (scheduledAt: string) =>
  new Date(
    Math.max(
      Date.now() + 15 * 60 * 1000,
      new Date(scheduledAt).getTime() - 90 * 60 * 1000
    )
  ).toISOString();

const buildMockLocationItems = (
  locationId: string,
  placeName: string
): WorkWithItem[] => {
  const firstScheduledAt = buildMockSchedule(6);
  const secondScheduledAt = buildMockSchedule(12);

  return [
    {
      id: `${locationId}-seed-1`,
      locationId,
      title: `${placeName} 러닝 메이트 구해요`,
      workoutType: "러닝",
      level: "중급",
      createdAt: new Date().toISOString(),
      dueAt: buildMockDueAt(firstScheduledAt),
      scheduledAt: firstScheduledAt,
      maxCount: 4,
      currentCount: 1,
      placeName,
      placeDetail: "메인 산책로 입구 앞",
      note: "5km 정도 가볍게 뛰고 마무리 스트레칭까지 할 예정이에요.",
    },
    {
      id: `${locationId}-seed-2`,
      locationId,
      title: `${placeName} 클라이밍 세션 열려 있어요`,
      workoutType: "클라이밍",
      level: "초급",
      createdAt: new Date().toISOString(),
      dueAt: buildMockDueAt(secondScheduledAt),
      scheduledAt: secondScheduledAt,
      maxCount: 3,
      currentCount: 1,
      placeName,
      placeDetail: "볼더링 존 앞",
      note: "처음 오셔도 괜찮아요. 쉬운 코스부터 같이 풀어요.",
    },
  ];
};

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
      return res(
        ctx.status(400),
        ctx.json({ message: "이메일과 비밀번호를 모두 입력해 주세요." })
      );
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
    return res(
      ctx.status(401),
      ctx.json({ message: "이메일 또는 비밀번호가 올바르지 않아요." })
    );
  }),
  rest.get("/api/work-with/locations/:locationId", (req, res, ctx) => {
    const locationId = String(req.params.locationId);
    const placeName = req.url.searchParams.get("placeName") ?? "서울숲";

    return res(
      ctx.status(200),
      ctx.json({
        locationId,
        items: buildMockLocationItems(locationId, placeName),
      })
    );
  }),
  rest.post("/api/work-with", async (req, res, ctx) => {
    const body = (await req.json()) as Partial<CreateWorkWithRequest>;
    const workoutType =
      typeof body.workoutType === "string" ? body.workoutType.trim() : "";
    const placeName =
      typeof body.placeName === "string" ? body.placeName.trim() : "";
    const date = typeof body.date === "string" ? body.date.trim() : "";
    const time = typeof body.time === "string" ? body.time.trim() : "";
    const level = typeof body.level === "string" ? body.level.trim() : "";
    const maxCount = Number(body.maxCount);

    if (!workoutType || !placeName || !date || !time || !level || !body.maxCount) {
      return res(
        ctx.status(400),
        ctx.json({
          message: "운동 종류, 장소, 날짜, 시간, 모집 조건을 모두 입력해 주세요.",
        })
      );
    }

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
    const item: WorkWithItem = {
      id: "created-work-with",
      locationId:
        typeof body.locationId === "string" && body.locationId.trim()
          ? body.locationId.trim()
          : null,
      title: `${placeName} ${workoutType as WorkoutType} 메이트 구해요`,
      workoutType: workoutType as WorkoutType,
      level: level as WorkWithLevel,
      createdAt: new Date().toISOString(),
      dueAt: buildMockDueAt(scheduledAt),
      scheduledAt,
      maxCount,
      currentCount: 1,
      placeName,
      placeDetail:
        typeof body.placeDetail === "string" ? body.placeDetail.trim() : "",
      note:
        typeof body.note === "string" && body.note.trim()
          ? body.note.trim()
          : "준비물 없이도 부담 없이 합류할 수 있게 짧게 모집하고 있어요.",
    };

    return res(ctx.status(201), ctx.json({ item }));
  }),
];
