import { IBusiness } from "../lib/types/business";

export const getFilteredBusinesses = (
    businessList: IBusiness[],
    selectedCountry: string | null,
    selectedCity: string | null
): IBusiness[] => {  // Type the return value (TypeScript)
    let filteredBusinesses = businessList;

    if (selectedCountry) {
        filteredBusinesses = filteredBusinesses.filter(
            (business) => business.country === selectedCountry
        );
    }

    if (selectedCity) {
        filteredBusinesses = filteredBusinesses.filter(
            (business) => business.city === selectedCity
        );
    }

    return filteredBusinesses;
};