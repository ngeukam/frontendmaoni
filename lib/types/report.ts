import { IBusiness } from "./business";

export interface Report {
    title: string;
    description: string;
    url: string;
    business:IBusiness
}