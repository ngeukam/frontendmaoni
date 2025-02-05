import React, { useEffect, useState } from 'react'
import { CardContent, DashboardCard } from '../../components/UI/card/DashboardCard'
import CodeChart from '../../components/UI/chart/CodeChart'
import ReviewChart from '../../components/UI/chart/ReviewChart'
import ReviewsDataTable from '../../components/UI/table/ReviewsDataTable'
import { GetServerSideProps, NextPage } from 'next'
import { deleteReview, getReports, getUserBusinesses, getUserReviewsBusinesses } from '../../lib/types/helpers/backendHelpers'
import { IUser, IUserBusiness, IUserInfoRootState } from '../../lib/types/user'
import { useSelector } from 'react-redux'
import { useRouter } from "next/router";
import { IReview } from '../../lib/types/review'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useLanguage } from '../../hooks/useLanguage'
import ReportCard from '../../components/UI/card/ReportCard'
import { Report } from '../../lib/types/report'

const Dashboard: NextPage<{
    userbusinesses: IUserBusiness[]; userInfo: IUser; userreviewsbusinesses: IReview[]; businessesreport: Report[]
}> = ({ userbusinesses, userInfo, userreviewsbusinesses, businessesreport }) => {
    const router = useRouter();
    const { t, isLoadingLanguage } = useLanguage();
    const { redirect } = router.query;
    const userInfoCookie = useSelector(
        (state: IUserInfoRootState) => state.userInfo.userInformation
    );
    const [BusinessesReviews, setBusinessesReviews] = useState<IReview[] | null>(null)
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (!userInfoCookie) {
            router.push((redirect as string) || "/");
            return; // Important: Return to prevent further execution
        }
        setBusinessesReviews(userreviewsbusinesses);
        setIsLoading(false); // Set loading to false when data is ready

    }, [redirect, router, userreviewsbusinesses, userInfoCookie]); // Add userreviewsbusinesses to the dependency array


    let activeCodesLength = 0;
    let inactiveCodesLength = 0;

    if (Array.isArray(userbusinesses)) {
        activeCodesLength = userbusinesses.reduce((sum, item) => sum + (item.active_codes?.length ?? 0), 0);
        inactiveCodesLength = userbusinesses.reduce((sum, item) => sum + (item.inactive_codes?.length ?? 0), 0);
    }
    const pieData = [
        { name: t.activeCode || "Active codes", value: activeCodesLength },
        { name: t.inactiveCode || "Inactive codes", value: inactiveCodesLength }
    ];

    const handleDeleteReview = async (id: string) => {
        // Show confirmation dialog using Swal.fire
        const result = await Swal.fire({
            title: t.areYouSure || 'Are you sure?',
            text: t.irreversibleAction || 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: t.cancel || "Cancel",
            confirmButtonText: t.confirmDelete || 'Yes, delete it!',
        });

        // If the user confirmed the deletion
        if (result.isConfirmed) {
            try {
                const response = await deleteReview({ active: false }, id, userInfoCookie?.access_token ?? '');

                if (response?.message === "Review updated successfully!") {
                    // Remove the business from the userbusinesses array
                    const updatedBusinessReviews = userreviewsbusinesses.filter(
                        (review) => review.id !== id
                    );
                    setBusinessesReviews(updatedBusinessReviews);
                    toast.success(t.reviewDeleteSuccess || "Review deleted successfully!");
                    return;
                }
                else if (response?.message === "Failed to update Review.") {
                    return toast.error(t.failedToUpdateReview || "Failed to update Review.");
                }
                else {
                    toast.error(t.somethingWentWrong || "Something went wrong, please try again.");
                }

            } catch (error: any) {
                console.error(error);
                toast.error(t.errorOnDelete || "There was an error deleting the review.");
            }
        }
    }

    if (isLoadingLanguage || userbusinesses.length === 0 || BusinessesReviews?.length === 0 || BusinessesReviews === null || isLoading) { // Check loading state
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">{t.loading}...</div>
            </div>
        );
    }

    return (
        <div>
            <header className="bg-white shadow mb-4 p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
                <h1 className="text-xl font-bold text-center md:text-left">{t.businessDashboard}</h1>
            </header>
            <DashboardCard>
                <CardContent className='flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0'>
                    <CodeChart codeData={pieData} businessesCode={userbusinesses} />
                    <ReviewChart reviews={BusinessesReviews} />
                </CardContent>
            </DashboardCard>
            <ReportCard reports={businessesreport} />
            <ReviewsDataTable reviewsData={BusinessesReviews} handleDeleteReview={handleDeleteReview} />
        </div>
    )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const userInfoCookie = context.req.cookies?.userInfo;

        if (!userInfoCookie) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }

        const userInfo = JSON.parse(userInfoCookie);
        const { access_token, refresh_token } = userInfo || {};

        if (!access_token || !refresh_token) {
            throw new Error("Access token or refresh token is missing.");
        }

        let userbusinesses = await getUserBusinesses({}, access_token);
        let businessesreport = await getReports({}, access_token);
        let userreviewsbusinesses = await getUserReviewsBusinesses({}, access_token)
        // console.log(userreviewsbusinesses)
        return {
            props: {
                userbusinesses: userbusinesses || [],
                userreviewsbusinesses: userreviewsbusinesses || [],
                businessesreport: businessesreport || [],
                userInfo
            },
        };
    } catch (error: any) {
        console.error("Error in getServerSideProps:", error.message);
        return {
            props: {
                userbusinesses: [],
                userreviewsbusinesses: [],
                businessesreport: []
            },
        };
    }
};