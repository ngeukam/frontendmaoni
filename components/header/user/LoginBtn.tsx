import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { HiOutlineLogin, HiOutlineOfficeBuilding } from "react-icons/hi";
import Link from "next/link";

const LoginBtn = () => {
  const { t } = useLanguage();
  return (
    <Link href={"/businessSpace"}>
      <a aria-label="User actions">
        <div className="hidden md:flex items-center rounded-lg  py-1 px-2 ltr:mr-3 rtl:ml-3 border-[1px] border-gray-200 dark:border-gray-200/40 shadow-sm ">
          <HiOutlineOfficeBuilding style={{ fontSize: "1.6rem" }} />
          <p className="ltr:ml-2 rtl:mr-2 text-lg">
            {t.forBusiness}
          </p>
        </div>
        <div className="md:hidden rtl:ml-3 rtl:mr-1 ltr:mr-3 ltr:ml-1">
          <HiOutlineOfficeBuilding style={{ fontSize: "1.6rem" }} />
        </div>
      </a>
    </Link>
  );
};

export default LoginBtn;
