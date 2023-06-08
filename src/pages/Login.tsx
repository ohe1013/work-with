import { FormEvent, useState } from "react";
import * as auth from "../hooks/auth/useLogin";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/\bInput";
import Label from "../components/common/Label";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const disabledButton = !email || !password;
    const navigate = useNavigate();

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        auth.login({ email, password }).then((res) => {
            auth.saveToken(res);
            navigate("/");
        });
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">로그인</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={submitHandler} className="space-y-6" method="POST">
                    <div>
                        <Label text="Email" htmlFor="email"></Label>
                        <Input
                            value={email}
                            setValue={setEmail}
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label text="Password" htmlFor="password"></Label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <Input
                            value={password}
                            setValue={setPassword}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div>
                        <button
                            disabled={disabledButton}
                            type="submit"
                            className={
                                "flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" +
                                (disabledButton
                                    ? " text-black hover:bg-gray-600 hover:text-white"
                                    : " bg-indigo-600 text-white hover:bg-indigo-800")
                            }
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
