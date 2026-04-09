import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import Panel from "../components/common/Panel";
import SideTab from "../components/side-tab/SideTab";
import { PageEnum } from "../enum/page";
import { pageAtom } from "../recoil/page";
import { routes } from "../routes";
import Header from "./Header";

const menuList = [
  {
    path: "/",
    label: PageEnum.HOME,
    shortLabel: "지도",
    description: "탐색",
  },
  {
    path: "/find",
    label: PageEnum.FIND,
    shortLabel: "찾기",
    description: "조건",
  },
  {
    path: "/regist",
    label: PageEnum.REGIST,
    shortLabel: "등록",
    description: "모집",
  },
  {
    path: "/login",
    label: PageEnum.AUTH,
    shortLabel: "로그인",
    description: "인증",
  },
];

function Layout() {
  const [activeTabState, setActiveTabState] =
    useRecoilState<PageEnum>(pageAtom);
  const location = useLocation();
  const findRouteByPath = (path: string) => {
    return routes[0].children.find((route) => route.path === path);
  };

  useEffect(() => {
    const currentRoutes = findRouteByPath(location.pathname);
    if (currentRoutes) {
      setActiveTabState(currentRoutes.label);
    } else {
      setActiveTabState(PageEnum.HOME);
    }
  }, [location.pathname, setActiveTabState]);

  return (
    <div className="min-h-screen pb-28 md:pb-8">
      <Header currentPage={activeTabState} />

      <div className="mx-auto max-w-[1520px] px-3 pb-4 md:px-4">
        <div className="flex gap-3 xl:gap-5">
          <aside className="hidden md:block">
            <Panel className="sticky top-[106px] flex w-[104px] flex-col items-center gap-4 px-3 py-4">
              <div className="space-y-1 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Work With
                </p>
                <p className="text-xs font-semibold tracking-[-0.02em] text-slate-800">
                  지도 우선
                </p>
              </div>

              {menuList.map((menu) => {
                const isActive = activeTabState === menu.label;

                return (
                  <Link
                    key={menu.label}
                    to={menu.path}
                    title={menu.label}
                    className={[
                      "flex w-full flex-col items-center gap-1 rounded-[24px] px-2 py-3 text-center transition",
                      isActive
                        ? "bg-[rgb(var(--color-accent))] text-white shadow-[0_18px_38px_rgba(14,116,144,0.20)]"
                        : "text-slate-500 hover:bg-white/84 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <span className="text-sm font-semibold tracking-[-0.02em]">
                      {menu.shortLabel}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] opacity-80">
                      {menu.description}
                    </span>
                  </Link>
                );
              })}
            </Panel>
          </aside>

          <div className="relative flex min-h-[calc(100vh-132px)] flex-1 gap-3 md:min-h-[calc(100vh-112px)] xl:gap-5">
            <SideTab path={location.pathname} />
            <main className="min-w-0 flex-1">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-4 left-3 right-3 z-40 md:hidden">
        <Panel className="grid grid-cols-4 gap-2 px-2 py-2">
          {menuList.map((menu) => {
            const isActive = activeTabState === menu.label;

            return (
              <Link
                key={menu.label}
                to={menu.path}
                className={[
                  "flex min-h-[60px] flex-col items-center justify-center rounded-[22px] px-2 text-center transition",
                  isActive
                    ? "bg-[rgb(var(--color-accent))] text-white shadow-[0_16px_34px_rgba(14,116,144,0.22)]"
                    : "text-slate-500 hover:bg-white/72 hover:text-slate-900",
                ].join(" ")}
              >
                <span className="text-sm font-semibold tracking-[-0.02em]">
                  {menu.shortLabel}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] opacity-80">
                  {menu.description}
                </span>
              </Link>
            );
          })}
        </Panel>
      </nav>
    </div>
  );
}

export default Layout;
