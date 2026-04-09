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
  "block w-full rounded-[22px] border border-transparent bg-white/92 px-4 py-3 text-[15px] text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-[rgba(148,163,184,0.18)] placeholder:text-slate-400 transition duration-200 focus:border-[rgba(14,116,144,0.18)] focus:outline-none focus:ring-2 focus:ring-[rgba(14,116,144,0.2)]";

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
            ? "border-rose-200 ring-[rgba(244,63,94,0.22)] focus:ring-[rgba(244,63,94,0.22)]"
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
