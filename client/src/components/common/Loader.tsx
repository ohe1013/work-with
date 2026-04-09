import Panel from "./Panel";

interface LoaderProps {
  label?: string;
  description?: string;
  className?: string;
  surface?: "inline" | "panel";
}

const Loader = ({
  label = "Loading",
  description,
  className = "",
  surface = "inline",
}: LoaderProps) => {
  const circleCommonClasses =
    "h-2.5 w-2.5 rounded-full bg-[rgb(var(--color-accent))]";
  const content = (
    <div
      className={[
        "flex items-center gap-3 text-left",
        surface === "panel" ? "w-full" : "inline-flex",
      ]
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

      <div className="space-y-0.5">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description ? (
          <p className="text-xs leading-5 text-slate-500">{description}</p>
        ) : null}
      </div>
    </div>
  );

  if (surface === "panel") {
    return (
      <Panel
        tone="soft"
        className={[
          "rounded-[24px] px-4 py-4",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {content}
      </Panel>
    );
  }

  return (
    <div
      className={["inline-flex items-center gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      {content}
    </div>
  );
};

export default Loader;
