import { Link, Outlet, useLocation } from "react-router-dom";
import DynamicSvg from "../components/common/DynamicSvg";
import SideTab from "../components/side-tab/SideTab";
import { PageEnum } from "../enum/page";
import { useRecoilState } from "recoil";
import { pageAtom } from "../recoil/PageStatus";
import { routes } from "../routes";
import { useEffect } from "react";

function Layout() {
  const [activeTabState, setActiveTabState] =
    useRecoilState<PageEnum>(pageAtom);

  const handleClick = (page: PageEnum) => {
    setActiveTabState(page === PageEnum.HOME ? PageEnum.HOME : page);
  };

  const menuList = [
    { path: "/", label: PageEnum.HOME },
    { path: "login", label: PageEnum.AUTH },
  ];
  const location = useLocation();
  const findRouteByPath = (path) => {
    return routes[0].children.find((route) => route.path === path);
  };
  useEffect(() => {
    const currentRoutes = findRouteByPath(location.pathname);
    if (currentRoutes) {
      setActiveTabState(currentRoutes.label);
    } else {
      setActiveTabState(PageEnum.HOME);
    }
  }, [location.pathname]);

  return (
    <>
      <aside className="flex">
        <div className="flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700">
          <a href="#"></a>
          {menuList.map((menu, idx) => (
            <Link
              key={menu.label + idx}
              to={menu.path}
              onClick={() => handleClick(menu.label)}
              className={
                activeTabState === menu.label
                  ? "p-1.5 text-blue-500 transition-colors duration-200 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800"
                  : "p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
              }
            >
              <DynamicSvg iconName={menu.label.toLowerCase()} />
            </Link>
          ))}

          <div className={"absolute bottom-0"}>hi</div>
        </div>
        <SideTab path={location.pathname}></SideTab>
        <Outlet />
      </aside>
    </>
  );
}

export default Layout;
