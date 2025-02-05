import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { userInfoActions } from "../../../store/user-slice";
import { useLanguage } from "../../../hooks/useLanguage";
import { IoLogOutOutline } from "react-icons/io5";
import jsCookie from "js-cookie";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBuilding } from "react-icons/fa";
import { postLogout } from "../../../lib/types/helpers/backendHelpers";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IUserInfoRootState } from "../../../lib/types/user";
import { useRouter } from "next/router";

interface Props {
  onClose: () => void;
}
const UserAccountBox: React.FC<Props> = ({ onClose }) => {
  const { t, isLoadingLanguage } = useLanguage();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: IUserInfoRootState) => {
    return state.userInfo.userInformation;
  });
  const router = useRouter();
  async function onLogoutClickHandler() {
    try {
      const response = await postLogout({ refresh_token: userInfo?.refresh_token }, userInfo?.access_token ?? '');
      if (response?.detail === "Logout successful") {
        toast.success("Logout successful")
      } else {
        console.warn("Logout response did not indicate success:", response);
      }
    } catch (error: any) {
      console.error("Logout request failed (token might be expired):", error);
    } finally {
      jsCookie.remove("userInfo");
      dispatch(userInfoActions.userLogout());
      onClose();
      router.push('/');
    }
  }
  if(isLoadingLanguage){
    return <div>...</div>
  }
  return (
    <div>
      <ul>
        <li className="my-1 py-1" onClick={onClose}>
          <Link href={"/businessSpace/profile"}>
            <a className="flex items-center hover:text-palette-primary">
              <FaBuilding
                style={{
                  fontSize: "1.5rem",
                  width: "1.8rem",
                }}
              />
              <span className="font-normal rtl:mr-1 ltr:ml-1">
                {t.profileBusiness}
              </span>
            </a>
          </Link>
        </li>
        <li className="my-1 py-1" onClick={onClose}>
          <Link href={"/businessSpace/dashboard"}>
            <a className="flex items-center hover:text-palette-primary">
              <AiOutlineDashboard
                style={{
                  fontSize: "1.5rem",
                  width: "1.8rem",
                }}
              />
              <span className="font-normal rtl:mr-1 ltr:ml-1">
                {t.dashboard}
              </span>
            </a>
          </Link>
        </li>
        <li className="my-1 py-1" onClick={onLogoutClickHandler}>
          <Link href={`/`}>
            <a className="flex items-center hover:text-palette-primary">
              <IoLogOutOutline
                style={{
                  fontSize: "1.5rem",
                  width: "1.8rem",
                }}
              />
              <span className="font-normal rtl:mr-1 ltr:ml-1">{t.logout}</span>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserAccountBox;
