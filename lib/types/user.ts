import { ICategory } from "./categories";

export interface IManyToManyUserBusiness {
  business_id?: string;
  is_active?: boolean
}

export interface IUser {
  id?: any;
  password?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  business_ids?: string[];
  business_data?: IManyToManyUserBusiness[];
  access_token?: string;
  refresh_token?: string;
  currentPassword?:string,
  newPassword?:string,
  confirmPassword?:string
}

export interface IUserBusiness {
  id: string;
  name: string;
  countrynamecode: string;
  logo?: string;
  city: string;
  category?: ICategory;
  active_codes?: [];
  inactive_codes?: [];
  showeval?: boolean;
  showreview?: boolean;
  total_evaluation?:number;
}

export interface IUserInfo {
  userInformation: IUser | null;
}

//RootState interface=> used for state type in useSelector hook

export interface IUserInfoRootState {
  userInfo: IUserInfo;
}
