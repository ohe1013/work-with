import { ReactNode } from "react";
import Panel from "./Panel";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <Panel
      tone="soft"
      className={[
        "flex flex-col items-start gap-3 px-5 py-5 text-left",
        className,
      ].join(" ")}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(14,116,144,0.10)] text-[rgb(var(--color-accent))]">
        {icon ?? (
          <span className="text-lg font-semibold" aria-hidden="true">
            ·
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
          {title}
        </h3>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </Panel>
  );
}
