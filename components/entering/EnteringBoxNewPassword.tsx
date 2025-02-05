import React, { useEffect, useRef, useState } from "react";
import Input, { IImperativeHandler } from "../UI/Input";
import { useLanguage } from "../../hooks/useLanguage";
import { toast } from "react-toastify";
import { IUser } from "../../lib/types/user";

interface Props {
    submitHandler: (user: IUser) => void;
    errorMessage: string;
    loading: boolean;
    update: boolean;
}

const EnteringBoxNewPassword: React.FC<Props> = ({
    submitHandler,
    errorMessage,
    loading,
    update,
}) => {
    const { t } = useLanguage();
    const currentPasswordRef = useRef<IImperativeHandler | null>(null);
    const newPasswordRef = useRef<IImperativeHandler | null>(null);
    const confirmPasswordRef = useRef<IImperativeHandler | null>(null);

    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean>(false);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean>(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean>(false);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentPassword = currentPasswordRef.current?.getValue();
        const newPassword = newPasswordRef.current?.getValue();
        const confirmPassword = confirmPasswordRef.current?.getValue();

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error(t.requiredFieldsError);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(t.password_do_not_match || "Password do not match");
            return;
        }

        // Create user object and pass to submitHandler
        const user: IUser = {
            currentPassword,
            newPassword,
            confirmPassword
        };

        submitHandler(user);

    };

    useEffect(() => {
        if (update) {
            currentPasswordRef.current?.clear();
            newPasswordRef.current?.clear();
            confirmPasswordRef.current?.clear();
        }
    }, [update]);

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-blue-400">{t.updatePassword || "Update Password"}</h3>
            <form onSubmit={onSubmitHandler}>
                <div className="mt-6">
                    <Input
                        ref={currentPasswordRef}
                        type="password"
                        id="currentpassword"
                        placeholder="enterYourCurrentPassword"
                        onValidate={setIsCurrentPasswordValid}
                        validatePassword={false}
                        required
                    />
                    <Input
                        ref={newPasswordRef}
                        type="password"
                        id="newpassword"
                        placeholder="enterYourNewPassword"
                        onValidate={setIsNewPasswordValid}
                        validatePassword={true}
                        validationType="password"
                        required
                    />
                    <Input
                        ref={confirmPasswordRef}
                        type="password"
                        id="confirmpassword"
                        placeholder="confirmYourNewPassword"
                        onValidate={setIsConfirmPasswordValid}
                        validatePassword={false}
                         validationType="password"
                        required
                    />
                </div>
                {errorMessage && <span className="text-rose-600">{errorMessage}</span>}

                <button
                    type="submit"
                    disabled={loading || !isConfirmPasswordValid || !isCurrentPasswordValid || !isNewPasswordValid}
                    className="bg-palette-primary w-full py-4 rounded-lg text-palette-side text-xl shadow-lg flex items-center justify-center disabled:bg-red-300"
                >
                    {loading ? (
                        // Spinner
                        <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                    ) : (
                        t.update || "Update" // Button text when not loading
                    )}
                </button>
            </form>
        </div>
    );
};

export default EnteringBoxNewPassword;
