import { IBusiness } from "./business";

export interface IBusinessList {
  businessesList: IBusiness[] | [];
}

export interface IBusinessListRootState {
  sortedBusinessesList: IBusinessList;
}
