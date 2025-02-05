import React from "react";
import { FaGlobe } from "react-icons/fa";
import capitalizeWords from "../../utilities/capitalize";
import Image from "next/image";

interface Props {
    logo: string;
    name: string;
    city: string;
    countrynamecode: string;
    website: string;
}

const BusinessHeader: React.FC<Props> = ({
    logo,
    name,
    city,
    countrynamecode,
    website
}) => {
    return (
        <div className="flex items-center justify-between space-x-8">
            {/* Left section: Logo and Details */}
            <div className="flex items-center space-x-1">
                {logo ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${logo}`}
                        alt={`${name} logo`}
                        width={50}
                        height={50}
                        className="object-cover"
                    />
                ) : (
                    <Image
                        src="/images/default-business.webp"
                        alt={`${name} logo`}
                        width={50}
                        height={50}
                        className="object-cover"
                    />
                )}
                <div>
                    <div className="text-xl text-left text-gray-800 dark:text-blue-600 font-semibold mb-2">{capitalizeWords(name)}</div>
                    <div className="text-sm text-left text-gray-500">{city} • {countrynamecode}</div>
                </div>
            </div>

            {/* Right section: Website */}
            {website && (
                <div className="company-website text-right">
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Visit web site"
                    >
                        <FaGlobe className="text-gray-500 w-6 h-6" />
                    </a>
                </div>
            )}
        </div>
    );
};

export default BusinessHeader;
