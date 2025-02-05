import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { AiOutlineDelete, AiOutlineDownload, AiOutlinePlus } from 'react-icons/ai';
import { Switch } from 'antd';
import capitalizeWords from '../../utilities/capitalize';
import { IUserBusiness } from '../../lib/types/user';
import { downloadExcel } from '../../utilities/downloadExcel';
import { useLanguage } from '../../hooks/useLanguage';
import RatingComponent from '../review/RatingComponent';
import { getStarColor } from '../../utilities/getStarColor';
import Image from 'next/image';

interface BusinessListSectionProps {
    userBusinesses: IUserBusiness[];
    handleAddCompany: () => void;
    handleCompanyClick: (company: IUserBusiness) => void;
    handleDeleteCompany: (id: string) => void;
    hiddenEval: { [key: string]: boolean };
    hiddenReview: { [key: string]: boolean };
    handleToggleHiddenEval: (id: string, checked: boolean) => void;
    handleToggleHiddenReview: (id: string, checked: boolean) => void;
}

const BusinessCollaboratorListSection: React.FC<BusinessListSectionProps> = ({
    userBusinesses,
    handleAddCompany,
    handleCompanyClick,
    handleDeleteCompany,
    hiddenEval,
    hiddenReview,
    handleToggleHiddenEval,
    handleToggleHiddenReview,
}) => {
    const { t } = useLanguage();
    const [scrollPosition, setScrollPosition] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (listRef.current) {
                setScrollPosition(listRef.current.scrollTop);
            }
        };

        if (listRef.current) {
            listRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (listRef.current) {
                listRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);
    const listStyle: CSSProperties = userBusinesses.length > 2 ? {
        overflowY: 'auto',
        maxHeight: '25rem', // Or a number like 200 if you want pixels
        scrollbarWidth: 'thin'
    } : {}; return (
        <section className="bg-white w-full rounded-lg shadow-md p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-blue-400">{t.listOfBusiness || "List of business.es"}</h3>
                <button
                    onClick={handleAddCompany}
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                >
                    <AiOutlinePlus size={20} />
                </button>
            </div>
            <ul className="space-y-2" style={listStyle} ref={listRef}>
                {Array.isArray(userBusinesses) && userBusinesses.length === 0 ? (
                    <li className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-blue-100 border border-gray-300 dark:bg-palette-card dark:text-white">
                        <div>{t.NoBusinessAffected || "No Business Affected"}</div>
                    </li>
                ) : Array.isArray(userBusinesses) ? (
                    userBusinesses.map((company, index) => (
                        <li
                            key={index}
                            className="relative p-2 bg-gray-50 rounded cursor-pointer hover:bg-blue-100 border border-gray-300 dark:bg-palette-card dark:text-white"
                            onClick={() => handleCompanyClick(company)}
                        >
                            <div className="flex items-center space-x-2">
                                {company.logo ? <Image
                                    src={company.logo ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${company.logo}` : "/images/discount-icon/business.webp"}
                                    height={40}
                                    width={40}
                                    alt={`${company.name} logo`}
                                    
                                    className="rounded-full object-cover border border-gray-300"
                                /> :
                                    <Image
                                        src="/images/default-business.webp"
                                        alt={`${company.name} logo`}
                                        height={40}
                                        width={40}
                                        className="rounded-full object-cover border border-gray-300"
                                    />}

                                <strong>{capitalizeWords(company.name)}</strong>
                            </div>
                            <div>{company.city}, {company.countrynamecode}</div>
                            <div><em>{t[company.category?.name ?? '']}</em></div>
                            <div className="mt-2">
                                <p className='text-[#4CAF50]'><strong>{t.activeCode || "Active Code"} :</strong> {(company.active_codes ?? []).length}</p>
                                <p className='text-[#FF5733]'><strong>{t.inactiveCode || "Inactive Code"} :</strong> {(company.inactive_codes ?? []).length}</p>
                            </div>

                            {/* Boutons Switch */}
                            <div className="flex justify-between items-center mt-2">
                                <div onClick={(e) => e.stopPropagation()}>
                                    <span className="mr-2">{t.showEval || "Show Eval"}</span>
                                    <Switch
                                        checked={hiddenEval[company.id] ?? false}
                                        onChange={(checked) => handleToggleHiddenEval(company.id, checked)}
                                        checkedChildren={t.yes || "YES"}
                                        unCheckedChildren={t.no || "NO"}
                                        style={{
                                            backgroundColor: hiddenEval[company.id] ? "#51A0BB" : "#ccc",
                                        }}
                                    />
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <span className="mr-2">{t.showReview || "Show Review"}</span>
                                    <Switch
                                        checked={hiddenReview[company.id] ?? false}
                                        onChange={(checked) => handleToggleHiddenReview(company.id, checked)}
                                        checkedChildren={t.yes || "YES"}
                                        unCheckedChildren={t.no || "NO"}
                                        style={{
                                            backgroundColor: hiddenReview[company.id] ? "#4a8ea0" : "#ccc",
                                        }}
                                    />
                                </div>
                            </div>
                            {company?.total_evaluation !== 0 && <div className='flex justify-between items-center mt-2'>
                                <RatingComponent evaluation={company?.total_evaluation ?? 0} getColor={getStarColor} />
                            </div>
                            }
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    downloadExcel(company);
                                }}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                <AiOutlineDownload className="cursor-pointer" size={30} title={`${t["downloadCode"]}`} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCompany(company.id);
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                <AiOutlineDelete size={25} />
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-red-500">{t.invalidBusinessData || "Invalid Business data"}.</p>
                )}
            </ul>
        </section>
    );
};

export default BusinessCollaboratorListSection;
