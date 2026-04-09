interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantClassMap = {
  primary:
    "bg-[rgb(var(--color-accent))] text-white hover:bg-[rgb(var(--color-accent-strong))]",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.02em] transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-accent))]",
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
