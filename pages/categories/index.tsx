import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useLanguage } from "../../hooks/useLanguage";
import { camelToKebab } from "../../utilities/camel";
import { ICategory } from "../../lib/types/categories";
import { getCategoriesAndNumberOfBusiness } from "../../lib/types/helpers/backendHelpers";
import { GetStaticProps, NextPage } from "next";

const CategoriesPage: NextPage<{
    categories: ICategory[];
}> = ({ categories }) => {
    const { t } = useLanguage();
    const router = useRouter();
    const [categorieslist, setCategoriesList] = useState<ICategory[] | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        setCategoriesList(categories);
        setIsLoading(false);
    }, []);


    const onClickHandler = (categoryName: string) => {
        router.push(`/${camelToKebab(categoryName)}/`);
    };

    if (isLoading) { // Check loading state
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">{t.loading}...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen py-10 px-4 bg-gray-100"> {/* Added background color */}
            <h3 className="text-3xl md:text-4xl font-bold text-palette-primary mb-6 text-center"> {/* Centered title */}
                {t.explorecategories}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-7xl"> {/* Added max-w-7xl and w-full */}
                {categorieslist?.map((item, index) => (
                    <div
                        key={index}
                        className="group relative flex flex-col items-center justify-center py-6 px-8 bg-white shadow-lg rounded-lg transform transition-transform duration-100 hover:scale-105 hover:shadow-2xl cursor-pointer hover:bg-palette-primary"
                        onClick={() => onClickHandler(item.name)}
                    >
                        <div className="absolute top-2 right-2 bg-gray-300 text-gray-700 rounded-full px-2 py-1 text-sm font-medium"> {/* Badge */}
                            {item.business_count} {/* Display the count here */}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-700 text-center group-hover:text-white transition-colors duration-100">
                            {t[item.name]}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;

export const getStaticProps: GetStaticProps = async () => {
    try {
        const categoriesData = await getCategoriesAndNumberOfBusiness({});
        return {
            props: {
                categories: categoriesData || [],
            },
            revalidate: 10
        };
    } catch (error) {
        return {
            props: {
                categories: [],
            },
            revalidate: 10
        };
    }

};