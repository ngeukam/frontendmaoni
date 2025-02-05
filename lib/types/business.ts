import { ICategory } from "./categories";
import { IReview } from "./review";

export interface IBusiness {
    id?: string;
    name?: string;
    logo?: File | string | null;
    category?: ICategory;
    category_id?: string;
    category_name?:string;
    country?: string | null;
    countrynamecode?: string;
    city?: string;
    website?: string;
    phone?: string;
    email?: string;
    description?: string;
    total_reviews?: number;
    total_evaluation?: number;
    btype?: string | null;
    active?: boolean;
    showeval?: boolean;
    showreview?: boolean;
    isverified?: boolean;
    created_at?: string;
    updated_at?: string;
  }
  export interface IBusinessReview {
    id: string;
    name: string;
    country: string;
    city: string;
    website: string;
    category?: ICategory; // The full category object
    logo: string;
    title: string;
    btype: string;
    reviews: IReview[];
    isverified: boolean;
    total_reviews: number;
    total_evaluation: number;
    has_reviews: boolean
    created_at: string;
    expdate: string
  }
  export interface IBusinessInfo {
    businessInformation: IBusiness | null;
  }
  
  // RootState interface => used for state type in useSelector hook
  export interface IBusinessInfoRootState {
    businessInfo: IBusinessInfo;
  }
  