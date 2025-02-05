import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import capitalizeWords from "../../utilities/capitalize";
import { IBusiness } from "../../lib/types/business";

interface RelatedBusinessCardProps {
    BusinessInfo: IBusiness;
}

const BusinessInfoCard: React.FC<RelatedBusinessCardProps> = ({ BusinessInfo }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t['about']} {capitalizeWords(BusinessInfo.name ?? '')}
            </h2>
            <p className="text-gray-800 mb-4">
                {BusinessInfo.description || t.noDescriptionAvailable || "No description available."}
            </p>

            <hr className="my-4 border-t-1 border-gray-300 dark:border-gray-600" />

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                {t["contact"]}
            </h3>
            <div className="text-gray-700">
                {BusinessInfo.email && (
                    <p className="mb-2">
                        <strong>Email: </strong>
                        <a
                            href={`mailto:${BusinessInfo.email}`}
                            className="text-blue-600 hover:underline"
                        >
                            {BusinessInfo.email}
                        </a>
                    </p>
                )}

                {BusinessInfo.website && (
                    <p className="mb-2">
                        <strong>{t.website || "Website"}: </strong>
                        <a
                            href={BusinessInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {BusinessInfo.website}
                        </a>
                    </p>
                )}

                {BusinessInfo.phone && (
                    <p className="mb-2">
                        <strong>{t.phone || "Phone"}: </strong>
                        <span className="text-blue-600">
                            {BusinessInfo.phone}
                        </span>
                    </p>
                )}

                <hr className="my-4 border-t-1 border-gray-300 dark:border-gray-600" />

                <p className="mt-4">
                    <strong>{t.address || "Address"}: </strong>
                    <span className="block">{BusinessInfo.city || "Unknown city"}</span>
                    <span className="block">{BusinessInfo.countrynamecode || "Unknown country"}</span>
                </p>
            </div>
        </div>
    );
};

export default BusinessInfoCard;
