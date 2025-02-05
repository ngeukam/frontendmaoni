import React from "react";
import BannerBox from "./banner-box/BannerBox";
// import { bannerContent } from "../../mock/banner";
// import SectionTitle from "../UI/SectionTitle";
import { IBanner } from "../../lib/types/banner";
interface Props {
  bannerContent: IBanner[];
}
const Banner: React.FC<Props> = ({ bannerContent }) => {
  return (
    <>
      {Array.isArray(bannerContent) && bannerContent.length > 0 && (
        <div className="flex items-center flex-col w-full xl:max-w-[2100px] my-4 md:my-8 mx-auto">
          {/* <SectionTitle title={"BusinessBanner"} /> */}
          <div className="grid gap-4 grid-cols-6 lg:grid-cols-12">
            {
              bannerContent.map(
                ({
                  title,
                  description,
                  href,
                  imgHeight,
                  imgSrc,
                  imgWidth,
                  id
                }) => {
                  return (
                    <BannerBox
                      title={title || ''}
                      description={description || ''}
                      href={href || ''}
                      imgSrc={imgSrc || ''}
                      imgWidth={imgWidth || 900}
                      imgHeight={imgHeight || 300}
                      key={id}
                    />
                  );
                }
              )
            }

          </div>
        </div>

      )}
    </>
  );
};

export default Banner;
