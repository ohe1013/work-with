import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CachedLayoutAtom } from "../recoil/LayoutStatus";

const CachedComponent = ({ path }: { path: string }) => {
    const [cachedLayout, setCachedLayout] = useRecoilState(CachedLayoutAtom);

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 Recoil의 CachedLayoutAtom을 업데이트하여 컴포넌트를 캐싱합니다.
        if (cachedLayout[path] === undefined) {
            setCachedLayout((prev) => ({ ...prev, [path]: "Cached Path" }));
        }

        // 컴포넌트가 언마운트될 때 localStorage에 상태를 저장합니다.
        return () => {
            localStorage.setItem(`cachedData:${path}`, JSON.stringify(cachedLayout[path]));
        };
    }, [cachedLayout, path, setCachedLayout]);

    return <div>{cachedLayout[path]}</div>;
};

export default CachedComponent;
