import { FormEvent, useEffect, useRef, useState } from "react";
import * as auth from "../hooks/auth/useLogin";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
export default function Login() {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  // const isDisabled = !email.current?.value || !password.current?.value;
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    // if (isDisabled) return false;
    console.log(email.current.value);
    auth
      .login({ email: email.current.value, password: password.current.value })
      .then((res) => {
        auth.saveToken(res);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          로그인
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={submitHandler} className="space-y-6" method="POST">
          <div>
            <Input label="Email">
              <Input.TextFiled ref={email} />
            </Input>
          </div>

          <div>
            <Input label="Password">
              <Input.TextFiled ref={password} type={"password"} />
            </Input>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <div>
            <Button isDisabled={false} type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
