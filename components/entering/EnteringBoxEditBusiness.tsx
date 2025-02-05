import React, { useEffect, useRef, useState } from "react";
import Input, { IImperativeHandler } from "../UI/Input";
import { IBusiness } from "../../lib/types/business";
import { toast } from "react-toastify";
import { useLanguage } from "../../hooks/useLanguage";
import GoBackButton from "../UI/GoBackButton";
import CategoriesDropDown from "../UI/CategoriesDropDown";
import Image from "next/image";

interface Props {
    submitHandler: (business: IBusiness) => void;
    errorMessage: string;
    loading: boolean;
    edit: boolean;
    businesstypes: { id: string, name: string }[];
    businessData: IBusiness;
    title: string;
}

const EnteringBoxEditBusiness: React.FC<Props> = ({
    submitHandler,
    errorMessage,
    loading,
    edit,
    businesstypes,
    businessData,
    title
}) => {
    const { t } = useLanguage();
    const emailRef = useRef<IImperativeHandler | null>(null);
    const phoneRef = useRef<IImperativeHandler | null>(null);
    const logoRef = useRef<HTMLInputElement>(null);

    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
    const [isLogoValid, setIsLogoValid] = useState<boolean>(false);

    const [description, setDescription] = useState("");
    const [selectedBusinessType, setSelectedBusType] = useState<{ id: string, name: string } | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const MAX_FILE_SIZE = 70 * 1024; // 70 KB

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                console.error("File size exceeds the 70 KB limit.");
                toast.error("File size exceeds the 70 KB limit.")
                setIsLogoValid(false);
                return; // Exit the function if file size is too large
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoUrl(reader.result as string);
                setIsLogoValid(true);
            };
            reader.readAsDataURL(file);
        }
    };
    useEffect(() => {
        if (businessData) {
            // Pré-remplir les champs contrôlés
            setDescription(businessData.description || ""); // Description de l'entreprise
            setSelectedBusType(businesstypes.find(btype => btype.name === businessData.btype) || null);
            setLogoUrl(businessData.logo as string); // URL ou donnée base64 de l'image
            emailRef.current?.setValue(businessData.email ?? "");
            phoneRef.current?.setValue(businessData.phone ?? "");
        }
    }, [businessData, businesstypes]);

    useEffect(() => {
        setLogoUrl(null);
    }, []);

    const handleDeleteLogo = () => {
        setLogoUrl(null); // Remove the logo
        setIsLogoValid(false); // Optionally reset the validity state
        if (logoRef.current) {
            logoRef.current.value = ""; // Réinitialise le champ fichier
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const email = emailRef.current?.value;
        const phone = phoneRef.current?.value;
        const busdescription = description;
        const btype = selectedBusinessType?.name;

        if (busdescription === "") {
            return toast.error("Business description is required!")
        }
        if (btype === "") {
            return toast.error("Type of business is required!")
        }
        // Créez un FormData pour les fichiers
        const formData = new FormData();
        if (logoRef.current?.files?.[0]) {
            formData.append('logo', logoRef.current.files[0]);
        }

        // Créez un objet IBusiness pour transmettre les autres données
        const business: IBusiness = {
            email,
            phone,
            description: busdescription,
            logo: formData.get('logo') as File, // Assurez-vous que `logo` est bien un fichier
            btype,
        };

        // Soumettre l'objet business
        submitHandler(business);
    };


    useEffect(() => {
        if (edit) {
            setDescription("");
            setSelectedBusType({ name: "", id: "" });
            setLogoUrl("");
            if (logoRef.current) {
                logoRef.current.value = ""; // Réinitialise le champ fichier
            }
            emailRef.current?.clear();
            phoneRef.current?.clear();

        }
    }, [edit]);

    return (
        <div>
            <GoBackButton />
            <div className="flex flex-col items-center justify-center mt-2">
                <div className="w-full md:w-[50%] max-w-[500px] border-2 bg-palette-card shadow-lg py-4 px-8 rounded-lg">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-lg md:text-2xl font-bold mb-6">{t.businessEdit || "Business Edit"}</h2>

                        <Input
                            key={businessData.email}
                            ref={emailRef}
                            type="email"
                            id="email"
                            placeholder="enterBusinessEmail"
                            onValidate={setIsEmailValid}
                            validateEmail
                            validationType="email"
                            required
                        />

                        <Input
                            key={businessData.phone}
                            ref={phoneRef}
                            id="phone"
                            type="text"
                            placeholder="enterBusinessPhone"
                            onValidate={setIsPhoneValid}
                            validatePhone
                            validationType="phone"
                            required
                        />

                        <CategoriesDropDown
                            title="selectTypeOfBusiness"
                            data={businesstypes}
                            required={true}
                            defaultValue={selectedBusinessType || { id: "", name: "" }}
                            placeholder="selectTypeOfBusiness"
                            onChange={(btype) => setSelectedBusType(btype)}
                        />
                        <textarea
                            value={description}
                            maxLength={999}
                            onChange={handleTextAreaChange}
                            placeholder={t["describe_your_business"]}
                            className="review-textarea w-full py-4 px-6 border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            rows={10}
                        />
                        <div className="logo-upload-field mt-4">
                            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t["uploadLogo"]}</label>
                            <input
                                type="file"
                                id="logo"
                                ref={logoRef}
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="mt-2 p-2 block w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                            // required
                            />

                            <div className="mt-2 relative">
                                <Image
                                    src={logoUrl || (businessData.logo ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${businessData.logo}` : "")}
                                    alt="Business Logo"
                                    className="w-32 h-32 object-cover"
                                />
                                {/* Cross icon */}
                                <button
                                    type="button"
                                    onClick={handleDeleteLogo}
                                    className="absolute top-0 right-0 text-rose-600 text-xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {errorMessage && <span className="text-rose-600">{errorMessage}</span>}

                        <button
                            type="submit"
                            disabled={loading || !isEmailValid || !isPhoneValid}
                            className="w-full py-2 mt-2 bg-palette-primary text-white rounded-lg focus:outline-none disabled:bg-red-300"
                        >
                            {loading ? t["loading"] : t["save"]}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EnteringBoxEditBusiness;
