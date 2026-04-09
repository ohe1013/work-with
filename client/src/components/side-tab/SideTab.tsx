import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import Panel from "../common/Panel";
import { CachedLayoutAtom } from "../../recoil/layout";
import SearchTab from "./search/SearchTab";

const SideTab = ({ path }: { path: string }) => {
  const setCachedLayout = useSetRecoilState(CachedLayoutAtom);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const cachedData = localStorage.getItem(`cachedData:${path}`);
    if (cachedData) {
      setCachedLayout((prev) => ({ ...prev, [path]: JSON.parse(cachedData) }));
    }
  }, [path, setCachedLayout]);

  if (path !== "/") {
    return null;
  }

  return (
    <section
      className={[
        "fixed bottom-[92px] left-3 right-3 z-20 transition-all duration-300 md:static md:bottom-auto md:left-auto md:right-auto md:mr-4 md:min-w-[360px] md:max-w-[380px]",
        on
          ? "translate-y-0 md:w-[380px]"
          : "translate-y-[calc(100%-76px)] md:w-[88px]",
      ].join(" ")}
    >
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] px-4 py-4">
          <div className={on ? "block" : "hidden md:block"}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Discovery panel
            </p>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
              지금 가능한 운동 메이트
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOn(!on)}
            aria-expanded={on}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          >
            {on ? "−" : "+"}
          </button>
        </div>

        {on ? <SearchTab key={"sideTab" + path}></SearchTab> : null}
      </Panel>
    </section>
  );
};

export default SideTab;
