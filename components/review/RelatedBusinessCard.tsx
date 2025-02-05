import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import RatingComponent from "./RatingComponent";
import capitalizeWords from "../../utilities/capitalize";
import Link from "next/link";
import { camelToKebab } from "../../utilities/camel";
import { IBusiness } from "../../lib/types/business";
import { getStarColor } from "../../utilities/getStarColor";
import Image from "next/image";

interface RelatedBusinessCardProps {
    relatedBusiness: IBusiness[];
}

const RelatedBusinessCard: React.FC<RelatedBusinessCardProps> = ({ relatedBusiness }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-white rounded-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
                {t.relatedBusiness}:
            </h2>
            <ul className="space-y-4">
                {relatedBusiness.map((item) => (
                    <li key={item.id} className="flex items-start space-x-4">
                        {/* Business Logo or Default Icon */}
                        {item.logo ? (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.logo}`}
                                alt={`${item.name} logo`}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover border"
                            />
                        ) : (
                            <Image
                                src="/images/default-business.webp"
                                alt={`${item.name} logo`}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover border"
                            />
                        )}

                        {/* Business Details */}
                        <div className="flex-1">
                            <Link href={`/${camelToKebab(item.category?.name ?? '')}/${(item?.country ?? '').toLowerCase()}/${(item?.city ?? '').toLowerCase()}/${(item?.name ?? '').replace(/\s+/g, '-')}`}>
                                <a
                                    className="text-lg font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    {capitalizeWords(item?.name ?? '')}
                                </a>
                            </Link>
                            <p className="text-xm">{item.city}•{item.countrynamecode} </p>
                            {item?.showeval && <div className="flex items-center mt-2 space-x-2">
                                <RatingComponent evaluation={(item?.total_evaluation ?? 0)} getColor={getStarColor} />
                                <span className="text-lg font-medium text-gray-600">
                                    {item?.total_reviews}
                                </span>
                            </div>}
                            {/* Optional: Additional information */}
                            <p className="text-sm text-gray-500 mt-2">
                                {t.profile} {item?.isverified ? t.claimed || "revendiqué" : t.notClaimed || "non revendiqué"}
                            </p>

                        </div>
                    </li>
                ))}
            </ul>
            <p className="text-sm text-gray-500 mt-8">
                {t.relatedInfo}
            </p>
        </div>
    );
};

export default RelatedBusinessCard;
