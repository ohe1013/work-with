import { ChangeEvent, forwardRef, Ref } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    setValue: (value: string) => void;
}

const Input = forwardRef(({ value, setValue, ...rest }: InputProps, ref: Ref<HTMLInputElement>) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };
    return (
        <div className="mt-2">
            <input
                value={value}
                ref={ref}
                {...rest}
                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleChange}
            />
        </div>
    );
});

export default Input;
