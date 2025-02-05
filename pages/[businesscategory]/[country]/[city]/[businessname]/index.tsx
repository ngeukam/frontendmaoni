import React, { useState, useEffect, useRef } from "react";
import CreateReviewCard from "../../../../../components/review/CreateReviewCard";
import BusinessRateCard from "../../../../../components/review/BusinessRateCard";
import BusinessReviewCard from "../../../../../components/review/BusinessReviewCard";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import RelatedBusinessCard from "../../../../../components/review/RelatedBusinessCard";
import { useRouter } from "next/router";
import capitalizeWords from "../../../../../utilities/capitalize";
import { kebabToCamel } from "../../../../../utilities/camel";
import BusinessInfoCard from "../../../../../components/review/BusinessInfoCard";
import { IBusiness } from "../../../../../lib/types/business";
import { IReview } from "../../../../../lib/types/review";
import { getAllBusiness, getBusinessDetails, getBusinessReview, getRelatedBusiness } from "../../../../../lib/types/helpers/backendHelpers";
import { useLanguage } from "../../../../../hooks/useLanguage";
import Breadcrumb from "../../../../../components/UI/Breadcrumb";

const ReviewCompanyPage: NextPage<{ initialReviews: any, businessinfo: IBusiness }> = ({ initialReviews, businessinfo }) => {
    const [reviews, setReviews] = useState<IReview[]>(initialReviews?.results || []);
    const [pagination, setPagination] = useState<any>(initialReviews || {});
    const [relatedbusiness, setRelatedBusiness] = useState([]);
    const [aboutbusiness, setAboutBusiness] = useState<any>(businessinfo);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const {t} = useLanguage();

    const fetchReviews = async (url: string | null) => {
        if (url) {
            const response = await fetch(url);
            const data = await response.json();
            setReviews(data.results);
            setPagination(data);
        }
    };

    useEffect(() => {
        const fetchRelatedBusiness = async () => {
            setIsLoading(true);
            const response = await getRelatedBusiness({}, businessinfo.id ?? '');
            const response2 = await getBusinessDetails({
                businesscategory: businessinfo.category?.name,
                country: businessinfo.country,
                city: businessinfo.city,
                businessname: businessinfo.name
            })
            setRelatedBusiness(response);
            setAboutBusiness(response2)
            setIsLoading(false);
        };
        fetchRelatedBusiness();
    }, [businessinfo.id, businessinfo.name, businessinfo.city, businessinfo.category?.name, businessinfo.country]);

    useEffect(() => {
        setReviews(initialReviews?.results || []);
        setPagination(initialReviews || {});
    }, [initialReviews]);

    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const lastScrollY = useRef(0); // Utilisation de useRef pour garder la valeur persistante

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < lastScrollY.current) {
                setIsScrollingUp(false); // Défilement vers le haut
            } else {
                setIsScrollingUp(true); // Défilement vers le bas
            }
            lastScrollY.current = currentScrollY; // Mise à jour de la valeur persistante
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isLoading || router.isFallback) {
        // You can render a loading spinner or placeholder
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">{t.loading}</div>
            </div>
        );
    }
    return (
        <div className="dark:bg-gray-900 text-gray-600 min-h-screen flex flex-col">
            <Breadcrumb />

            <div
                className={`sticky-top-card ${isScrollingUp ? "z-[1000]" : "z-[10]" // Modifier le z-index selon la direction
                    }`}
            >
                <BusinessRateCard
                    companyName={businessinfo?.name || ""}
                    reviewsCount={businessinfo?.total_reviews ?? 0} // Default to 0 if undefined
                    stars={businessinfo?.total_evaluation ?? 0}    // Default to 0 if undefined
                    isVerified={businessinfo?.isverified ?? false} // Default to false if undefined
                    websiteURL={businessinfo?.website || ""}
                    companyType={businessinfo?.btype || ""}
                    logo={typeof businessinfo?.logo === 'string' ? businessinfo.logo : ""}
                    city={businessinfo?.city || ""}
                    country={businessinfo?.country || ""}
                    showEval={businessinfo?.showeval ?? false}
                />
            </div>


            <main className="flex flex-1 flex-col sm:flex-row px-4 sm:px-8 md:px-16 items-start">
                <section className="w-full sm:w-2/3 bg-gray-100 dark:bg-gray-800 sm:p-6 my-4 sm:my-0">
                    <CreateReviewCard
                        businessname={businessinfo?.name}
                        category={businessinfo.category?.name}
                        country={businessinfo?.country ?? ''}
                        city={businessinfo?.city}
                    />
                    {businessinfo?.showreview && <BusinessReviewCard reviewElements={reviews} />}

                    {/* Pagination controls */}
                    {(businessinfo?.total_reviews ?? 0) > 20 && (
                        <div className="flex justify-center items-center mt-6 space-x-4">
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${pagination.previous
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                disabled={!pagination.previous}
                                onClick={() => fetchReviews(pagination.previous)}
                            >
                                Previous
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${pagination.next
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                disabled={!pagination.next}
                                onClick={() => fetchReviews(pagination.next)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>
                {/* <aside className="w-full sm:w-1/3 bg-white border rounded-lg p-4 sm:p-6 md:mt-0 max-h-[800px]"> */}
                {/* Colonne latérale droite */}
                <aside className="w-full sm:w-1/3 space-y-6">
                    {/* Carte 1 */}
                    <div className="bg-white border-[1px] border-gray-300 rounded-lg p-4 sm:p-6">
                        <BusinessInfoCard BusinessInfo={aboutbusiness} />
                    </div>
                    {/* Carte 2 */}
                    {relatedbusiness.length > 0 && <div className="bg-white border-[1px] border-gray-300 rounded-lg p-4 sm:p-6">
                        <RelatedBusinessCard relatedBusiness={relatedbusiness} />
                    </div>}
                    {/* Carte 3 */}
                    <div className="bg-white border-[1px] border-gray-300 rounded-lg p-4 sm:p-6">
                        <h3 className="text-lg font-semibold mb-4">{t.aboutMaoni}</h3>
                        {/* Ajoutez ici le contenu ou des composants supplémentaires */}
                        <p>{t.maoniDescription}</p>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default ReviewCompanyPage;

export const getStaticPaths: GetStaticPaths = async () => {
    const allBusinesses = await getAllBusiness({});

    // Dynamically create paths based on business details
    const paths = allBusinesses.map((business: any) => ({
        params: {
            businesscategory: business.category.name,
            country: business.country,
            city: business.city,
            businessname: business.name.replace(/\s+/g, '-'), // Ensure business name is hyphenated
            id: business.id,
        },
    }));

    return { paths, fallback: 'blocking' };  // Use 'true' or 'blocking' based on your needs
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { businesscategory, country, city, businessname } = params as {
        businesscategory: string;
        country: string;
        city: string;
        businessname: string;
    };
    const originalBusinessName = businessname.replace(/-/g, ' ');
    const originalbusinesscategory = kebabToCamel(businesscategory)
    const originalcountry = country.toUpperCase()
    const originalcity = capitalizeWords(city)

    try {
        const businessrevDetails = await getBusinessReview({
            businesscategory: originalbusinesscategory,
            country: originalcountry,
            city: originalcity,
            businessname: originalBusinessName,
            page: 1,
            page_size: 20,
        });
        if (!businessrevDetails || !businessrevDetails.results) {
            return { notFound: true };
        }

        return {
            props: {
                initialReviews: businessrevDetails,
                businessinfo: businessrevDetails.results[0]?.business || {},
            },
            revalidate: 10,
        };
    } catch (error) {
        return {
            props: {
                initialReviews: [],
                businessinfo: []
            },
            revalidate: 10,
        };
    }

};
