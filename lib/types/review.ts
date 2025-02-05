import { IBusiness } from "./business";
import { IComment } from "./comment";

export interface IReview {
    id: string; // UUID
    text?: string | null; // Optional, can be null
    title?: string | null;
    record?: string | null; // URL or path to the file
    evaluation?: number | null; // Float, optional
    business?: IBusiness;
    comments: IComment[];
    business_id?: string;
    sentiment?: string | null; // Sentiment analysis result
    score?: number | null; // Float, optional
    latitude?: number | null; // Latitude
    longitude?: number | null; // Longitude
    share?: boolean; // Share status
    expdate?: string | null; // Expiration date as a string
    authorname?: string | null; // Author's name
    contact?: string | null; // Author's phone number
    authorcountry?: string | null; // Author's country
    language_code?: string | null; // Language code for analysis, e.g., 'fr-FR'
    active: boolean; // Indicates if the review is active
    updated_at: string; // ISO date string of last update
    created_at: string; // ISO date string of creation
  }