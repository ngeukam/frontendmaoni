import React, { useEffect, useRef, useState } from "react";
import Input, { IImperativeHandler } from "../UI/Input";
import { toast } from "react-toastify";
import { useLanguage } from "../../hooks/useLanguage";
import CityAutocomplete from "./CityAutocomplete";
import BusinessNameAutocomplete from "./BusinessNameAutocomplete";
import africanCountries from "../../utilities/countries";
import CategoriesDropDown from "../UI/CategoriesDropDown";
import CountriesDropDown from "../UI/CountriesDropDown";
import { IBusiness } from "../../lib/types/business";
import GoBackButton from "../UI/GoBackButton";
import Image from "next/image";

interface Props {
    submitHandler: (business: IBusiness) => void;
    errorMessage: string;
    loading: boolean;
    create: boolean;
    businesstypes: { id: string, name: string }[];
    buscategories: { name: string; id: string }[];
}

const EnteringBoxAddBusiness: React.FC<Props> = ({
    submitHandler,
    errorMessage,
    loading,
    create,
    businesstypes,
    buscategories
}) => {
    const { t } = useLanguage();
    const emailRef = useRef<IImperativeHandler | null>(null);
    const phoneRef = useRef<IImperativeHandler | null>(null);
    const logoRef = useRef<HTMLInputElement | null>(null);
    const websiteRef = useRef<IImperativeHandler | null>(null);
    const cityRef = useRef<HTMLInputElement | null>(null);

    const [inputBusinessName, setInputBusinessName] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(
        null
    );
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [isWebsiteValid, setIsWebsiteValid] = useState(false);


    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
    const [isLogoValid, setIsLogoValid] = useState<boolean>(false);
    const [description, setDescription] = useState("");
    const [selectedBusinessType, setSelectedBusType] = useState<{ id: string, name: string } | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);


    const handleCitySelect = (city: string) => {
        if (cityRef.current) {
            cityRef.current.value = city;
        }
    };
    const handleBusinessNameSelect = (name: string) => {
        setInputBusinessName(name);
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const MAX_FILE_SIZE = 70 * 1024; // 70 KB

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                console.error("File size exceeds the 70 KB limit.");
                toast.error(t.fileExceeds70KB || "File size exceeds the 70 KB limit.")
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

        const email = emailRef.current?.getValue();
        const phone = phoneRef.current?.getValue();
        const busdescription = description;
        const btype = selectedBusinessType?.name;
        const name = inputBusinessName.trim();
        const category_id = selectedCategory?.id;
        const country = selectedCountry;
        const city = cityRef.current?.value;
        const website = websiteRef.current?.getValue();

        if (!inputBusinessName || !selectedCategory || !selectedCountry || !cityRef.current?.value || !busdescription || !btype) {
            return toast.error(t.requiredFieldsError);
        }

        // Créez un FormData pour les fichiers
        const formData = new FormData();
        if (logoRef.current?.files?.[0]) {
            formData.append('logo', logoRef.current.files[0]);
        }

        // Créez un objet IBusiness pour transmettre les autres données
        const business: IBusiness = {
            name,
            category_id,
            country,
            city,
            website,
            isverified: true,
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
        if (create) {
            emailRef.current?.clear();
            phoneRef.current?.clear();
            websiteRef.current?.clear()
            setDescription("");
            setSelectedBusType({ name: "", id: "" });
            setLogoUrl("");
            if (logoRef.current) {
                logoRef.current.value = ""; // Réinitialise le champ fichier
            }
            setInputBusinessName("");
            setSelectedCategory({
                name: "",
                id: ""
            });
            setSelectedCountry("");
            if (cityRef.current) {
                cityRef.current.value = "";
            }
        }
    }, [create]);

    return (
        <div>
            <GoBackButton />

            <form onSubmit={handleSubmit} className="dark:bg-gray-800 bg-white p-4 border rounded-lg space-y-6 max-w-lg mx-auto sm:px-6 lg:px-8">
                <h2 className="text-lg md:text-2xl font-bold mb-4">{t.addBusiness}</h2>
                <BusinessNameAutocomplete
                    onSelect={handleBusinessNameSelect}
                    id="businessName"
                    required={true}
                    placeholder="enterBusinessName"
                />
                <CategoriesDropDown
                    title="selectBusinessCategory"
                    data={buscategories}
                    required={true}
                    placeholder="enterBusinessCategory"
                    onChange={(category) => setSelectedCategory(category)}
                />
                <CountriesDropDown
                    title="selectBusinessCountry"
                    data={africanCountries.map((c) => c.name)}
                    required={true}
                    placeholder="enterBusinessCountry"
                    onChange={(country) => {
                        const countryCode = africanCountries.find(
                            (c) => c.name === country
                        )?.code;
                        setSelectedCountry(countryCode || null);
                    }}
                />
                <CityAutocomplete
                    onCitySelect={handleCitySelect}
                    selectedCountry={selectedCountry}
                    id="selectBusinessCity"
                    type="text"
                    placeholder="enterbusinessCityName"
                    required={true}
                    readonly={selectedCountry ? false : true}
                />
                <input type="text" ref={cityRef} hidden />
                <Input
                    ref={websiteRef}
                    type="text"
                    id="businessWebsite"
                    placeholder="enterBusinessWebsite"
                    required={false}
                    onValidate={setIsWebsiteValid}
                    validateWebsite={true}
                />
                <textarea
                    value={description}
                    maxLength={999}
                    onChange={handleTextAreaChange}
                    placeholder={t.describe_your_business || "Describe your business"}
                    className="review-textarea w-full py-4 px-6 border-[1px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />

                <Input
                    ref={emailRef}
                    type="email"
                    id="email"
                    placeholder="enterBusinessEmail"
                    onValidate={setIsEmailValid}
                    validateEmail={true}
                    required

                />

                <Input
                    ref={phoneRef}
                    id="phone"
                    type="text"
                    placeholder="enterBusinessPhone"
                    onValidate={setIsPhoneValid}
                    validatePhone={true}
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

                    {logoUrl && <div className="mt-2 relative">
                        <Image
                            src={`${logoUrl}`}
                            alt={t.BusinessLogo || "Business Logo"}
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
                    }
                </div>

                {errorMessage && <span className="text-rose-600">{errorMessage}</span>}

                <button
                    type="submit"
                    disabled={loading || !isEmailValid || !isPhoneValid || (websiteRef.current?.value === "" && !isWebsiteValid)}
                    className="w-full py-2 bg-palette-primary text-white rounded-lg focus:outline-none disabled:bg-red-300"
                >
                    {loading ? t["loading"] : t["save"]}
                </button>
            </form>
        </div>
    );
};

export default EnteringBoxAddBusiness;
