import React from "react";
import Link from "next/link";
import { extraMenu } from "../../../../mock/menuItems";
import { useLanguage } from "../../../../hooks/useLanguage";
import { useRouter } from "next/router";

const ExtraMenu = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const isBusinessSpace = router.pathname.includes("businessSpace");
  return (
    <div className="flex items-center border-gray-300 grow rtl:mx-5 ltr:ml-2">
      {extraMenu.map((menuItem) => {
        if (menuItem.title === "connection" && !isBusinessSpace) {
          return null;
        }
        const isActive = router.pathname === menuItem.href;
        return (
          <div
            className={`flex items-center text-base/90 mx-2 ${isActive ? "text-blue-600 font-bold" : ""
              }`}
            key={menuItem.title}
          >
            <menuItem.icon className="mr-2" />
            <Link href={menuItem.href}>
              <a>{t[`${menuItem.title}`]}</a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ExtraMenu;
