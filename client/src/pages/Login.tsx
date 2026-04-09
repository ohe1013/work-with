import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Panel from "../components/common/Panel";
import { useAuth } from "../hooks/auth/useAuth";
import useInputs from "../hooks/util/useInputs";

const DEMO_EMAIL = "test123@naver.com";
const DEMO_PASSWORD = "test123";

type LoginLocationState = {
  from?: string;
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
          error instanceof Error
            ? error.message
            : "로그인 중 문제가 생겼어요."
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
    <section className="flex min-h-[calc(100vh-126px)] w-full items-center justify-center px-3 py-6 md:min-h-[calc(100vh-108px)] md:px-6">
      <Panel className="w-full max-w-[520px] px-5 py-6 md:px-8 md:py-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              가벼운 접근
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
              로그인
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              필요한 순간에만 가볍게 로그인하고, 바로 지도 기반 탐색으로
              돌아갈 수 있게 구성했습니다.
            </p>
          </div>

          <div className="rounded-[24px] bg-slate-50 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  데모 계정
                </p>
                <p className="text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  지금은 바로 체험할 수 있는 로그인 흐름을 열어두었습니다.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                size="sm"
                onClick={applyDemoCredentials}
                disabled={isSubmitting}
              >
                데모 계정 채우기
              </Button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-[18px] bg-white/88 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  이메일
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {DEMO_EMAIL}
                </p>
              </div>
              <div className="rounded-[18px] bg-white/88 px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  비밀번호
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-slate-900">
                  {DEMO_PASSWORD}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-5" method="POST">
          <Input label="이메일">
            <Input.TextFiledWithRef
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
              errorMessage ?? "지금은 데모 계정으로 전체 로그인 흐름을 확인할 수 있어요."
            }
          >
            <Input.TextFiledWithRef
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

            <div className="grid gap-2">
              <Link to="/">
                <Button variant="ghost" type="button">
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </Panel>
    </section>
  );
}
