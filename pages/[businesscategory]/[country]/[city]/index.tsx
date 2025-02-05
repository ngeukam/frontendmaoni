import React from "react";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { IBusiness } from "../../../../lib/types/business";
import { useLanguage } from "../../../../hooks/useLanguage";
import BusinessList from "../../../../components/businessList/BusinessList";
import { kebabToCamel } from "../../../../utilities/camel";
import { getAllBusiness, getFilterBusinessesList } from "../../../../lib/types/helpers/backendHelpers";
import capitalizeWords from "../../../../utilities/capitalize";


const CityPage: NextPage<{
    businesses: IBusiness[];
    categoryName: string;
}> = ({ businesses, categoryName }) => {
    const { t } = useLanguage();
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">{t.loading}...</div>
            </div>
        );
    }

    return (
        <div>
            <BusinessList businessList={businesses} categoryName={t[kebabToCamel(categoryName)] || ""}  />
        </div>
    );
};

export default CityPage;

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const businesses = await getAllBusiness({});
        const paths = businesses.map((business: IBusiness) => ({
            params: {
                businesscategory: business.name,
                country: business.country,
                city: business.city
            },
        }));

        return {
            paths,
            fallback: 'blocking',
        };
    } catch (error) {
        console.error('Error generating paths:', error);
        return { paths: [], fallback: 'blocking' };
    }
};
// Fetch data for a specific business category
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { businesscategory, country, city } = params as {
        businesscategory: string;
        country: string;
        city: string;
    };
    const originalbusinesscategory = kebabToCamel(businesscategory)
    const originalcountry = country.toUpperCase()
    const originalcity = capitalizeWords(city)
    try {
        const businesses = await getFilterBusinessesList(
            {
                category:originalbusinesscategory,
                country:originalcountry,
                city:originalcity
            });

        if (!businesses) {
            return { notFound: true };
        }

        return {
            props: {
                businesses: businesses || [], // Pass only the results if needed
                categoryName: businesscategory
            },
            revalidate: 10,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: {
                businesses: [],
                categoryName: ""
            },
        };
    }
};
