import { IReview } from "./review";

export interface IReviewList {
  reviewsList: IReview[] | [];
}

export interface IReviewListRootState {
  sortedReviewsList: IReviewList;
}
