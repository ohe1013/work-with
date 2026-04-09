import {
  Children,
  ForwardedRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  cloneElement,
  forwardRef,
} from "react";
import useId from "../../hooks/util/useId";

interface InputProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  children: ReactElement;
  bottomText?: string;
}

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
}

const textFieldClassName =
  "block w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 transition duration-150 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100";

const TextFieldWithRef = forwardRef(
  (
    { error, className = "", ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        ref={ref}
        {...props}
        className={[
          textFieldClassName,
          error
            ? "border-rose-300 focus:border-rose-300 focus:ring-rose-50"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }
);

const InputRoot = ({ label, children, bottomText, ...props }: InputProps) => {
  const child = Children.only(children);
  const generatedId = useId("input");
  const id = child.props.id ?? generatedId;
  const isError: boolean = child.props.error ?? false;

  return (
    <div className="w-full space-y-2" {...props}>
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-semibold tracking-[-0.01em] text-slate-800"
        >
          {label}
        </label>
      ) : null}
      {cloneElement(child, {
        id,
        ...child.props,
      })}
      {bottomText != null ? (
        <p
          className={[
            "text-sm leading-5",
            isError ? "text-rose-600" : "text-slate-500",
          ].join(" ")}
        >
          {bottomText}
        </p>
      ) : null}
    </div>
  );
};

const Input = Object.assign(InputRoot, {
  TextFiledWithRef: TextFieldWithRef,
  TextFieldWithRef,
});

export default Input;
