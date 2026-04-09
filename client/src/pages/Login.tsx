import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PageHero from "../components/common/PageHero";
import Panel from "../components/common/Panel";
import { useAuth } from "../hooks/auth/useAuth";
import useInputs from "../hooks/util/useInputs";

const DEMO_EMAIL = "test123@naver.com";
const DEMO_PASSWORD = "test123";

type LoginLocationState = {
  from?: string;
};

const returnPathCopy: Record<string, string> = {
  "/": "홈 탐색",
  "/find": "조건 탐색",
  "/regist": "모집 등록",
  "/login": "로그인",
};

export default function Login() {
  const {
    form: { email, password },
    onChange,
  } = useInputs<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const isDisabled = !email || !password;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const locationState = location.state as LoginLocationState | null;
  const nextPath = locationState?.from ?? "/";
  const nextPathLabel = returnPathCopy[nextPath] ?? "이전 화면";

  const applyDemoCredentials = () => {
    if (isSubmitting) {
      return;
    }

    onChange({
      target: { name: "email", value: DEMO_EMAIL },
    } as ChangeEvent<HTMLInputElement>);
    onChange({
      target: { name: "password", value: DEMO_PASSWORD },
    } as ChangeEvent<HTMLInputElement>);
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) {
      setErrorMessage(null);
    }

    onChange(event);
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (isDisabled || isSubmitting) return false;

    setErrorMessage(null);
    setIsSubmitting(true);

    auth
      .login({ email, password })
      .then(() => {
        navigate(nextPath);
      })
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error ? error.message : "로그인 중 문제가 생겼어요."
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <section className="space-y-4">
      <PageHero
        eyebrow="가벼운 인증"
        badge={nextPath === "/" ? "홈으로 복귀" : `${nextPathLabel}로 복귀`}
        title="필요할 때만 간단하게 로그인하고 바로 이어서 탐색합니다"
        description="로그인이 목적이 되지 않도록, 데모 계정으로 빠르게 진입한 뒤 지도 탐색과 요청 흐름으로 바로 돌아갈 수 있게 구성했습니다."
      >
        <div className="grid gap-3 border-t border-slate-200/80 pt-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              후속 흐름
            </p>
            <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {nextPath === "/"
                ? "로그인 후 홈 탐색으로 복귀"
                : `로그인 후 ${nextPathLabel} 흐름으로 복귀`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              현재 상태
            </p>
            <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
              {isSubmitting ? "로그인 중" : "입력 대기"}
            </p>
          </div>
        </div>
      </PageHero>

      <div className="mx-auto max-w-[720px]">
        <Panel className="space-y-5 px-5 py-6 md:px-6 md:py-7">
          <div className="space-y-3 border-b border-slate-200/80 pb-5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                데모 계정
              </p>
              <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
                {DEMO_EMAIL}
              </p>
              <p className="text-sm text-slate-500">{DEMO_PASSWORD}</p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={applyDemoCredentials}
              disabled={isSubmitting}
            >
              데모 계정 채우기
            </Button>
          </div>

          <form onSubmit={submitHandler} className="space-y-5" method="POST">
            <Input label="이메일">
              <Input.TextFieldWithRef
                ref={inputRef}
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="이메일을 입력해 주세요"
              />
            </Input>

            <Input
              label="비밀번호"
              bottomText={
                errorMessage ??
                "데모 계정으로 바로 로그인 흐름을 확인할 수 있어요."
              }
            >
              <Input.TextFieldWithRef
                name="password"
                value={password}
                onChange={handleChange}
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                error={Boolean(errorMessage)}
              />
            </Input>

            {errorMessage ? (
              <p role="alert" className="text-sm leading-5 text-rose-600">
                {errorMessage}
              </p>
            ) : null}

            <div className="space-y-3 pt-2">
              <Button isDisabled={isDisabled || isSubmitting} type="submit">
                {isSubmitting ? "로그인 중..." : "로그인"}
              </Button>

              <Link to="/">
                <Button variant="ghost" type="button">
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </form>
        </Panel>
      </div>
    </section>
  );
}
