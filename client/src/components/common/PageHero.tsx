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
        "rounded-[24px] border px-4 py-4 backdrop-blur-sm",
        emphasize
          ? "border-[rgba(14,116,144,0.14)] bg-[rgba(236,253,255,0.84)] shadow-[0_20px_44px_rgba(14,116,144,0.12)]"
          : "border-white/70 bg-white/80 shadow-[0_16px_36px_rgba(15,23,42,0.08)]",
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
  tone = "strong",
}: PageHeroProps) {
  return (
    <Panel
      tone={tone}
      className={[
        "relative overflow-hidden rounded-[34px] px-4 py-5 md:px-6 md:py-6",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.18),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(226,232,240,0.64),_transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/46 to-transparent" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[rgba(14,116,144,0.10)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-accent))]">
              {eyebrow}
            </span>
            {badge ? (
              <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {badge}
              </span>
            ) : null}
          </div>

          <div className="max-w-[760px] space-y-2">
            <h2 className="text-[1.45rem] font-semibold leading-[1.18] tracking-[-0.04em] text-slate-950 md:text-[2.1rem]">
              {title}
            </h2>
            <p className="max-w-[680px] text-sm leading-6 text-slate-600 md:text-[15px]">
              {description}
            </p>
          </div>

          {actions ? <div className="flex flex-col gap-2 sm:flex-row">{actions}</div> : null}

          {children}

          {stats ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{stats}</div>
          ) : null}
        </div>

        {aside ? <div className="w-full lg:max-w-[340px]">{aside}</div> : null}
      </div>
    </Panel>
  );
}
