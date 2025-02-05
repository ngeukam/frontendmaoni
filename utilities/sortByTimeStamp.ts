import { IBusiness } from "../lib/types/business";
import { IReview } from "../lib/types/review";

export function getTimeStamp(date: string) {
  const creationReviewDate = new Date(date);
  return creationReviewDate.getTime();
}

export const sortByBusinessTimeStamp = (
  business1: IBusiness,
  business2: IBusiness
): number => {
  if (business2?.created_at && business1?.created_at) {
    return new Date(business2.created_at).getTime() - new Date(business1.created_at).getTime();
  }
  return 0;
};

export const sortByReviewTimeStamp = (
  review1: IReview,
  review2: IReview
): number => {
  if (review2?.created_at && review1?.created_at) {
    return new Date(review2.created_at).getTime() - new Date(review1.created_at).getTime();
  }
  return 0;
};

export const newestReviewsFn = (reviews: IReview[]) => {
  const reviewsWithTimeStamp = reviews?.map((reviews) => {
    return {
      ...reviews,
      timeStamp: getTimeStamp(reviews.created_at!),
    };
  });
  return reviewsWithTimeStamp?.sort(sortByReviewTimeStamp);
};

export const newestBusinessesFn = (businesses: IBusiness[]) => {
  const businessesWithTimeStamp = businesses?.map((businesses) => {
    return {
      ...businesses,
      timeStamp: getTimeStamp(businesses.created_at!),
    };
  });
  return businessesWithTimeStamp?.sort(sortByBusinessTimeStamp);
};

