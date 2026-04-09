import { randomUUID } from "crypto";
import { Request, Response } from "express";

type WorkoutType =
  | "러닝"
  | "헬스"
  | "농구"
  | "클라이밍"
  | "요가"
  | "기타";

type WorkWithLevel = "초급" | "중급" | "고급";

type WorkWithItem = {
  id: string;
  locationId: string | null;
  title: string;
  workoutType: WorkoutType;
  level: WorkWithLevel;
  createdAt: string;
  dueAt: string;
  scheduledAt: string;
  maxCount: number;
  currentCount: number;
  placeName: string;
  placeDetail: string;
  note: string;
};

type CreateWorkWithBody = {
  locationId?: string | null;
  workoutType?: string;
  placeName?: string;
  placeDetail?: string;
  date?: string;
  time?: string;
  level?: string;
  maxCount?: number | string;
  note?: string;
};

const workoutTypes: WorkoutType[] = [
  "러닝",
  "헬스",
  "농구",
  "클라이밍",
  "요가",
  "기타",
];
const levels: WorkWithLevel[] = ["초급", "중급", "고급"];
const minimumLeadTimeMs = 15 * 60 * 1000;
const dueLeadTimeMs = 2 * 60 * 60 * 1000;
const defaultNote = "준비물 없이도 부담 없이 합류할 수 있게 짧게 모집하고 있어요.";
const storedItems: WorkWithItem[] = [];

const normalizeText = (value: string) => value.trim().toLowerCase();

const isWorkoutType = (value: string): value is WorkoutType =>
  workoutTypes.includes(value as WorkoutType);

const isLevel = (value: string): value is WorkWithLevel =>
  levels.includes(value as WorkWithLevel);

const buildDueAt = (scheduledAt: Date) => {
  const now = Date.now();
  const dueAtMs = Math.max(
    now + minimumLeadTimeMs,
    scheduledAt.getTime() - dueLeadTimeMs
  );

  return new Date(dueAtMs).toISOString();
};

const buildScheduledAt = (hoursFromNow: number) =>
  new Date(Date.now() + hoursFromNow * 60 * 60 * 1000).toISOString();

const buildDemoItems = (locationId: string, placeName: string): WorkWithItem[] => {
  const normalizedPlaceName = placeName.trim() || "이 장소";
  const scheduledAtList = [
    buildScheduledAt(5),
    buildScheduledAt(9),
    buildScheduledAt(26),
  ];

  return [
    {
      id: `${locationId}-demo-running`,
      locationId,
      title: `${normalizedPlaceName} 러닝 메이트 구해요`,
      workoutType: "러닝",
      level: "중급",
      createdAt: new Date().toISOString(),
      dueAt: buildDueAt(new Date(scheduledAtList[0])),
      scheduledAt: scheduledAtList[0],
      maxCount: 4,
      currentCount: 2,
      placeName: normalizedPlaceName,
      placeDetail: "메인 산책로 입구 앞",
      note: "5km 정도 가볍게 뛰고 스트레칭까지 마무리할 분을 찾고 있어요.",
    },
    {
      id: `${locationId}-demo-climb`,
      locationId,
      title: `${normalizedPlaceName} 클라이밍 세션 열려 있어요`,
      workoutType: "클라이밍",
      level: "초급",
      createdAt: new Date().toISOString(),
      dueAt: buildDueAt(new Date(scheduledAtList[1])),
      scheduledAt: scheduledAtList[1],
      maxCount: 3,
      currentCount: 1,
      placeName: normalizedPlaceName,
      placeDetail: "볼더링 존 앞",
      note: "첫 방문도 괜찮아요. 같이 난이도 낮은 코스부터 풀 예정입니다.",
    },
    {
      id: `${locationId}-demo-basketball`,
      locationId,
      title: `${normalizedPlaceName} 농구 한 게임 하실 분`,
      workoutType: "농구",
      level: "고급",
      createdAt: new Date().toISOString(),
      dueAt: buildDueAt(new Date(scheduledAtList[2])),
      scheduledAt: scheduledAtList[2],
      maxCount: 6,
      currentCount: 4,
      placeName: normalizedPlaceName,
      placeDetail: "야외 코트 2번",
      note: "가볍게 몸 풀고 반코트 위주로 맞춰볼 예정이에요.",
    },
  ];
};

const sortItemsBySchedule = (items: WorkWithItem[]) =>
  [...items].sort(
    (left, right) =>
      new Date(left.scheduledAt).getTime() -
      new Date(right.scheduledAt).getTime()
  );

const listByLocation = (req: Request, res: Response) => {
  const { locationId } = req.params;
  const placeNameQuery =
    typeof req.query.placeName === "string" ? req.query.placeName : "";
  const normalizedPlaceName = normalizeText(placeNameQuery);

  const matchingItems = storedItems.filter((item) => {
    if (item.locationId === locationId) {
      return true;
    }

    if (!normalizedPlaceName) {
      return false;
    }

    return normalizeText(item.placeName) === normalizedPlaceName;
  });

  const items =
    matchingItems.length > 0
      ? sortItemsBySchedule(matchingItems)
      : buildDemoItems(locationId, placeNameQuery);

  return res.status(200).json({
    locationId,
    items,
  });
};

const createWorkWith = (req: Request, res: Response) => {
  const body = (req.body ?? {}) as CreateWorkWithBody;
  const workoutType =
    typeof body.workoutType === "string" ? body.workoutType.trim() : "";
  const placeName = typeof body.placeName === "string" ? body.placeName.trim() : "";
  const placeDetail =
    typeof body.placeDetail === "string" ? body.placeDetail.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const time = typeof body.time === "string" ? body.time.trim() : "";
  const level = typeof body.level === "string" ? body.level.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const maxCount = Number(body.maxCount);
  const locationId =
    typeof body.locationId === "string" && body.locationId.trim()
      ? body.locationId.trim()
      : null;

  if (!workoutType || !placeName || !date || !time || !level || !body.maxCount) {
    return res.status(400).json({
      message: "운동 종류, 장소, 날짜, 시간, 모집 조건을 모두 입력해 주세요.",
    });
  }

  if (!isWorkoutType(workoutType)) {
    return res.status(400).json({
      message: "지원하지 않는 운동 종류예요.",
    });
  }

  if (!isLevel(level)) {
    return res.status(400).json({
      message: "지원하지 않는 운동 수준이에요.",
    });
  }

  if (!Number.isInteger(maxCount) || maxCount < 2 || maxCount > 12) {
    return res.status(400).json({
      message: "최대 인원은 2명 이상 12명 이하로 입력해 주세요.",
    });
  }

  const scheduledAt = new Date(`${date}T${time}:00`);

  if (Number.isNaN(scheduledAt.getTime())) {
    return res.status(400).json({
      message: "날짜와 시간을 다시 확인해 주세요.",
    });
  }

  if (scheduledAt.getTime() <= Date.now()) {
    return res.status(400).json({
      message: "현재 이후 일정으로 모집해 주세요.",
    });
  }

  const item: WorkWithItem = {
    id: randomUUID(),
    locationId,
    title: `${placeName} ${workoutType} 메이트 구해요`,
    workoutType,
    level,
    createdAt: new Date().toISOString(),
    dueAt: buildDueAt(scheduledAt),
    scheduledAt: scheduledAt.toISOString(),
    maxCount,
    currentCount: 1,
    placeName,
    placeDetail,
    note: note || defaultNote,
  };

  storedItems.unshift(item);

  return res.status(201).json({
    item,
  });
};

export { createWorkWith, listByLocation };
