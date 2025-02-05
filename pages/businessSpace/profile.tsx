import { GetServerSideProps, NextPage } from "next";
import EnteringBoxCollaborator from "../../components/entering/EnteringBoxCollaborator";
import EnteringBoxNewPassword from "../../components/entering/EnteringBoxNewPassword";
import { useEffect, useState } from "react";
import { IUser, IUserBusiness, IUserInfoRootState } from "../../lib/types/user";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getError } from "../../utilities/error";
import capitalizeWords from "../../utilities/capitalize";
import CollaboratorsTable from "../../components/UI/table/collaboratortable";
import EnteringBoxCheckCode from "../../components/entering/EnteringBoxCheckCode";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import BusinessCollaboratorListSection from "../../components/businessList/CollaboratorBusinessList";
import { ICollaborator } from "../../lib/types/collaborator";
import { getCollaboratorSameBusiness, getUserBusinesses, postChangePassword, postCollaborator, updateBusiness } from "../../lib/types/helpers/backendHelpers";
import { useLanguage } from "../../hooks/useLanguage";

const Profile: NextPage<{
    userbusinesses: IUserBusiness[]; collaboratorsamebusiness: ICollaborator[]; userInfo: IUser;
}> = ({ userbusinesses, collaboratorsamebusiness, userInfo }) => {
    const router = useRouter();
    const { t, isLoadingLanguage } = useLanguage()
    const { redirect } = router.query;
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessage2, setErrorMessage2] = useState("");
    const [loadpassword, setLoadPassword] = useState(false);
    const [loadcollaborator, setLoadCollaborator] = useState(false);
    const [successupdate, setSuccessUpdate] = useState(false);
    const [successcreate, setSuccessCreate] = useState(false);
    const [userBusinesses, setUserBusinesses] = useState<IUserBusiness[] | null>(null);
    const [hiddenEval, setHiddenEval] = useState<Record<string, boolean>>({});
    const [hiddenReview, setHiddenReview] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    const userInfoCookie = useSelector(
        (state: IUserInfoRootState) => state.userInfo.userInformation
    );
    useEffect(() => {
        const initialHiddenEval: Record<string, boolean> = {};
        const initialHiddenReview: Record<string, boolean> = {};

        if (Array.isArray(userBusinesses)) { // Check if it's an array
            userBusinesses.forEach((company) => {
                initialHiddenEval[company.id] = company.showeval ?? false;
                initialHiddenReview[company.id] = company.showreview ?? false;
            });
        }

        setHiddenEval(initialHiddenEval);
        setHiddenReview(initialHiddenReview);
    }, [userBusinesses]);

    useEffect(() => {
        if (!userInfoCookie) {
            router.push((redirect as string) || "/");
            return; // Important: Return to prevent further execution
        }
        setUserBusinesses(userbusinesses);
        setIsLoading(false); // Set loading to false when data is ready

    }, [redirect, router, userbusinesses]); // Add userreviewsbusinesses to the dependency array



    const roles = [{ name: 'manager', id: "1" }, { name: t.collaborator || 'collaborator', id: "2" }]

    const handleCompanyClick = (company: any) => {
        router.push(`/businessSpace/edit/${company?.name.replace(/\s+/g, '-')}/${company?.id}`)
    };
    const handleDeleteCompany = async (id: string) => {
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
                const response = await updateBusiness({ active: false }, id, userInfoCookie?.access_token ?? '');
                if (response?.message === "Business updated successfully!") {
                    // Remove the business from the userbusinesses array
                    const updatedUserBusinesses = userbusinesses.filter(
                        (business) => business.id !== id
                    );
                    setUserBusinesses(updatedUserBusinesses);
                    toast.success(t.businessDeleteSuccess || "Business deleted successfully!");
                    return;
                }
                else if (response?.message === "Failed to update business.") {
                    return toast.error(t.failedToDeleteBusiness || "Failed to delete business.");
                }
                else {
                    return toast.error(response?.detail);
                }

            } catch (error: any) {
                console.error(error);
                toast.error(t.errorOnDelete || "There was an error deleting.");
            }
        }
    }

    const handleStatusChange = (collaborator: ICollaborator) => {

    };

    useEffect(() => {
        if (successupdate || successcreate) {
            const timer = setTimeout(() => {
                setSuccessUpdate(false);
                setSuccessCreate(false);
            }, 3000); // Reset after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [successupdate, successcreate]);


    async function PasswordHandler(user: IUser) {
        setLoadPassword(true);
        try {
            const response = await postChangePassword(
                {
                    old_password: user.currentPassword,
                    new_password: user.newPassword,
                    confirm_password: user.confirmPassword
                },
                userInfoCookie?.access_token ?? ''
            );
            if (response?.error === "Old password is incorrect.") {
                return toast.error(t.oldPasswordIncorrect || "Old password is incorrect.")
            }
            else if (response?.error === false) {
                setErrorMessage(""); // Clear any previous errors
                setSuccessUpdate(true);
                toast.success(t.passwordUpdatedSuccess || "Password updated successfully!");
            } else {
                toast.error(t.somethingWentWrong || "Something went wrong, please try again.");
            }
        } catch (error) {
            setErrorMessage(getError(error));
            console.log(getError(error));
        } finally {
            setLoadPassword(false);
        }
    }

    async function CreateCollaboratorHandler(user: IUser) {
        setLoadCollaborator(true);
        try {
            // Collect form data
            const collaboratorData = {
                email: user?.email,
                password: user?.password,
                role: user?.role,
                business_ids: user?.business_ids,
                is_active: user?.is_active
            };
            const response = await postCollaborator(collaboratorData, userInfoCookie?.access_token ?? '');
            if (response?.email[0] === "user with this email already exists.") {
                return toast.error("User with this email already exists.");
            }
            if (response?.error) {
                return toast.error(response?.error);
            }
            if (response?.role) {
                setSuccessCreate(true);
                toast.success("Collaborator created successfully!");
            }
        } catch (error: any) {
            setErrorMessage2(error.message || "An unexpected error occurred.");
            toast.error("Error creating collaborator.");
        } finally {
            setLoadCollaborator(false);
        }
    }

    const handleAddCompany = () => {
        router.push('/businessSpace/addbusiness');
    }

    // Fonction pour gérer le changement de hiddenEval
    async function handleToggleHiddenEvalParent(id: string, checked: boolean) {
        setHiddenEval((prev) => ({ ...prev, [id]: checked }));
        try {
            const response = await updateBusiness({ showeval: !hiddenEval[id] }, id, userInfoCookie?.access_token ?? '');
            if (response?.message === "Business updated successfully!") {
                return toast.success(t.operationSuccess || "Operation success!");
            }
            else if (response?.message === "Failed to update business.") {
                return toast.error(t.operationFailed || "Operation failed.");
            }
            else {
                return toast.error(response?.detail);

            }
        } catch (error) {
            console.error(error);
            toast.error(t.annErrorDuringOperation || "An error has occurred during operation.");
        }
    };

    // Fonction pour gérer le changement de hiddenReview
    async function handleToggleHiddenReviewParent(id: string, checked: boolean) {
        setHiddenReview((prev) => ({ ...prev, [id]: checked }));
        try {
            const response = await updateBusiness({ showreview: !hiddenReview[id] }, id, userInfoCookie?.access_token ?? '');
            if (response?.message === "Business updated successfully!") {
                return toast.success(t.operationSuccess || "Operation success!");
            }
            else if (response?.message === "Failed to update business.") {
                return toast.error(t.operationFailed || "Operation failed.");
            }
            else {
                return toast.error(response?.detail);

            }
        } catch (error: any) {
            console.error(error);
            toast.error(t.annErrorDuringOperation || "An error has occurred during operation.");
        }
    };

    if (isLoadingLanguage || userbusinesses.length === 0 || userBusinesses === null || isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">{t.loading}...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
                <h1 className="text-xl font-bold text-center md:text-left">{t.businessProfile || "Business Profile"}</h1>
            </header>

            {/* Main Content */}
            <main className="flex-grow grid grid-cols-1 gap-4 mb-4 mt-2 md:grid-cols-3 w-full">
                {/* Section 1 */}
                <section className="bg-white rounded-lg shadow-md p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
                    <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-blue-400">{t.profile || "Profile"}</h2>
                    <div className="space-y-4">
                        <p><strong>Email :</strong> {userInfo.email || ""}</p>
                        <p><strong>{t.role || "Role"} :</strong> {capitalizeWords(userInfo.role || "")}</p>
                        <EnteringBoxNewPassword
                            submitHandler={PasswordHandler}
                            errorMessage={errorMessage}
                            loading={loadpassword}
                            update={successupdate}
                        />
                    </div>
                </section>

                {/* Section 2 */}
                <BusinessCollaboratorListSection
                    userBusinesses={userBusinesses ?? []}
                    handleAddCompany={handleAddCompany}
                    handleCompanyClick={handleCompanyClick}
                    handleDeleteCompany={handleDeleteCompany}
                    hiddenEval={hiddenEval}
                    hiddenReview={hiddenReview}
                    handleToggleHiddenEval={handleToggleHiddenEvalParent}
                    handleToggleHiddenReview={handleToggleHiddenReviewParent}
                />
                {/* Section 3 */}
                {userInfo.role === "manager" ? (
                    <section className="bg-white rounded-lg shadow-md p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
                        <EnteringBoxCollaborator
                            submitHandler={CreateCollaboratorHandler}
                            errorMessage={errorMessage2}
                            loading={loadcollaborator}
                            userroles={roles}
                            create={successcreate}
                            userbusinesses={userBusinesses ?? []}
                        />
                    </section>
                ) : (
                    <section className="bg-white rounded-lg shadow-md p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
                        <EnteringBoxCheckCode />
                    </section>
                )}
            </main>

            {/* Collaborator Table */}
            <section className="bg-white rounded-lg shadow-md p-4">
                <CollaboratorsTable
                    collaborators={collaboratorsamebusiness}
                    onStatusChange={handleStatusChange}
                    adminbusinesses={userbusinesses}
                    access_token={userInfoCookie?.access_token ?? ''}
                />
            </section>

            {/* Responsive Admin Section */}
            {userInfo.role === "manager" && (
                <section className="mt-4 w-full md:w-1/3 bg-white rounded-lg shadow-md p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
                    <EnteringBoxCheckCode />
                </section>
            )}
        </div>

    );
};


export default Profile;

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
        let collaboratorsamebusiness = await getCollaboratorSameBusiness({}, access_token);
        return {
            props: {
                userbusinesses: userbusinesses || [],
                collaboratorsamebusiness: collaboratorsamebusiness || [],
                userInfo
            },
        };
    } catch (error: any) {
        console.error("Error in getServerSideProps:", error.message);
        return {
            props: {
                userbusinesses: [],
                collaboratorsamebusiness: [],
            },
        };
    }
};

