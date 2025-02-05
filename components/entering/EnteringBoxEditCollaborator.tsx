import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { toast } from "react-toastify";
import BusinessesDropDown from "../UI/BusinessesDropDown";
import { updateCollaboratorBusiness } from "../../lib/types/helpers/backendHelpers";
import { IBusiness } from "../../lib/types/business";

interface EnteringBoxProps {
    userbusinesses: { id: string; name: string; city: string; countrynamecode: string; }[];
    user_id: string;
    token: string;
    selectedemail:string
}

const EnteringBoxEditCollaborator: React.FC<EnteringBoxProps> = ({
    userbusinesses,
    user_id,
    token,
    selectedemail
}) => {
    const { t } = useLanguage();
    const [selectedBusinesses, setSelectedBusinesses] = useState<IBusiness[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (selectedBusinesses.length === 0) {
                return toast.error(t["requiredFieldsError"]);
            }

            // Assuming submitHandler needs the selected business as part of the user
            const business_ids = selectedBusinesses
                .map((business) => business.id)
                .filter((id): id is string => id !== undefined); // This filters out undefined values

            const response = await updateCollaboratorBusiness(
                {
                    business_ids: business_ids,
                }, user_id, token);
            if (response?.detail) {
                return toast.error(response?.detail);
            }
            if (response[0]?.business) {
                return toast.success(`Good, ${selectedemail} have new affected business!`);
            }
        } catch (error) {
            console.log(error)
            setErrorMessage("Something went wrong, please try again.");
            toast.error("Error creating collaborator.");
        } finally {
            setLoading(false)
        }

    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full border-2 bg-palette-card shadow-lg py-4 px-8 rounded-lg dark:border-slate-200 dark:bg-palette-card dark:text-white">
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <BusinessesDropDown
                            title="selectCollaboratorBusiness"
                            data={userbusinesses}
                            required={true}
                            placeholder="enterCollaboratorBusiness"
                            onChange={(selected) => setSelectedBusinesses(selected)} // Update the state
                        />
                    </div>
                    {errorMessage && <span className="text-rose-600">{errorMessage}</span>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-palette-primary w-full mt-4 py-4 rounded-lg text-palette-side text-xl shadow-lg flex items-center justify-center disabled:bg-red-300"
                    >
                        {loading ? (
                            <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                        ) : (
                            t.update
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnteringBoxEditCollaborator;
