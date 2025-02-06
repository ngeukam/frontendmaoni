import React, { useEffect, useState } from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { IBusiness } from "../../../../../lib/types/business";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { IUserInfoRootState } from "../../../../../lib/types/user";
import EnteringBoxEditBusiness from "../../../../../components/entering/EnteringBoxEditBusiness";
import { toast } from "react-toastify";
import { getAllBusiness, getBusinessDetailsById, updateBusiness } from "../../../../../lib/types/helpers/backendHelpers";
import { useLanguage } from "../../../../../hooks/useLanguage";

const EditBusinessPage: NextPage<{
    businessinfo: IBusiness;
}> = ({ businessinfo }) => {
    const router = useRouter();
    const { redirect } = router.query;
    const [successedit, setSuccessEdit] = useState(false);
    const [load, setLoad] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { isLoadingLanguage } = useLanguage();
    const businessTypes = [{ name: 'private', id: "1" }, { name: 'public', id: "2" }, { name: 'parapublic', id: "3" }]
    const {t} = useLanguage();
    const userInfo = useSelector(
        (state: IUserInfoRootState) => state.userInfo.userInformation
    );

    useEffect(() => {
        if (!userInfo) {
            router.push((redirect as string) || "/");
        }
    }, [userInfo, redirect, router]);

    useEffect(() => {
        if (successedit) {
            const timer = setTimeout(() => {
                setSuccessEdit(false);
            }, 3000); // Reset after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [successedit]);

    async function editBusinessHandler(business?: IBusiness) {
        setLoad(true);
        try {
            const requestData: { business?: IBusiness } = { business };
            if (business) {
                requestData.business = business;
            }
            const response = await updateBusiness(requestData.business, businessinfo?.id ?? '', userInfo?.access_token ?? '');
            if (response?.name) {
                toast.success(t.updateSuccess ||"Successfully updated!");
                router.push("/businessSpace/profile");
                setSuccessEdit(true);
            }
        } catch (error: any) {
            setErrorMessage(error?.message || "An unexpected error occurred.");
        } finally {
            setLoad(false)
        }
    }
    if (isLoadingLanguage) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">...</div>
            </div>
        );
    }
    return (
        <EnteringBoxEditBusiness
            submitHandler={editBusinessHandler}
            errorMessage={errorMessage}
            loading={load}
            edit={successedit}
            businesstypes={businessTypes}
            businessData={businessinfo}
            title="Edit"
        />
    );
};

export default EditBusinessPage;
export const getStaticPaths: GetStaticPaths = async () => {
    const allBusinesses = await getAllBusiness({});

    // Dynamically create paths based on business details
    const paths = allBusinesses.map((business: any) => ({
        params: {
            id: business.id,
            businessname: business.name.replace(/\s+/g, '-'), // Ensure business name is hyphenated
        },
    }));

    return { paths, fallback: 'blocking' };  // Use 'true' or 'blocking' based on your needs
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params as { id: string };

    try {
        const business_id = id
        // Fetch business details by ID
        const business = await getBusinessDetailsById({}, business_id);

        return {
            props: {
                businessinfo: business,
            },
            revalidate: 10, // Optionally, set revalidation time for ISR
        };
    } catch (error) {
        return {
            props: {
                businessinfo: [],
            },
            revalidate: 10, // Optionally, set revalidation time for ISR
        };
    }
};
