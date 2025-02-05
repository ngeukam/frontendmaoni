import axios from "axios";
import { useEffect } from "react";
import store from "../../store";
import { userInfoActions } from "../../store/user-slice";
import jsCookie from "js-cookie";
import { useRouter } from 'next/router';

// Helper function to set the userInfo cookie
const setUserInfoCookie = (userInfo:any) => {
  jsCookie.set("userInfo", JSON.stringify(userInfo), { 
    expires: 60 * 24 * 60, // 60 days (Max-Age equivalent)
    sameSite: "Strict",
    // secure: process.env.NODE_ENV === "production",
  });
};


export const refreshToken = async () => { // No need to pass router here
  try {
    const response = await axios.post("/api/auth/refresh-token");
    const userInfo = response.data?.userInfo;

    if (userInfo) { // Check if userInfo exists
      store.dispatch(userInfoActions.userLogin(userInfo));
      setUserInfoCookie(userInfo);
      return userInfo.access_token;
    } else {
        throw new Error("No userInfo received from refresh token endpoint")
    }
  } catch (error) {
    console.error("Session expired or refresh token failed:", error); // More descriptive error message
    jsCookie.remove("userInfo");
    store.dispatch(userInfoActions.userLogout());
    return null; // Return null to signal failure
  }
};

const TokenRefresher = () => {
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndRefresh = async () => {
      const userInfoCookie = jsCookie.get("userInfo");

      if (!userInfoCookie) {
        store.dispatch(userInfoActions.userLogout());
        return; // Stop execution
      }

      const accessToken = await refreshToken(); // Call refresh token function

      if (!accessToken) { // If refresh token fails
        router.push('/'); // Redirect to login
      }
    };

    checkTokenAndRefresh(); // Call the function immediately
  }, [router]); // router is still a dependency

  return null; // This component doesn't render anything
};

export default TokenRefresher;