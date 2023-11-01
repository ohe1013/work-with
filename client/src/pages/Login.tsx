import { FormEvent, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import useInputs from "../hooks/util/useInputs";
import { useAuth } from "../hooks/auth/useAuth";
export default function Login() {
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  const {
    form: { email, password },
    onChange: onChange,
  } = useInputs<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const isDisabled = !email || !password;
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (isDisabled) return false;

    auth
      .login({ email: email, password: password })
      .then(() => {
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
    <section className="pt-10 w-full" id="osm">
      <article className="relative w-full h-[calc(100vh_-_10px)]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            로그인
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={submitHandler} className="space-y-6" method="POST">
            <div>
              <Input label="Email">
                <Input.TextFiledWithRef
                  ref={inputRef}
                  name={"email"}
                  value={email}
                  onChange={onChange}
                />
              </Input>
            </div>

            <div>
              <Input label="Password">
                <Input.TextFiledWithRef
                  name={"password"}
                  value={password}
                  onChange={onChange}
                  type={"password"}
                />
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
              <Button isDisabled={isDisabled} type="submit">
                Login
              </Button>
            </div>
          </form>
        </div>
      </article>
    </section>
  );
}
