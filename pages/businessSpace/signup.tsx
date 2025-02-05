import type { GetStaticProps, NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "../../store/user-slice";
import jsCookie from "js-cookie";
import EnteringBox from "../../components/entering/EnteringBox";
import { IUser } from "../../lib/types/user";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IUserInfoRootState } from "../../lib/types/user";
import { getCategories, postSignup } from "../../lib/types/helpers/backendHelpers";
import { toast } from "react-toastify";
import { IBusiness } from "../../lib/types/business";
import { ICategory } from "../../lib/types/categories";

const SignUp: NextPage<{
  categories: ICategory[];
}> = ({ categories }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [load, setLoad] = useState(false);
  const { redirect } = router.query;
  const [successcreate, setSuccessCreate] = useState(false);


  const userInfo = useSelector(
    (state: IUserInfoRootState) => state.userInfo.userInformation
  );

  useEffect(() => {
    if (userInfo) {
      router.push((redirect as string) || "/");
    }
  }, [redirect, router, userInfo]);

  useEffect(() => {
    if (successcreate) {
      const timer = setTimeout(() => {
        setSuccessCreate(false);
      }, 3000); // Reset after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successcreate]);

  async function signUpHandler(user: IUser, business?: IBusiness) {
    setLoad(true);
    try {
      const requestData: { user: IUser; business?: IBusiness } = { user };
      if (business) {
        requestData.business = business;
      }

      const response = await postSignup(requestData);
      if (response?.email[0] === "user with this email already exists.") {
        return toast.error("User with this email already exists.");
      }
      if (response.error) {
        return toast.error(response?.error)
      }
      if (response?.access_token) {
        router.push(`/businessSpace/edit/${(business?.name ?? '').replace(/\s+/g, '-')}/${response?.business_id}`)
        dispatch(userInfoActions.userLogin(response));
        jsCookie.set("userInfo", JSON.stringify(response), {
          expires: 60, // Expiration en secondes (60 jours)
          sameSite: "Strict",
          // secure: process.env.NODE_ENV === "production", // Seulement en HTTPS en prod
        });
        toast.success("Account created sucessfully!")
        setSuccessCreate(true)
        return;
      }
    } catch (error: any) {
      if (error?.message) {
        setErrorMessage(error.message || "An unexpected error occurred."); // Display a network or generic error
      }
    } finally {
      setLoad(false);
    }
  }
  return (
    <EnteringBox
      title="signUp"
      submitHandler={signUpHandler}
      errorMessage={errorMessage}
      buscategories={categories}
      loading={load}
      success={successcreate}
    />
  );
};

export default SignUp;
export const getStaticProps: GetStaticProps = async () => {
  try {
    const categories = await getCategories({})
    return {
      props: {
        categories: categories,
      },
      revalidate: 10
    };
  } catch (error) {
    return {
      props: {
        categories: [],
      },
      revalidate: 10
    };
  }

};