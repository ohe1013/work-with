import { InputHTMLAttributes, forwardRef } from "react";
import Panel from "./Panel";

interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  shellClassName?: string;
}

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ shellClassName = "", className = "", ...props }, ref) => {
    return (
      <Panel
        tone="soft"
        className={[
          "flex items-center gap-3 rounded-[26px] px-4 py-3 ring-1 ring-transparent transition focus-within:ring-[rgba(14,116,144,0.16)]",
          shellClassName,
        ].join(" ")}
      >
        <svg
          className="h-5 w-5 shrink-0 text-slate-400"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M13.75 13.75L17.5 17.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="8.75"
            cy="8.75"
            r="5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
        <input
          ref={ref}
          type="search"
          className={[
            "w-full border-0 bg-transparent py-1 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none",
            className,
          ].join(" ")}
          {...props}
        />
      </Panel>
    );
  }
);

export default SearchField;
