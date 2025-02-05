import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBusinessList } from "../lib/types/businessList";
import { sortByPoPularity } from "../utilities/sortByPopularity";
import { IBusiness } from "../lib/types/business";
import { newestBusinessesFn } from "../utilities/sortByTimeStamp";

const initialState: IBusinessList = {
  businessesList: [],
};

const SortedBusinessesListSlice = createSlice({
  name: "sortedBusinessesList",
  initialState,
  reducers: {
    sortBusinessesList(
      state,
      action: PayloadAction<{ businessesList: IBusiness[]; sortBasedOn: string }>
    ) {
      switch (action.payload.sortBasedOn) {
        case "all":
          state.businessesList = action.payload.businessesList;
          break;
        case "newest": {
          if (Array.isArray(state.businessesList)) {
            state.businessesList = newestBusinessesFn(state.businessesList);
            break;
          } else {
            state.businessesList = []; // Réinitialiser si le type est incorrect
            break;
          }
        }
        case "popular": {
          if (Array.isArray(state.businessesList)) {
            state.businessesList = state.businessesList.sort(sortByPoPularity);
            break;
          } else {
            state.businessesList = []; // Réinitialiser si le type est incorrect
            break;
          }
        }
      }
    },
  },
});
export const SortedBusinessesListActions = SortedBusinessesListSlice.actions;

export default SortedBusinessesListSlice.reducer;
