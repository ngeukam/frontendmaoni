import React, { useRef, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { toast } from "react-toastify";
import Input, { IImperativeHandler } from "../UI/Input";
import { checkCodeStatus } from "../../lib/types/helpers/backendHelpers";

interface Props {

}

const EnteringBoxEditCollaborator: React.FC<Props> = () => {
    const { t } = useLanguage();
    const codeRef = useRef<IImperativeHandler | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValidCode, setIsValidCode] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const code = codeRef.current?.getValue()?.trim()?.toUpperCase(); // Nettoyage et mise en majuscule
        if (!code) {
            toast.error(t.code_is_required || "Invitation code is required!");
            return;
        }

        setLoading(true);

        try {
            const response = await checkCodeStatus({}, code);

            if (response?.detail === "Code not found.") {
                toast.error(t.codeNotFound || "Code not found");
                return;
            }

            if (!response?.is_active) {
                toast.warning(t.alreadyUse || "Already in use!");
            } else {
                toast.info(t.notYetUsed || "Not yet used!");
            }
        } catch (error) {
            console.error("Error checking code:", error);
            setErrorMessage(t.somethingWentWrong || "Something went wrong, please try again.");
            toast.error(t.errorCheckingCode || "Error checking code.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-md p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
            <h2 className="text-lg font-bold mb-4 dark:text-blue-400">{t.checkInvitationCode || "Check invitation code status"}</h2>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <Input
                            ref={codeRef}
                            type="text"
                            id="code"
                            placeholder="invitationCode"
                            required={true}
                            onValidate={setIsValidCode}
                            validateCode={true}
                            validationType="code"
                        />
                    </div>
                    {errorMessage && <span className="text-rose-600">{errorMessage}</span>}
                    <button
                        type="submit"
                        disabled={loading || !isValidCode}
                        className="bg-palette-primary w-full mt-4 py-4 rounded-lg text-palette-side text-xl shadow-lg flex items-center justify-center disabled:bg-red-300"
                    >
                        {loading ? (
                            <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                        ) : (
                            t["check"]
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnteringBoxEditCollaborator;
