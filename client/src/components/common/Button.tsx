interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantClassMap = {
  primary:
    "bg-[rgb(var(--color-accent))] text-white shadow-[0_18px_40px_rgba(14,116,144,0.22)] hover:bg-[rgb(var(--color-accent-strong))]",
  secondary:
    "bg-white/92 text-slate-900 ring-1 ring-[rgba(148,163,184,0.22)] shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:bg-white",
  ghost:
    "bg-transparent text-slate-600 hover:bg-white/72 hover:text-slate-900",
};

const sizeClassMap = {
  sm: "min-h-[42px] px-4 text-sm",
  md: "min-h-[50px] px-5 text-sm",
  lg: "min-h-[56px] px-6 text-base",
};

const Button: React.FC<ButtonProps> = ({
  isDisabled = false,
  variant = "primary",
  size = "md",
  fullWidth = true,
  className = "",
  children,
  disabled,
  ...rest
}) => {
  const isButtonDisabled = isDisabled || disabled;

  return (
    <button
      disabled={isButtonDisabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.02em] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-accent))]",
        variantClassMap[variant],
        sizeClassMap[size],
        fullWidth ? "w-full" : "w-auto",
        isButtonDisabled
          ? "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none hover:bg-slate-200"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
