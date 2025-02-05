import axios from "axios";
import { useEffect } from "react";
import { userInfoActions } from "../../store/user-slice";
import store from "../../store";
import { toast } from "react-toastify";
import jsCookie from "js-cookie";
import { useRouter, NextRouter } from 'next/router'; // Import useRouter

export async function checkUserSession(router:NextRouter) { // Pass the router as an argument
    const userInfoCookie = jsCookie.get("userInfo");

    if (!userInfoCookie) {
        return; // No user info, nothing to check
    }

    try {
        const userInfo = JSON.parse(userInfoCookie);
        const { access_token } = userInfo;

        if (!access_token) {
            // Handle missing access token (clear cookie and logout)
            jsCookie.remove("userInfo");
            store.dispatch(userInfoActions.userLogout());
            toast.info("Access token missing. Please log in again.");
            return;
        }

        const response = await axios.get("/api/auth/session");

        // Check for session expiration in the response
        if (response.data.error === "Session expired") {
            jsCookie.remove("userInfo");
            store.dispatch(userInfoActions.userLogout());
            toast.info("Session expired. Please log in again.");
            router.push('/'); // Redirect to login page
            return; // Important: Stop further execution
        }

    } catch (error) {
        console.error("Error during session check:", error);
        jsCookie.remove("userInfo");
        store.dispatch(userInfoActions.userLogout());
        router.push('/'); // Redirect to login page
    }
}

const SessionChecker = () => {
    const router = useRouter(); // Initialize the router
    useEffect(() => {
        checkUserSession(router); // Pass the router to the function
    }, [router]); // Add router to the dependency array

    return null;
};

export default SessionChecker;