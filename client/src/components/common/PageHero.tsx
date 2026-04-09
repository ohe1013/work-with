import { ReactNode } from "react";
import Panel from "./Panel";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
  children?: ReactNode;
  stats?: ReactNode;
  aside?: ReactNode;
  className?: string;
  tone?: "default" | "soft" | "strong";
}

interface PageHeroStatProps {
  label: string;
  value: string;
  helper?: string;
  emphasize?: boolean;
  className?: string;
}

export function PageHeroStat({
  label,
  value,
  helper,
  emphasize = false,
  className = "",
}: PageHeroStatProps) {
  return (
    <div
      className={[
        "rounded-[20px] border px-4 py-4",
        emphasize
          ? "border-slate-300 bg-white"
          : "border-slate-200/80 bg-white",
        className,
      ].join(" ")}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold tracking-[-0.03em] text-slate-900 md:text-[15px]">
        {value}
      </p>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
    </div>
  );
}

export default function PageHero({
  eyebrow,
  title,
  description,
  badge,
  actions,
  children,
  stats,
  aside,
  className = "",
  tone = "default",
}: PageHeroProps) {
  return (
    <Panel
      tone={tone}
      className={[
        "px-4 py-5 md:px-6 md:py-6",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {eyebrow}
            </span>
            {badge ? (
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {badge}
              </span>
            ) : null}
          </div>

          <div className="max-w-[760px] space-y-2">
            <h2 className="text-[1.4rem] font-semibold leading-[1.2] tracking-[-0.04em] text-slate-950 md:text-[2rem]">
              {title}
            </h2>
            <p className="max-w-[620px] text-sm leading-6 text-slate-600 md:text-[15px]">
              {description}
            </p>
          </div>

          {actions ? <div className="flex flex-col gap-2 sm:flex-row">{actions}</div> : null}

          {children}

          {stats ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{stats}</div>
          ) : null}
        </div>

        {aside ? <div className="w-full lg:max-w-[320px]">{aside}</div> : null}
      </div>
    </Panel>
  );
}
