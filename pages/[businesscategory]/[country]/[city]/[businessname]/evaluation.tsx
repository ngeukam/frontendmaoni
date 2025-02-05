import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../../../../hooks/useLanguage';
import { kebabToCamel } from '../../../../../utilities/camel';
import capitalizeWords from '../../../../../utilities/capitalize';
import WriteReview from '../../../../../components/review/WriteReview';
import { IBusiness } from '../../../../../lib/types/business';
import { getAllBusiness, getBusinessDetails } from '../../../../../lib/types/helpers/backendHelpers';
import { getStarColor2 } from '../../../../../utilities/getStarColor';
import BusinessHeader from '../../../../../components/review/BusinessHeader';
import Breadcrumb from '../../../../../components/UI/Breadcrumb';

const CompanyPage: NextPage<{ business: IBusiness }> = ({ business }) => {
  const router = useRouter();
  const [userRating, setUserRating] = useState(0); // État pour stocker la note de l'utilisateur
  const [hoverRating, setHoverRating] = useState(0);
  const { t } = useLanguage();
  const { score } = router.query;
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollY = useRef(0);

  // Gère le changement de note
  const handleRatingChange = (nextValue: number) => {
    setUserRating(nextValue);
  };

  useEffect(() => {
    if (score) {
      // Make sure score is a valid number before setting the user rating
      const parsedScore = parseFloat(score as string);
      if (!isNaN(parsedScore)) {
        setUserRating(parsedScore);
      }
    }
  }, [score]);

  // Formulaires dynamiques
  const renderForm = () => {
    return (
      <WriteReview BusinessInfo={business} rating={userRating} />
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) { // Access the current value
        setIsScrollingUp(true); // Scrolling up
      } else {
        setIsScrollingUp(false); // Scrolling down
      }
      lastScrollY.current = currentScrollY; // Update the ref's value
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  if (router.isFallback) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t.loading}...</div>
      </div>
    );
  }
  return (
    <div>
      <Breadcrumb />
      <div
        className={`sticky-top-card ${isScrollingUp ? "z-[1000]" : "z-[20]" // Modifier le z-index selon la direction
          }`}
      >
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between space-y-4 md:space-y-0 bg-white border-[1px] border-gray-300 rounded-lg p-6 shadow-lg">
          <BusinessHeader
            logo={typeof business?.logo === 'string' ? business.logo : ""}
            name={business.name ?? ''}
            city={business.city ?? ''}
            countrynamecode={business.countrynamecode || ''}
            website={business.website ?? ''}
          />
          <div className="text-lg text-gray-800 text-center">
            <span>{t.evaluateYourExperience}</span>
          </div>
          <div className="flex space-x-1 mx-auto sm:mx-0">
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
      </div>
      {renderForm()}
    </div>


  );
};


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
    businesscategory: string,
    country: string,
    city: string,
    businessname: string
  };
  const originalBusinessName = businessname.replace(/-/g, ' ');
  const originalbusinesscategory = kebabToCamel(businesscategory)
  const originalcountry = country.toUpperCase()
  const originalcity = capitalizeWords(city)

  try {
    const businessDetails = await getBusinessDetails(
      {
        businesscategory: originalbusinesscategory,
        country: originalcountry,
        city: originalcity,
        businessname: originalBusinessName
      });
    if (!businessDetails) {
      return { notFound: true };
    }
    return { props: { business: businessDetails }, revalidate: 10 };
  } catch (error) {
    console.error("Error fetching user businesses:", error);
    return {
      props: {
        business: {},
      },
      revalidate: 10
    };
  }

};

export default CompanyPage;
