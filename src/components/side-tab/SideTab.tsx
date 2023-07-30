// SideTab.js
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CachedLayoutAtom } from "../../recoil/LayoutStatus";

const SideTab = ({ path }: { path: string }) => {
  const [cachedLayout, setCachedLayout] = useRecoilState(CachedLayoutAtom);
  useEffect(() => {
    // localStorage에서 해당 컴포넌트의 캐시된 데이터를 불러옵니다.
    const cachedData = localStorage.getItem(`cachedData:${path}`);
    if (cachedData !== null) {
      // localStorage에서 불러온 데이터를 파싱하여 캐시합니다.
      setCachedLayout((prev) => ({ ...prev, [path]: JSON.parse(cachedData) }));
    }
  }, [path]);

  return (
    <div
      className={`h-screen py-8 overflow-y-auto bg-white border-l border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700`}
    >
      {/* 여기에 SideTab 컴포넌트의 내용을 작성합니다. */}
    </div>
  );
};

export default SideTab;
