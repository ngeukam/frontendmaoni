import React from "react";
import Link from "next/link";
import { useLanguage } from "../../../../hooks/useLanguage";
import { extraMenu } from "../../../../mock/menuItems";
import { useDispatch } from "react-redux";
import { sideNavBarActions } from "../../../../store/sideNavBar-slice";
import { activeMenuItemActions } from "../../../../store/activeMenuItem-slice";
import { IDropDown } from "../../../../lib/types/dropDown";
// import MenuItems from "../../../UI/MenuItems/MenuItems";
import { useRouter } from "next/router";

interface SideNavContentProps {
  onClose: () => void;
}
const SideNavContent: React.FC<SideNavContentProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const isBusinessSpace = router.pathname.includes("businessSpace");
  const dispatch = useDispatch();
  const openNav = (
    sidebarSideContent: IDropDown[] = [],
    activeItemName: string,
    activeItemIndex: number
  ) => {
    dispatch(sideNavBarActions.setSidebarEntries(sidebarSideContent));
    dispatch(sideNavBarActions.openSidebar());
    dispatch(activeMenuItemActions.setActiveMenuItemText(activeItemName));
    dispatch(activeMenuItemActions.setActiveMenuItemIndex(activeItemIndex));
  };
  return (
    <div className="absolute w-full">
      <div className="flex flex-col mt-3 pt-3 ltr:px-5 rtl:px-5 cursor-pointer">
        {extraMenu.map((menuItem) => {
          if (menuItem.title === "connection" && !isBusinessSpace) {
            return null;
          }
          const isActive = router.pathname === menuItem.href;
          return (

            <div
              className={`flex items-center py-3 ${isActive ? "text-blue-600 font-bold" : "text-palette-mute"
                }`}
              key={menuItem.title}
              onClick={onClose}
            >
              <menuItem.icon />
              <Link href={menuItem.href}>
                <a className="mx-4">{t[`${menuItem.title}`]}</a>
              </Link>
            </div>
          );
        })}
        <hr className="mt-6 mb-4 border-gray-200" />
      </div>
      {/* <h2 className="font-bold text-lg py-3 ltr:px-5 rtl:px-5">
        {t.CategoryOfGoods}
      </h2>
      <MenuItems onClick={openNav} /> */}
    </div>
  );
};

export default SideNavContent;
