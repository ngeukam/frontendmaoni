import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IReview } from "../lib/types/review";
import { IReviewList } from "../lib/types/reviewList";

const initialState: IReviewList = {
  reviewsList: [],
};

const newestReviewsSlice = createSlice({
  name: "newestReviews",
  initialState,
  reducers: {
    addReviews(state, action: PayloadAction<IReview[]>) {
      state.reviewsList = action.payload;
    },
  },
});

export const newestReviewsActions = newestReviewsSlice.actions;

export default newestReviewsSlice.reducer;
