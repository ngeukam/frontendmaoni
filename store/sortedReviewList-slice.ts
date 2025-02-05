import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IReviewList } from "../lib/types/reviewList";
import { newestReviewsFn } from "../utilities/sortByTimeStamp";
import { IReview } from "../lib/types/review";

const initialState: IReviewList = {
  reviewsList: [],
};

const sortedReviewsListSlice = createSlice({
  name: "sortedReviewsList",
  initialState,
  reducers: {
    sortReviewsList(
      state,
      action: PayloadAction<{ reviewsList: IReview[]; sortBasedOn: string }>
    ) {
      switch (action.payload.sortBasedOn) {
        case "all":
          state.reviewsList = action.payload.reviewsList;
          break;
        case "newest": {
          state.reviewsList = newestReviewsFn(state.reviewsList);
          break;
        }
      }
    },
  },
});
export const sortedReviewsListActions = sortedReviewsListSlice.actions;

export default sortedReviewsListSlice.reducer;
