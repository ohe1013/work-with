import { HTMLAttributes } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "soft" | "strong";
}

const toneClassMap = {
  default:
    "border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
  soft: "border border-slate-200/70 bg-white/96 shadow-[0_4px_16px_rgba(15,23,42,0.03)]",
  strong:
    "border border-slate-200/85 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]",
};

export default function Panel({
  tone = "default",
  className = "",
  children,
  ...props
}: PanelProps) {
  return (
    <div
      className={["rounded-[28px]", toneClassMap[tone], className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
