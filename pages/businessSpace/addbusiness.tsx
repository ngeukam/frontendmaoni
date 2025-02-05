import React, { useEffect, useState } from "react";
import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { IUserInfoRootState } from "../../lib/types/user";
import { toast } from "react-toastify";
import EnteringBoxAddBusiness from "../../components/entering/EnteringBoxAddBusiness";
import { getCategories, postBusiness } from "../../lib/types/helpers/backendHelpers";
import { IBusiness } from "../../lib/types/business";
import { ICategory } from "../../lib/types/categories";
import { useLanguage } from "../../hooks/useLanguage";


const EditBusinessPage: NextPage<{
    categories: ICategory[]
}> = ({ categories }) => {
    const router = useRouter();
    const { redirect } = router.query;
    const [successcreate, setSuccessCreate] = useState(false);
    const [load, setLoad] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {t, isLoadingLanguage} = useLanguage()

    const businessTypes = [{ name: 'private', id: "1" }, { name: 'public', id: "2" }, { name: 'parapublic', id: "3" }]

    const userInfo = useSelector(
        (state: IUserInfoRootState) => state.userInfo.userInformation
    );
    useEffect(() => {
        if (!userInfo) {
            router.push((redirect as string) || "/");
        }
    }, [userInfo, redirect, router]);

    useEffect(() => {
        if (successcreate) {
            const timer = setTimeout(() => {
                setSuccessCreate(false);
            }, 3000); // Reset after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [successcreate]);

    async function signUpHandler(business?: IBusiness) {
        setLoad(true);
        try {
            const requestData: { business?: IBusiness } = { business };
            if (business) {
                requestData.business = business;
            }
            const response = await postBusiness(requestData.business, userInfo?.access_token ?? '');
            if (response?.error === false) {
                toast.success(`${response?.data.name} ${t.has_successfully_created ?? "has_successfully_created"}!`);
                router.push("/businessSpace/profile");
                setSuccessCreate(true);
            }
            else {
                return toast.error(response?.error)
            }
        } catch (error: any) {
            setErrorMessage(error?.message || "An unexpected error occurred.");
        } finally {
            setLoad(false)
        }
    }
    if(isLoadingLanguage){
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">...</div>
            </div>
        );
    }
    return (
        <EnteringBoxAddBusiness
            submitHandler={signUpHandler}
            errorMessage={errorMessage}
            loading={load}
            create={successcreate}
            businesstypes={businessTypes}
            buscategories={categories}
        />
    );
};

export default EditBusinessPage;
export const getStaticProps: GetStaticProps = async () => {
    try {
        const categories = await getCategories({})
        return {
            props: {
                categories: categories || [],
            },
            revalidate: 10
        };
    } catch (error) {
        return {
            props: {
                categories: [],
            },
            revalidate: 10
        }
    }

};