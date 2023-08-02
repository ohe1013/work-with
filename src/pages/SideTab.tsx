// SideTab.js
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CachedLayoutAtom } from "../recoil/LayoutStatus";
import SearchTab from "../components/side-tab/search/SearchTab";

const SideTab = ({ path }: { path: string }) => {
  const [cachedLayout, setCachedLayout] = useRecoilState(CachedLayoutAtom);
  useEffect(() => {
    // localStorage에서 해당 컴포넌트의 캐시된 데이터를 불러옵니다.
    const cachedData = localStorage.getItem(`cachedData:${path}`);
    if (cachedData !== null) {
      // localStorage에서 불러온 데이터를 파싱하여 캐시합니다.
      setCachedLayout((prev) => ({ ...prev, [path]: JSON.parse(cachedData) }));
    }
    console.log(path);
  }, [path]);

  return (
    <div
      className={`h-screen flex flex-col py-8 overflow-y-auto bg-white border-l border-r sm:w-80 w-80 dark:bg-gray-900 dark:border-gray-700`}
    >
      {path === "/" && <SearchTab key={"sideTab" + path}></SearchTab>}
    </div>
  );
};

export default SideTab;
