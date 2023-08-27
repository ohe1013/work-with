// SideTab.js
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { CachedLayoutAtom } from "../../recoil/LayoutStatus";
import SearchTab from "./search/SearchTab";

const SideTab = ({ path }: { path: string }) => {
  const [cachedLayout, setCachedLayout] = useRecoilState(CachedLayoutAtom);
  const [on, setOn] = useState(true);
  useEffect(() => {
    // localStorage에서 해당 컴포넌트의 캐시된 데이터를 불러옵니다.
    const cachedData = localStorage.getItem(`cachedData:${path}`);
    if (!cachedData) {
      // localStorage에서 불러온 데이터를 파싱하여 캐시합니다.
      setCachedLayout((prev) => ({ ...prev, [path]: JSON.parse(cachedData) }));
    }
    console.log(cachedLayout);
  }, [path]);

  return (
    <div
      className={`h-scree shrink-0 flex flex-col py-8 overflow-y-auto bg-white border-l border-r dark:bg-gray-900 dark:border-gray-700 
                ${
                  !on ? "w-0" : "sm:w-96 w-96"
                } transition-width duration-300 ease-in-out`}
    >
      <button
        style={on ? { left: "425px" } : { left: "60px" }}
        onClick={() => setOn(!on)}
        className={`absolute top-1/2 -translate-y-1/2w-10 cursor-pointer z-10  ${
          !on ? "left-16" : "left-96"
        } transition-width duration-300 ease-in-out`}
      >
        펼치기
      </button>

      {path === "/" && <SearchTab key={"sideTab" + path}></SearchTab>}
    </div>
  );
};

export default SideTab;
