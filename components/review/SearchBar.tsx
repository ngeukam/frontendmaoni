import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import { useLanguage } from '../../hooks/useLanguage';
import { useRouter } from 'next/router';
import { camelToKebab, camelToKebab2 } from '../../utilities/camel';
import { getBusinessReviewByName } from '../../lib/types/helpers/backendHelpers';
import { getStarColor } from '../../utilities/getStarColor';
import Image from 'next/image';

type SearchBarProps = {
    onAddCompany: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onAddCompany }) => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [companies, setCompanies] = useState<{ id: string, category: { name: string }, name: string, website: string, countrynamecode: string, country: string, city: string, logo: string, total_reviews: number, total_evaluation: number, has_reviews: boolean, showeval: boolean }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isBusinessSpace = router.pathname === "/businessSpace";

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            if (searchQuery.length >= 1) {
                const fetchBusinessReviewByName = async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        const response = await getBusinessReviewByName({ businessname: searchQuery, page_size: 5 });
                        setCompanies(response.results || []);
                    } catch (error) {
                        console.error("Error fetching business names:", error);
                        setError(t.errorFetchingBusinesses || 'An error occurred while fetching businesses.');
                    } finally {
                        setLoading(false);
                    }
                };

                fetchBusinessReviewByName();
            } else {
                setCompanies([]);
            }
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, t.errorFetchingBusinesses]);

    const filteredCompanies = companies?.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.website.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setSelectedCompany(null);
    };

    const handleCompanySelect = (businesscategory: string, country: string, city: string, business: string, id: string) => {
        setSearchQuery(business);
        setSelectedCompany(business);
        const encodedBusiness = business.replace(/\s+/g, '-');
        if (isBusinessSpace) {
            return router.push(`/${camelToKebab(businesscategory)}/${country.toLowerCase()}/${encodeURIComponent(city).toLowerCase()}/${encodedBusiness}/`);
        }
        else {
            return router.push(`/${camelToKebab(businesscategory)}/${country.toLowerCase()}/${encodeURIComponent(city).toLowerCase()}/${encodedBusiness}/evaluation`);

        }

    };

    return (
        <div className="relative w-full md:w-1/2 md:mt-8 mx-auto mt-8 max-w-[800px]">
            <div className="flex items-center border-2 border-gray-300 bg-white outline-none w-full max-w-[800px] px-4 py-3 shadow-md rounded-lg lg:mx-auto lg:h-auto dark:bg-slate-800">
                <AiOutlineSearch className="text-blue-500 transition duration-300 hover:scale-110 hover:text-blue-700 drop-shadow-sm" style={{ fontSize: '3rem' }} />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={isBusinessSpace ? `${t.searchYourBusiness || "Find Business to Evaluate"}` : `${t.find_a_business_to_evaluate || "Find Business to Evaluate"}`} 
                    className="py-2 bg-transparent outline-none w-full text-gray-800 dark:text-white placeholder:text-xs md:placeholder:text-xl placeholder:text-blue-500 focus:placeholder-scale-90 focus:placeholder:text-blue-700"
                    style={{
                        transition: 'all 0.3s ease',
                        fontSize: '1rem',
                    }}
                />
            </div>


            {loading && (
                <div className="absolute bg-white shadow-lg p-4 text-center w-full z-50">
                    <p className="text-gray-500">{t.loading}...</p>
                </div>
            )}
            {error && (
                <div className="absolute bg-white shadow-lg p-4 text-center w-full z-50">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {searchQuery && filteredCompanies.length > 0 && (
                <ul className="absolute bg-white shadow-lg max-h-screen md:max-h-96 overflow-y-auto w-full text-left z-50 rounded-md"> {/* Rounded corners */}
                    {filteredCompanies.map((company, index) => (
                        <li
                            key={index}
                            onClick={() => handleCompanySelect(company.category.name, company.country, company.city, company.name, company.id)}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-200 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border-b border-gray-200 last:border-b-0" // Added border, flex-col for mobile, flex-row for desktop
                        >
                            <div className="flex items-center justify-center md:w-12 md:h-12"> {/* Increased size for mobile */}
                                {company.logo ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${company.logo}`}
                                        alt="businesslogo"
                                        width={50}
                                        height={50}
                                        className="w-full h-full rounded-full object-cover" // Make image fill container
                                    />
                                ) : (
                                    <Image
                                        src="/images/default-business.webp"
                                        alt="businesslogo"
                                        width={40}
                                        height={40}
                                        className="w-full h-full rounded-full object-cover" // Make image fill container
                                    />
                                )}
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="font-semibold text-gray-800 truncate text-lg md:text-base"> {/* Increased font size for mobile */}
                                    {company.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {company.city} • {company.countrynamecode} • {t[company.category.name]}
                                </div>
                            </div>

                            {(company.has_reviews && company.showeval) && (
                                <div className="flex items-center space-x-2 mt-2 md:mt-0"> {/* Added margin-top for mobile */}
                                    <div
                                        className="rounded px-2 text-white text-xm"
                                        style={{ backgroundColor: getStarColor(company.total_evaluation) }}
                                    >
                                        {company.total_evaluation} ★
                                    </div>
                                    <div className="text-xm text-gray-500">
                                        {company.total_reviews} {`${t.review}`}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {searchQuery && filteredCompanies.length === 0 && (
                <div className="absolute bg-white shadow-lg p-4 w-full z-50 rounded-md">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div className="md:text-left text-center"> {/* Center text on mobile */}
                            <p className="text-gray-800 font-semibold text-base md:text-sm">
                                {t.noCompanyFound1}
                            </p>
                            {isBusinessSpace && (
                                <p className="text-gray-800 text-base md:text-sm mt-2 md:mt-0">
                                    {t.noCompanyFound2}
                                </p>
                            )}
                        </div>
                        {isBusinessSpace && (
                            <div className="mt-4 md:mt-0 md:text-right text-center"> {/* Center button on mobile */}
                                <button
                                    onClick={onAddCompany}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base md:text-sm"
                                >
                                    {t.addCompany}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
