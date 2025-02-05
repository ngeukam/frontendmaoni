import type { NextPage } from "next";
import { useEffect } from "react";
import dynamic from "next/dynamic";

import { useDispatch } from "react-redux";
import Benefits from "../components/Benefits";
import Carousel from "../components/carousel";
const Category = dynamic(() => import("../components/category/Category"));
const SearchBar = dynamic(() => import("../components/review/SearchBar"))
const Brands = dynamic(() => import("../components/brands"));
const NewestReviews = dynamic(() => import("../components/review/NewestReviews"))
const Banners = dynamic(() => import("../components/banners"), { ssr: false });
const BusinessBanner = dynamic(() => import("../components/banners/business-banner"), { ssr: false });

import { newestReviewsFn } from "../utilities/sortByTimeStamp";
import { useRouter } from "next/router";
import { IReview } from "../lib/types/review";
import { IBrand } from "../lib/types/brand";
import { ISlide } from "../lib/types/slide";
import { IBanner } from "../lib/types/banner";
import { newestReviewsActions } from "../store/newestReview-slice";
import { getBanner, getBusinessBrand, getCategories, getReviews, getSlide } from "../lib/types/helpers/backendHelpers";
import { useSelector } from "react-redux";
import { IUserInfoRootState } from "../lib/types/user";
import { userInfoActions } from "../store/user-slice";
import jsCookie from "js-cookie";
import { useLanguage } from "../hooks/useLanguage";
import { ICategory } from "../lib/types/categories";

const Home: NextPage<{ slides: ISlide[]; brandContent: IBrand[]; bannerContent: IBanner[]; reviews: IReview[]; categories:ICategory[] }> = ({ slides, categories, bannerContent, reviews, brandContent }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleAddCompany = () => {
    router.push(`/business/create`);
  };
  const {t} = useLanguage();
  const userInfoCookie = useSelector(
    (state: IUserInfoRootState) => state.userInfo.userInformation
  );
  useEffect(() => {
    if (!userInfoCookie) {
      dispatch(userInfoActions.userLogout());
      jsCookie.remove("userInfo");
    }
  }, [dispatch, userInfoCookie]);
  useEffect(() => {
    //add reviews to newest list
    const sortedReviewsByTimeStamp = newestReviewsFn(reviews);
    dispatch(newestReviewsActions.addReviews(sortedReviewsByTimeStamp));
  }, [dispatch, reviews]);

  return (
    <div>
      <Carousel sliderContent={slides} />
      <SearchBar onAddCompany={handleAddCompany} />
      <Benefits />
      <Category categories={categories}/>
      <BusinessBanner
        title={t.lookingToGrowBusiness || "Looking to grow your business?"}
        description={t.strengthenYourReputation || "Strengthen your reputation with authentic reviews on MaoniDrive."}
        buttonText={t.getStarted || "Get started"}
        imageUrl="/images/discount-icon/user-laptop.webp"
      />
      <Banners bannerContent={bannerContent} />
      <NewestReviews />    
      <Brands brandContent={brandContent}/>
      {/* <Banners bannerContent={bannerContent} /> */}
    </div>
  );
};

export default Home;


export const getStaticProps = async () => {
  try {
    const slides = await getSlide({})
    const brands = await getBusinessBrand({});
    const banners = await getBanner({})
    const reviews = await getReviews({}) //limiter la requête à 8 dans le backend
    const categories = await getCategories({})
    return {
      props: {
        slides: slides || [],
        brandContent: brands || [],
        bannerContent: banners || [],
        reviews: reviews || [],
        categories:categories || []
      },
      revalidate: 10
    };
  } catch (error) {
    return {
      props: {
        slides: [],
        brandContent: [],
        bannerContent: [],
        reviews: [],
        categories:[]
      },
      revalidate: 10
    };
  }
};