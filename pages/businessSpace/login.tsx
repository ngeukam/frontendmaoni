import type { NextPage } from "next";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import jsCookie from "js-cookie";
import EnteringBox from "../../components/entering/EnteringBox";
import { IUser, IUserInfoRootState } from "../../lib/types/user";
import { userInfoActions } from "../../store/user-slice";
import { getError } from "../../utilities/error";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postLogin } from "../../lib/types/helpers/backendHelpers";
import { toast } from "react-toastify";
import { useLanguage } from "../../hooks/useLanguage";

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [load, setLoad] = useState(false);
  const [successlog, setSuccessLog] = useState(false);
  const { t } = useLanguage();

  const userInfo = useSelector((state: IUserInfoRootState) => {
    return state.userInfo.userInformation;
  });

  useEffect(() => {
    if (successlog) {
      const timer = setTimeout(() => {
        setSuccessLog(false);
      }, 3000); // Reset after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [setSuccessLog, successlog]);

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo, router]);

  async function LoginHandler(user: IUser) {
    const { email, password } = user;
    try {
      setLoad(true);
      const response = await postLogin({
        email,
        password,
      });
      const { message, data, session_active } = response

      if (session_active) {
        return toast.warning(t.session_already_active)
      }
      if (message === "Login successfully!") {
        dispatch(userInfoActions.userLogin(data));
        jsCookie.set("userInfo", JSON.stringify(data));
        setSuccessLog(true)
        router.push("/");
      }
      else {
        toast.error(t.wrong_credentials);
        return;
      }
    } catch (error: any) {
      setErrorMessage(getError(error));
      console.log('login error', error)
    } finally {
      setLoad(false);
    }
  }
  return (
    <EnteringBox
      title="login"
      submitHandler={LoginHandler}
      errorMessage={errorMessage}
      success={successlog}
      loading={load}
      buscategories={[]}
    />
  );
};

export default Login;
