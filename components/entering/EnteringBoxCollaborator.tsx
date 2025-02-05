import React, { useEffect, useRef, useState } from "react";
import Input, { IImperativeHandler } from "../UI/Input";
import { useLanguage } from "../../hooks/useLanguage";
import { toast } from "react-toastify";
import { IUser } from "../../lib/types/user";
import BusinessesDropDown from "../UI/BusinessesDropDown";
import CategoriesDropDown from "../UI/CategoriesDropDown";
import { IBusiness } from "../../lib/types/business";

interface Props {
    submitHandler: (user: IUser) => void;
    errorMessage: string;
    userroles: { id: string, name: string }[];
    loading: boolean;
    create: boolean;
    userbusinesses: { id: string; name: string; city: string; countrynamecode: string; }[];
}

const EnteringBoxCollaborator: React.FC<Props> = ({
    submitHandler,
    errorMessage,
    userroles,
    loading,
    create,
    userbusinesses
}) => {
    const { t } = useLanguage();
    const emailRef = useRef<IImperativeHandler | null>(null);
    const passwordRef = useRef<IImperativeHandler | null>(null);
    const [selectedBusinesses, setSelectedBusinesses] = useState<IBusiness[]>([]);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<{ name: string } | null>(null)
    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const role = selectedRole?.name;
        // const is_active = selectedRole?.name === "manager" ? false : true
        const is_active=false;
        const business_ids = selectedBusinesses
            .map((business) => business.id)
            .filter((id): id is string => id !== undefined); // This filters out undefined values

        // Validate the data before calling the handler
        if (isEmailValid && isPasswordValid && selectedRole && selectedBusinesses.length > 0) {
            const user: IUser = {
                email,
                password,
                role,
                business_ids,
                is_active
            };
            submitHandler(user);
        } else {
            toast.error(t.requiredFieldsError || "Please fill all required fields correctly.");
        }
    };

    useEffect(() => {
        if (create) {
            setSelectedBusinesses([]);
            setSelectedRole(null);
            emailRef.current?.clear();
            passwordRef.current?.clear();
        }
    }, [create]);

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4 dark:text-blue-400">{t.createCollaorator || "Create Collaborator account"}</h2>
            <form onSubmit={onSubmitHandler}>
                <div className="mt-6">
                    {/* Use the BusinessNameAutocomplete component */}
                    <BusinessesDropDown
                        title="selectCollaboratorBusiness"
                        data={userbusinesses}
                        required={true}
                        placeholder="enterCollaboratorBusiness"
                        onChange={(selected) => setSelectedBusinesses(selected)} // Update the state
                    />
                    <Input
                        ref={emailRef}
                        type="email"
                        id="email"
                        placeholder="enterEmailCollaborator"
                        onValidate={setIsEmailValid}
                        validateEmail
                        validationType="email"
                        required
                    />
                    <Input
                        ref={passwordRef}
                        type="password"
                        id="password"
                        placeholder="enterPasswordCollaborator"
                        onValidate={setIsPasswordValid}
                        validatePassword={true}
                        validationType="password"
                        required
                    />
                    <CategoriesDropDown
                        title="selectCollaboratorRole"
                        data={userroles}
                        required={true}
                        placeholder="enterCollaboratorRole"
                        onChange={(role) => setSelectedRole(role)}
                    />
                </div>
                {errorMessage && <span className="text-rose-600">{errorMessage}</span>}

                <button
                    type="submit"
                    disabled={loading || !isEmailValid || !isPasswordValid}
                    className="bg-palette-primary w-full py-4 rounded-lg text-palette-side text-xl shadow-lg flex items-center justify-center disabled:bg-red-300"
                >
                    {loading ? (
                        // Spinner

                        <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                    ) : (
                        t["save"] // Button text when not loading
                    )}
                </button>
            </form>
        </div>
    );
};

export default EnteringBoxCollaborator;
