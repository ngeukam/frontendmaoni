import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
// import Brands from "../../components/brands";
const Brands = dynamic(() => import("../../components/brands"));
import { useRouter } from "next/router";
import { useLanguage } from "../../hooks/useLanguage";
import SearchBar from "../../components/review/SearchBar";
import Link from "next/link";
import { IBrand } from "../../lib/types/brand";
import { NextPage } from "next";
import Banners from "../../components/banners";
import { IBanner } from "../../lib/types/banner";
import { getBanner, getBusinessBrand } from "../../lib/types/helpers/backendHelpers";


const HeroSection: NextPage<{ brandContent: IBrand[], bannerContent: IBanner[] }> = ({ brandContent, bannerContent }) => {

    const router = useRouter();
    const { t } = useLanguage();
    const handleAddCompany = () => {
        router.push(`/businessSpace/signup`);
    };


    return (
        <>
            <div className="bg-blue-600 text-white py-12 px-6 lg:px-20 flex flex-col lg:flex-row items-center lg:justify-between">
                {/* Text Section */}
                <div className="lg:w-2/3 space-y-6">
                    <h1 className="text-3xl lg:text-5xl font-bold">
                        {t.strengthen_your_customers}
                    </h1>
                    <p className="text-lg lg:text-xl">
                        <span className="font-bold">{t.invite_your_customers}</span> {t.express_yourself}
                    </p>
                    <div className="flex flex-col lg:flex-row gap-4 mt-6 w-full items-center lg:items-start">
                        <Link href={`/businessSpace/signup`}>
                            <a>
                                <button className="bg-palette-primary text-white py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg transition-transform duration-200 w-full sm:w-auto mt-4 lg:mt-0">
                                    {t.create_a_free_account}
                                </button>
                            </a>
                        </Link>
                        <Link href={`/contactus`}>
                            <a>
                                <button className="bg-black text-white py-3 px-6 rounded-lg flex items-center justify-center hover:bg-gray-800 transition duration-200 w-full sm:w-auto">
                                    📞 {t.talk_to_an_expert}
                                </button>
                            </a>
                        </Link>
                    </div>
                    <p className="text-sm mt-4">
                        {t.request_a_demo}
                    </p>
                </div>

                {/* Image Section */}
                <div className="lg:w-1/3 flex flex-col items-center lg:items-end mt-10 lg:mt-0">
                    <Image
                        src="/images/discount-icon/user-laptop.webp"
                        width={300}
                        height={280}
                        alt="User-on-laptop"
                        className="mt-6 w-48 rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Centered Section */}
            <div className="flex flex-col items-center justify-center text-center mt-12 space-y-4">
                <p className="text-xl font-bold">
                    {t.find_out_what_your_customers_think_of_your_company}:
                </p>
                <div className="w-full">
                    <SearchBar
                        onAddCompany={handleAddCompany}

                    />
                </div>
            </div>

            <Brands />
            <Banners bannerContent={bannerContent} />
        </>
    );
};

export default HeroSection;

export const getStaticProps = async () => {
    try {
        const brands = await getBusinessBrand({});
        const banners = await getBanner({})
        return {
            props: {
                brandContent: brands || [],
                bannerContent: banners || []
            },
            revalidate: 10
        };
    } catch (error) {
        return {
            props: {
                brandContent: [],
                bannerContent: []
            },
            revalidate: 10
        };
    }
}