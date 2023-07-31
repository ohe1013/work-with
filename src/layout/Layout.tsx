import { Outlet } from "react-router-dom";
import HomeTab from "../components/side-tab/HomeTab";
import DynamicSvg from "../components/common/DynamicSvg";
import { useState } from "react";
import SideTab from "../components/side-tab/SideTab";
import Aside from "../components/side-tab/CommunityTab";

function Layout() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? 0 : index));
  };

  const menuList = [ "home",  "community"];

  return (
    <>
      <aside className="flex">
        <div className="flex flex-col items-center w-16 h-screen py-8 space-y-8 bg-white dark:bg-gray-900 dark:border-gray-700">

          <a href="#"></a>
          {menuList.map((menu, idx) => (
            <a
              href=  {menu}
              onClick={() => handleClick(idx)}
              className={
                activeIndex === idx
                  ? "p-1.5 text-blue-500 transition-colors duration-200 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800"
                  : "p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100"
              }
            >
              <DynamicSvg iconName={menu} />
            </a>
          ))}

            <div className={"absolute bottom-0"}>hi</div>
        </div>
        <Aside></Aside>
        <Outlet />
      </aside>
    </>
  );
}

export default Layout;
