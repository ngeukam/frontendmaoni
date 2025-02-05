import { IBusiness } from "./business";

export interface ICollaborator {
    id?: any;
    email?: string;
    role?: string;
    businesses?: IBusiness[];
    is_active?:boolean;
  }
  
  