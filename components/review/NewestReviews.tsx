import React from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "../../hooks/useLanguage";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import SectionTitle from "../UI/SectionTitle";
import { IReview } from "../../lib/types/review";
import Link from "next/link";
import CardReview from "../UI/card/CardReview";

const NewestReviews = () => {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  let numReviewToShow = width >= 1536 ? 12 : 8;

  const newestReviews: IReview[] = useSelector(
    (state: any) => state.newestReviewsList.reviewsList
  );

  return (
    <div>
      {Array.isArray(newestReviews) && newestReviews.length > 0 && (
        <div className="mx-auto my-4 md:my-8 flex flex-col xl:max-w-[2130px]">
          <SectionTitle title={"newestReviews"} />

          <div className="grid gap-4 md:gap-2 grid-cols-6 md:grid-cols-12">
            {newestReviews
              .slice(0, numReviewToShow)
              .map((review: IReview) => {
                return <CardReview key={review.id} review={review} />;
              })}
          </div>
          {/* <div className="text-center">
            <Link href="/newestReviews">
              <a className="inline-block py-3 px-8 md:px-12 mt-4 text-sm md:text-base bg-palette-primary text-palette-side rounded-xl shadow-lg">
                {t.seeAllNewReviews}
              </a>
            </Link>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default NewestReviews;
