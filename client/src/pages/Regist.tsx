import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Input from "@/components/common/Input";
import Panel from "@/components/common/Panel";
import { registerWorkWith } from "@/service/workWith/workWith";
import type {
  CreateWorkWithRequest,
  WorkWithItem,
  WorkWithLevel,
  WorkoutType,
} from "@/types/workWith";

const workoutOptions: readonly WorkoutType[] = [
  "러닝",
  "헬스",
  "농구",
  "클라이밍",
  "요가",
] as const;
const levelOptions: readonly WorkWithLevel[] = ["초급", "중급", "고급"] as const;
const maxCountOptions = ["2", "3", "4", "6"] as const;

type MaxCountType = (typeof maxCountOptions)[number] | "";

type RegistForm = {
  workoutType: WorkoutType | "";
  placeName: string;
  placeDetail: string;
  date: string;
  time: string;
  level: WorkWithLevel | "";
  maxCount: MaxCountType;
  note: string;
};

type FormErrors = Partial<Record<keyof RegistForm, string>>;

function Section({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Panel className="space-y-4 px-4 py-4 md:px-5 md:py-5">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {step}
        </p>
        <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
          {title}
        </h3>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </Panel>
  );
}

function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T | "";
  onChange: (nextValue: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === value;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={[
              "inline-flex min-h-[42px] items-center justify-center rounded-full px-4 text-sm font-semibold transition",
              isActive
                ? "bg-[rgb(var(--color-accent))] text-white shadow-[0_14px_32px_rgba(14,116,144,0.24)]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
            ].join(" ")}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SummaryItem({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-[22px] bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
        {value}
      </p>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

function validateForm(form: RegistForm): FormErrors {
  const errors: FormErrors = {};

  if (!form.workoutType) {
    errors.workoutType = "운동 종류를 먼저 골라주세요.";
  }

  if (!form.placeName.trim()) {
    errors.placeName = "모일 장소 이름을 입력해 주세요.";
  }

  if (!form.date) {
    errors.date = "모집 날짜를 선택해 주세요.";
  }

  if (!form.time) {
    errors.time = "모집 시간을 선택해 주세요.";
  }

  if (!form.level) {
    errors.level = "기대하는 운동 수준을 골라주세요.";
  }

  if (!form.maxCount) {
    errors.maxCount = "최대 인원을 선택해 주세요.";
  }

  return errors;
}

function isFormValid(errors: FormErrors) {
  return Object.keys(errors).length === 0;
}

function buildSummaryDateTime(date: string, time: string) {
  return date && time ? `${date} · ${time}` : "날짜와 시간을 선택해 주세요";
}

function buildSummaryPlace(placeName: string, placeDetail: string) {
  if (!placeName.trim()) {
    return "장소를 입력해 주세요";
  }

  return placeDetail.trim() ? `${placeName} · ${placeDetail}` : placeName;
}

function buildSummaryCondition(level: string, maxCount: string) {
  return level && maxCount
    ? `${level} · 최대 ${maxCount}명`
    : "난이도와 최대 인원을 정해 주세요";
}

function buildCreateRequest(form: RegistForm): CreateWorkWithRequest {
  return {
    workoutType: form.workoutType as WorkoutType,
    placeName: form.placeName.trim(),
    placeDetail: form.placeDetail.trim(),
    date: form.date,
    time: form.time,
    level: form.level as WorkWithLevel,
    maxCount: Number(form.maxCount),
    note: form.note.trim(),
  };
}

function formatCreatedSchedule(item: WorkWithItem) {
  const scheduledAt = new Date(item.scheduledAt);

  if (Number.isNaN(scheduledAt.getTime())) {
    return `${item.placeName} 일정`;
  }

  return scheduledAt.toLocaleString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function Regist(): JSX.Element {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<RegistForm>({
    workoutType: "",
    placeName: "",
    placeDetail: "",
    date: "",
    time: "",
    level: "",
    maxCount: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [createdWorkWith, setCreatedWorkWith] = useState<WorkWithItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const requiredCount = 6;
  const completedRequiredCount = [
    Boolean(form.workoutType),
    Boolean(form.placeName.trim()),
    Boolean(form.date),
    Boolean(form.time),
    Boolean(form.level),
    Boolean(form.maxCount),
  ].filter(Boolean).length;
  const summaryDateTime = buildSummaryDateTime(form.date, form.time);
  const summaryPlace = buildSummaryPlace(form.placeName, form.placeDetail);
  const summaryCondition = buildSummaryCondition(form.level, form.maxCount);
  const summaryNote = form.note.trim() || "추가 안내 없이 가볍게 모집합니다.";
  const progressLabel = `${completedRequiredCount}/${requiredCount}개 필수 항목 완료`;
  const readyToPreview = isFormValid(validateForm(form));

  const updateField = <K extends keyof RegistForm>(
    field: K,
    value: RegistForm[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitError(null);

    if (errors[field]) {
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const previewHandler = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setSubmitError(null);

    if (!isFormValid(nextErrors)) {
      setShowSummary(false);
      return;
    }

    setShowSummary(true);
  };

  const submitHandler = async () => {
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setSubmitError(null);

    if (!isFormValid(nextErrors)) {
      setShowSummary(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const item = await registerWorkWith(buildCreateRequest(form));
      setCreatedWorkWith(item);
      await queryClient.invalidateQueries({ queryKey: ["workWith"] });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "모집 등록 중 문제가 생겼어요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetHandler = () => {
    setForm({
      workoutType: "",
      placeName: "",
      placeDetail: "",
      date: "",
      time: "",
      level: "",
      maxCount: "",
      note: "",
    });
    setErrors({});
    setShowSummary(false);
    setCreatedWorkWith(null);
    setSubmitError(null);
    setIsSubmitting(false);
  };

  if (createdWorkWith) {
    return (
      <section className="flex min-h-[calc(100vh-126px)] w-full items-center justify-center px-3 py-6 md:min-h-[calc(100vh-108px)] md:px-6">
        <Panel className="w-full max-w-[760px] space-y-5 px-5 py-6 md:px-8 md:py-8">
          <EmptyState
            eyebrow="등록 완료"
            title="오늘의 모집이 저장됐어요"
            description="입력한 내용이 서버에 저장됐어요. 홈이나 찾기 흐름으로 돌아가면 같은 계약의 상세 카드에서 모집 데이터를 다시 확인할 수 있습니다."
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/" className="w-full sm:w-auto">
                  <Button type="button" fullWidth>
                    홈으로 돌아가기
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={resetHandler}
                >
                  새 모집 다시 작성
                </Button>
              </div>
            }
          />

          <div className="grid gap-3 md:grid-cols-2">
            <SummaryItem label="운동 종류" value={createdWorkWith.workoutType} />
            <SummaryItem
              label="장소"
              value={buildSummaryPlace(
                createdWorkWith.placeName,
                createdWorkWith.placeDetail
              )}
            />
            <SummaryItem
              label="일정"
              value={formatCreatedSchedule(createdWorkWith)}
            />
            <SummaryItem
              label="모집 조건"
              value={`${createdWorkWith.level} · 최대 ${createdWorkWith.maxCount}명`}
              helper={createdWorkWith.note}
            />
          </div>
        </Panel>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Panel tone="strong" className="space-y-4 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[rgba(14,116,144,0.10)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-accent))]">
            오늘의 모집 등록
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {progressLabel}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-900 md:text-[1.9rem] md:leading-[1.2]">
            부담 없이 올리고, 제출 전 한 번 더 확인하세요
          </h2>
          <p className="text-sm leading-6 text-slate-600 md:text-[15px]">
            운동 종류, 장소, 시간, 모집 조건을 짧은 섹션으로 나눠 입력하고
            제출 직전 요약에서 다시 확인할 수 있게 구성했습니다.
          </p>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form className="space-y-4" onSubmit={previewHandler}>
          <Section
            step="Step 1"
            title="운동 종류를 정하세요"
            description="어떤 운동인지 먼저 고르면 이후 조건과 안내 문구가 더 읽기 쉬워집니다."
          >
            <ChoiceChips
              options={workoutOptions}
              value={form.workoutType}
              onChange={(nextValue) => updateField("workoutType", nextValue)}
            />
            {errors.workoutType ? (
              <p className="text-sm leading-5 text-rose-600">
                {errors.workoutType}
              </p>
            ) : (
              <p className="text-sm leading-5 text-slate-500">
                필수 입력입니다.
              </p>
            )}
          </Section>

          <Section
            step="Step 2"
            title="어디서 만날지 적어주세요"
            description="공원, 체육관, 운동장 이름을 먼저 쓰고, 필요하면 세부 위치를 덧붙여 주세요."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="장소 이름"
                bottomText={
                  errors.placeName ?? "예: 서울숲, 올림픽공원 농구장, 성수 헬스장"
                }
              >
                <Input.TextFieldWithRef
                  name="placeName"
                  value={form.placeName}
                  onChange={(event) =>
                    updateField("placeName", event.target.value)
                  }
                  placeholder="모일 장소를 입력해 주세요"
                  error={Boolean(errors.placeName)}
                />
              </Input>

              <Input
                label="세부 위치"
                bottomText="선택 입력입니다. 출입구, 코트 번호, 층수 등을 적을 수 있어요."
              >
                <Input.TextFieldWithRef
                  name="placeDetail"
                  value={form.placeDetail}
                  onChange={(event) =>
                    updateField("placeDetail", event.target.value)
                  }
                  placeholder="예: 2번 출입구 앞"
                />
              </Input>
            </div>
          </Section>

          <Section
            step="Step 3"
            title="언제 만날지 정하세요"
            description="긴 설명 없이 날짜와 시간만 빠르게 정하고, 필요한 경우 메모에서 보충하면 됩니다."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="날짜"
                bottomText={errors.date ?? "필수 입력입니다."}
              >
                <Input.TextFieldWithRef
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  error={Boolean(errors.date)}
                />
              </Input>

              <Input
                label="시간"
                bottomText={errors.time ?? "필수 입력입니다."}
              >
                <Input.TextFieldWithRef
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={(event) => updateField("time", event.target.value)}
                  error={Boolean(errors.time)}
                />
              </Input>
            </div>
          </Section>

          <Section
            step="Step 4"
            title="모집 조건을 가볍게 맞추세요"
            description="난이도와 최대 인원만 먼저 정해도 기본 모집 흐름은 충분히 성립합니다."
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  운동 수준
                </p>
                <ChoiceChips
                  options={levelOptions}
                  value={form.level}
                  onChange={(nextValue) => updateField("level", nextValue)}
                />
                <p
                  className={[
                    "text-sm leading-5",
                    errors.level ? "text-rose-600" : "text-slate-500",
                  ].join(" ")}
                >
                  {errors.level ?? "필수 입력입니다."}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  최대 인원
                </p>
                <ChoiceChips
                  options={maxCountOptions}
                  value={form.maxCount}
                  onChange={(nextValue) => updateField("maxCount", nextValue)}
                />
                <p
                  className={[
                    "text-sm leading-5",
                    errors.maxCount ? "text-rose-600" : "text-slate-500",
                  ].join(" ")}
                >
                  {errors.maxCount ?? "필수 입력입니다."}
                </p>
              </div>

              <Input
                label="추가 메모"
                bottomText="선택 입력입니다. 준비물, 페이스, 선호 분위기 등을 짧게 적어주세요."
              >
                <textarea
                  name="note"
                  value={form.note}
                  onChange={(event) => updateField("note", event.target.value)}
                  placeholder="예: 5km 정도 가볍게 달리고 싶어요"
                  className="block min-h-[120px] w-full rounded-[22px] border border-transparent bg-white/92 px-4 py-3 text-[15px] text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-[rgba(148,163,184,0.18)] placeholder:text-slate-400 transition duration-200 focus:border-[rgba(14,116,144,0.18)] focus:outline-none focus:ring-2 focus:ring-[rgba(14,116,144,0.2)]"
                />
              </Input>
            </div>
          </Section>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" isDisabled={!readyToPreview || isSubmitting}>
              제출 전 요약 보기
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={resetHandler}
              disabled={isSubmitting}
            >
              다시 작성
            </Button>
          </div>
        </form>

        <aside className="space-y-4 xl:sticky xl:top-[104px] xl:h-fit">
          <Panel className="space-y-4 px-4 py-4 md:px-5 md:py-5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                제출 전 요약
              </p>
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">
                {showSummary
                  ? "지금 이 내용으로 모집을 올릴 수 있어요"
                  : "필수 항목을 채우면 여기서 최종 확인할 수 있어요"}
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                긴 폼을 한 번에 읽지 않아도 되도록, 마지막 단계에서 필요한 정보만
                다시 정리해 보여줍니다.
              </p>
            </div>

            <div className="grid gap-3">
              <SummaryItem
                label="운동 종류"
                value={form.workoutType || "아직 선택 전"}
                helper="어떤 운동인지 먼저 드러나야 후보가 부담 없이 판단할 수 있어요."
              />
              <SummaryItem
                label="장소"
                value={summaryPlace}
                helper="공원, 체육관, 운동장 이름을 먼저 보여주는 구성이 기본입니다."
              />
              <SummaryItem
                label="일정"
                value={summaryDateTime}
                helper="하루 안에서 빠르게 판단할 수 있게 날짜와 시간만 짧게 노출합니다."
              />
              <SummaryItem
                label="모집 조건"
                value={summaryCondition}
                helper={summaryNote}
              />
            </div>

            {submitError ? (
              <p role="alert" className="text-sm leading-5 text-rose-600">
                {submitError}
              </p>
            ) : null}

            {showSummary ? (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => void submitHandler()}
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? "등록 중..." : "이 내용으로 모집 등록하기"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowSummary(false)}
                  disabled={isSubmitting}
                >
                  다시 수정하기
                </Button>
              </div>
            ) : (
              <EmptyState
                eyebrow="요약 대기"
                title="필수 항목을 먼저 채워주세요"
                description="운동 종류, 장소 이름, 날짜, 시간, 운동 수준, 최대 인원이 채워지면 제출 전 요약이 활성화됩니다."
              />
            )}
          </Panel>
        </aside>
      </div>
    </section>
  );
}
