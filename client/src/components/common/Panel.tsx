import { HTMLAttributes } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "soft" | "strong";
}

const toneClassMap = {
  default:
    "border border-white/80 bg-white/88 shadow-[0_18px_44px_rgba(15,23,42,0.09)] backdrop-blur-xl",
  soft: "border border-white/72 bg-[rgba(255,255,255,0.74)] shadow-[0_14px_38px_rgba(15,23,42,0.07)] backdrop-blur-xl",
  strong:
    "border border-[rgba(14,116,144,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.96))] shadow-[0_24px_58px_rgba(14,116,144,0.12)] backdrop-blur-xl",
};

export default function Panel({
  tone = "default",
  className = "",
  children,
  ...props
}: PanelProps) {
  return (
    <div
      className={["rounded-[30px]", toneClassMap[tone], className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
