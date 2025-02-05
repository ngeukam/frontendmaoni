import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    title: string;
    description: string;
    buttonText: string;
    imageUrl: string;
}

const BusinessBanner: React.FC<Props> = ({ title, description, buttonText, imageUrl }) => {
    return (
        <div className="flex flex-col md:flex-row items-center border rounded-lg w-full xl:max-w-[2100px] my-4 md:my-8 mx-auto bg-palette-primary text-white p-4 md:p-6 font-sans"> {/* Ajout de flex-col et p-4 */}
            <div className="content flex-1 md:mr-6"> {/* Ajout de marge à droite sur desktop */}
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left"> {/* Text size responsive et alignement */}
                    {title}
                </h2>
                <p className="text-base md:text-lg mb-4 text-center md:text-left"> {/* Text size responsive et alignement */}
                    {description}
                </p>
                <div className="text-center md:text-left"> {/* Alignement du bouton */}
                    <Link href={`/businessSpace`}>
                        <a>
                            <button className="text-lg bg-white text-gray-600 py-2 px-4 rounded hover:bg-blue-100">
                                {buttonText} →
                            </button>
                        </a>
                    </Link>
                </div>
            </div>
            <div className="mt-4">
            <Image src={imageUrl} alt="User-on-laptop" width={200}
                height={180} className="w-48 rounded-lg shadow-lg" />
            </div>
        </div>
    );
};

export default BusinessBanner;