import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { useRouter } from "next/router";
import { camelToKebab } from "../../utilities/camel";
import { getStarColor2 } from "../../utilities/getStarColor";

interface CreateReviewCardProps {
    businessname: string | undefined;
    category: string | undefined;
    country: string | undefined;
    city: string | undefined;
}

const CreateReviewCard: React.FC<CreateReviewCardProps> = ({
    businessname,
    category,
    country,
    city
}) => {
    const router = useRouter();
    const [userRating, setUserRating] = useState(0); // État pour stocker la note de l'utilisateur
    const [hoverRating, setHoverRating] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    // Gère le changement de note
    const handleRatingChange = async (nextValue: number) => {
        setUserRating(nextValue);
        setIsVisible(true);
        router.push(`/${camelToKebab(category ?? '')}/${country?.toLowerCase()}/${city?.toLowerCase()}/${businessname?.replace(/\s+/g, '-')}/evaluation?score=${nextValue}`)
    };
    return (
        <div className="p-4 bg-white border-[1px] border-gray-300 rounded-lg shadow-md mb-2 mt-[-25px]">
            {/* Company Details */}
            <div className="text-center">
                <h3 className="text-lg text-blue-600">
                    {t["evaluateYourExperience"]}
                </h3>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center mt-4 space-x-1">
                {[...Array(5)].map((_, index) => {
                    const starIndex = index + 1;
                    const activeRating = hoverRating || userRating;
                    const isActive = starIndex <= activeRating;
                    const starColor = isActive ? getStarColor2(activeRating) : '#ccc';
                    return (
                        <span
                            key={index}
                            className="star"
                            style={{
                                backgroundColor: starColor,
                                
                            }}
                            onClick={() => handleRatingChange(starIndex)}
                            onMouseEnter={() => setHoverRating(starIndex)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default CreateReviewCard;
