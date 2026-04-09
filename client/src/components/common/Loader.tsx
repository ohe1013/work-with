interface LoaderProps {
  label?: string;
  className?: string;
}

const Loader = ({ label = "Loading", className = "" }: LoaderProps) => {
  const circleCommonClasses =
    "h-2.5 w-2.5 rounded-full bg-[rgb(var(--color-accent))]";

  return (
    <div
      className={["inline-flex items-center gap-3 text-sm text-slate-500", className]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center">
        <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
        <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
        <div className={`${circleCommonClasses} animate-bounce400`}></div>
      </div>
      <span>{label}</span>
    </div>
  );
};

export default Loader;
