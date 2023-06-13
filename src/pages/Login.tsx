import { FormEvent, useEffect, useRef, useState } from "react";
import * as auth from "../hooks/auth/useLogin";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Label from "../components/common/Label";
import Button from "../components/common/Button";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isDisabled = !email || !password;
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const submitHandler = (event: FormEvent) => {
        event.preventDefault();
        auth.login({ email, password }).then((res) => {
            auth.saveToken(res);
            navigate("/");
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
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">로그인</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={submitHandler} className="space-y-6" method="POST">
                    <div>
                        <Label text="Email" htmlFor="email"></Label>
                        <Input
                            value={email}
                            setValue={setEmail}
                            ref={inputRef}
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="off"
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
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div>
                        <Button isDisabled={isDisabled} type="submit">
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
