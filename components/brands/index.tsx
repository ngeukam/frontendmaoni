import React from "react";
import BrandBox from "./BrandBox";
// import { brandContent } from "../../mock/brand";
import Slider from "react-slick";
import SectionTitle from "../UI/SectionTitle";
import { IBrand } from "../../lib/types/brand";
interface Props {
  brandContent: IBrand[];
}
const Brands: React.FC<Props> = ({ brandContent }) => {
  const settings = {
    infinite: true,
    speed: 6000,
    slidesToShow: 8,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 8000,
    cssEase: "linear",
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };
  return (
    <>
      {Array.isArray(brandContent) && brandContent.length > 7 && (
        <div className="p-1 my-4 md:my-8 text-center z-10">
          <SectionTitle title={"theyTrustUs"} />
          <Slider {...settings}>
            {brandContent.map((brandItem) => {
              return (
                <BrandBox
                  key={brandItem.id}
                  brandName={brandItem.name ?? ''}
                  imageSrc={brandItem.logo ?? ''}
                  link={brandItem.website ?? ''}
                />
              );
            })}
          </Slider>
        </div>
      )}
    </>
  );
};

export default Brands;
