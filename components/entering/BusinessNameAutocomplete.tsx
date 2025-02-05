import React, { useEffect, useState, forwardRef } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { getBusinessName } from "../../lib/types/helpers/backendHelpers";

interface Props {
    id: string;
    onSelect: (name: string, id: string) => void;
    placeholder?: string;
    required?: boolean;
}

const BusinessNameAutocomplete = forwardRef<HTMLInputElement, Props>(
    ({ onSelect, id, placeholder, required = false }: Props, ref) => {
        const [businessNames, setBusinessNames] = useState<{ id: string, name: string, city: string, countrynamecode: string }[]>([]);
        const [searchQuery, setSearchQuery] = useState<string>("");
        const [businessId, setBusinessId] = useState<string>("");
        const [loading, setLoading] = useState<boolean>(false);
        const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);
        const { t } = useLanguage();

        // Handle input change
        const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setBusinessId(e.target.value);
            setIsDropdownOpen(true);
        };

        // Debounced API call with setTimeout
        useEffect(() => {
            const debounceTimeout = setTimeout(() => {
                if (searchQuery.length >= 2) { // Trigger API call only for 2 or more characters
                    const fetchBusinessName = async () => {
                        setLoading(true);
                        setError(null); // Reset error on new search
                        try {
                            const { results } = await getBusinessName({ name: searchQuery, page_size: 10 });
                            setBusinessNames(results || []); // Handle results array
                        } catch (error) {
                            console.error("Error fetching business names:", error);
                            setError(t.errorFetchingBusinesses || 'An error occurred while fetching businesses.');
                        } finally {
                            setLoading(false);
                        }
                    };

                    fetchBusinessName();
                } else {
                    setBusinessNames([]);
                    setIsDropdownOpen(false); // Close dropdown if search query is empty or too short
                }
            }, 300); // Debounce time in milliseconds

            return () => clearTimeout(debounceTimeout); // Cleanup on searchQuery change
        }, [searchQuery, t]); // Dependencies

        // Handle selection of a business name
        const handleBusinessNameSelect = (name: string, id: string) => {
            setSearchQuery(name); // Set the selected name as the input value
            setBusinessId(id);
            setBusinessNames([]); // Clear the dropdown
            onSelect(name, id); // Notify the parent component
            setIsDropdownOpen(false);
        };

        const handleCustomBusinessName = () => {
            if (searchQuery.trim()) {
                onSelect(searchQuery, businessId); // Send the custom name to the parent component
                setBusinessNames([]); // Clear the business names to close the list
                setIsDropdownOpen(false);
            }
        };

        return (
            <div className="relative mb-8">
                <label
                    className="absolute -top-[30%] ltr:left-3 rtl:right-3 bg-palette-card p-[0.3rem] whitespace-nowrap dark:bg-gray-800 dark:text-white"
                    htmlFor={id}
                >
                    {required && <span className="text-rose-700 mx-1 mt-1">*</span>}
                    {t[`${id}`]}
                </label>
                <input
                    id={id}
                    ref={ref}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={t[`${placeholder}`]}
                    required={required}
                    className="w-full py-4 px-6 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md dark:bg-palette-card dark:text-white dark:border-slate-200"
                />
                {loading && <div className="absolute left-0 right-0 mt-2 text-center overflow-auto z-10 text-white">Loading...</div>}
                {/* {error && <div className="absolute left-0 right-0 mt-2 text-center overflow-auto z-10 text-red-500">{error}</div>} */}
                {businessNames.length > 0 && (
                    <div className="absolute left-0 right-0 bg-white border mt-2 max-h-60 overflow-auto z-10 dark:bg-gray-700 dark:border-slate-600 dark:text-white">
                        {businessNames.map((business) => (
                            <div
                                key={business.id}
                                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                                onClick={() => handleBusinessNameSelect(business.name, business.id)}
                            >
                                {business.name.toLocaleUpperCase()} • {business.city} • {business.countrynamecode}
                            </div>
                        ))}
                        <p className="text-sm text-palette-primary mb-2 m-2">{t.noneedToCreate || "No need to create if it exists"}</p>
                    </div>
                )}
                {/* Display an option for the user to enter their custom business name */}
                {isDropdownOpen && businessNames.length === 0 && searchQuery.length >= 3 && (
                    <div
                        className="absolute left-0 right-0 bg-white border mt-2 max-h-60 overflow-auto z-10 p-2 cursor-pointer dark:bg-gray-700 dark:border-slate-600 dark:text-white"
                        onClick={handleCustomBusinessName}
                    >
                        <span className="text-blue-600 dark:text-white">
                            {`${t.nobusinessfoundAdd || "No business found, click to add"} " ${searchQuery}"`}
                        </span>
                    </div>
                )}
            </div>
        );
    });

BusinessNameAutocomplete.displayName = "BusinessNameAutocomplete"; 
export default BusinessNameAutocomplete;
