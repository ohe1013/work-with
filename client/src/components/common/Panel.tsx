import { HTMLAttributes } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "soft" | "strong";
}

const toneClassMap = {
  default:
    "border border-white/70 bg-white/86 shadow-[0_20px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl",
  soft: "border border-white/50 bg-white/70 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl",
  strong:
    "border border-[rgba(14,116,144,0.10)] bg-[rgba(248,250,252,0.96)] shadow-[0_24px_60px_rgba(14,116,144,0.14)] backdrop-blur-xl",
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
