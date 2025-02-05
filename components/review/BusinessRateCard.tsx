import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import RatingComponent from './RatingComponent';
import { useLanguage } from '../../hooks/useLanguage';
import capitalizeWords from '../../utilities/capitalize';
import { getStarColor } from '../../utilities/getStarColor';
import Image from 'next/image';
interface BusinessRateCardProps {
    companyName: string;
    reviewsCount: number;
    stars: number; // e.g., 4.7
    isVerified: boolean;
    showEval: boolean;
    websiteURL: string;
    companyType: string;
    logo: string;
    country: string;
    city: string;
}

const BusinessRateCard: React.FC<BusinessRateCardProps> = ({
    companyName,
    reviewsCount,
    stars,
    isVerified,
    showEval,
    websiteURL,
    companyType,
    logo,
    country,
    city,
}) => {
    const { t } = useLanguage();

    const getRatingLabel = (rating: number): string => {
        if (rating >= 4.5) {
            return "excellent"; // Pour les notes >= 4.5
        } else if (rating >= 4) {
            return "good"; // Pour les notes >= 4 et < 4.5
        } else if (rating >= 3) {
            return "medium"; // Pour les notes >= 3 et < 4
        } else {
            return "bad"; // Pour les notes < 3
        }
    };

    return (
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 bg-white border-[1px] border-gray-300 rounded-lg shadow-lg space-y-4 md:space-y-0">
            {/* Company Details */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <div className="w-14 h-14 flex items-center justify-center">
                    {logo ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${logo}`}
                            alt={`${companyName} logo`}
                            width={50}
                            height={50}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <Image
                            src="/images/default-business.webp"
                            alt={`${companyName} logo`}
                            width={50}
                            height={50}
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>

                {/* Company Info */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{capitalizeWords(companyName)}</h2>
                    <p className="text-sm text-gray-600">
                        {capitalizeWords(city)} • {country}
                    </p>
                    <p className="text-[18px] text-gray-600">
                        {reviewsCount} {capitalizeWords(t.review || "Reviews")} {showEval && `• ${t[getRatingLabel(stars)]}`}
                    </p>

                    {/* Stars */}
                    {showEval && (<div className="flex items-center mt-1 space-x-2">
                        <RatingComponent evaluation={stars} getColor={getStarColor}/>
                        <span className="text-lg font-medium text-gray-700">{stars}</span>
                    </div>)}

                    {/* Verified Badge */}
                    {isVerified && (
                        <div className="mt-1 inline-block px-2 py-1 text-lg font-semibold text-green-700 bg-green-100 rounded-lg">
                            {t[companyType]}
                        </div>
                    )}
                </div>
            </div>

            {/* Website Link */}
            {websiteURL && <div className="mx-auto sm:mx-0 md:text-right px-8 py-2 text-blue-600 bg-white border border-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300 ease-in-out transform hover:scale-105">
                <a
                    href={websiteURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-10 justify-between"
                >
                    <div className="flex flex-col text-left">
                        <span className="font-semibold text-lg">{companyName}</span>
                        <span className="text-sm text-gray-500">{t["websiteLabel"]}</span>
                    </div>
                    <div className="flex items-center justify-center ml-4">
                        <AiOutlineArrowRight size={20} className="text-blue-600 transition-transform duration-300 transform hover:translate-x-2" />
                    </div>
                </a>
            </div>}

        </div>
    );
};

export default BusinessRateCard;
