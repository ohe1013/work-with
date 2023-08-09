import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  ReactElement,
  Children,
  InputHTMLAttributes,
  ForwardedRef,
  cloneElement,
} from "react";
import useId from "../../hooks/util/useId";

interface InputProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  children: ReactElement;
  bottomText?: string;
}

const Input = ({ label, children, bottomText, ...props }: InputProps) => {
  const child = Children.only(children);
  const generatedId = useId("input");
  const id = child.props.id ?? generatedId;
  const isError: boolean = child.props.error ?? false;

  return (
    <div className="w-full" {...props}>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      {cloneElement(child, {
        id,
        ...child.props,
      })}
      {bottomText != null ? (
        <p
          className={
            "mt-1 inline-block font-normal text-base " +
            (isError ? "text-red-600 " : "text-gray-500 ")
          }
        >
          {bottomText}
        </p>
      ) : null}
    </div>
  );
};
interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
}
Input.TextFiled = forwardRef(
  (
    { error, ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className="mt-2">
        <input
          ref={ref}
          {...props}
          className={
            "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" +
            (error ? " shadow-lg shadow-red-600" : " ")
          }
        />
      </div>
    );
  },
);

export default Input;
