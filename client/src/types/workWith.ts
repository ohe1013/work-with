export type WorkWithLevel = "초급" | "중급" | "고급";

export type WorkoutType =
  | "러닝"
  | "헬스"
  | "농구"
  | "클라이밍"
  | "요가"
  | "기타";

export type WorkWithItem = {
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

export type WorkWithLocationResponse = {
  locationId: string;
  items: WorkWithItem[];
};

export type CreateWorkWithRequest = {
  locationId?: string | null;
  workoutType: WorkoutType;
  placeName: string;
  placeDetail?: string;
  date: string;
  time: string;
  level: WorkWithLevel;
  maxCount: number;
  note?: string;
};

export type CreateWorkWithResponse = {
  item: WorkWithItem;
};

export type WorkWithErrorResponse = {
  message: string;
};
