import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Panel from "../components/common/Panel";
import { useAuth } from "../hooks/auth/useAuth";
import useInputs from "../hooks/util/useInputs";

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
  const auth = useAuth();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (isDisabled || isSubmitting) return false;

    setErrorMessage(null);
    setIsSubmitting(true);

    auth
      .login({ email, password })
      .then(() => {
        navigate("/");
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
      <Panel className="w-full max-w-[480px] px-5 py-6 md:px-8 md:py-8">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Access
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
            Login
          </h2>
          <p className="text-sm leading-6 text-slate-500">
            필요한 순간에만 가볍게 로그인하고, 바로 지도 기반 탐색으로
            돌아갈 수 있게 구성했습니다.
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-5" method="POST">
          <Input label="Email">
            <Input.TextFiledWithRef
              ref={inputRef}
              name="email"
              value={email}
              onChange={onChange}
              placeholder="you@example.com"
            />
          </Input>

          <Input
            label="Password"
            bottomText={
              errorMessage ?? "로그인은 필요한 순간에만 사용됩니다."
            }
          >
            <Input.TextFiledWithRef
              name="password"
              value={password}
              onChange={onChange}
              type="password"
              placeholder="Enter your password"
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
              {isSubmitting ? "로그인 중..." : "Login"}
            </Button>
            <Button variant="ghost" type="button">
              Forgot password?
            </Button>
          </div>
        </form>
      </Panel>
    </section>
  );
}
