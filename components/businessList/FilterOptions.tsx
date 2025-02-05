import React from 'react';
import { IBusiness } from "../../lib/types/business";
import Select from 'react-select';

interface FilterOptionsProps {
    businessList: IBusiness[];
    selectedCountry: string | null;
    selectedCity: string | null;
    onCountryChange: (country: string | null) => void;
    onCityChange: (city: string | null) => void;
    t: any; // Type for your translation function
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ businessList, selectedCountry, selectedCity, onCountryChange, onCityChange, t }) => {

    // Create country options using countrynamecode for display, but value is the abbreviation (country)
    const countries = businessList && Array.isArray(businessList) && businessList.length > 0 
    ? Array.from(
        businessList.reduce((map, business) => {
          if (business.country && business.countrynamecode && !map.has(business.country)) {
            map.set(business.country, { value: business.country, label: business.countrynamecode });
          }
          return map;
        }, new Map()).values()
      ).sort((a, b) => (a.label ?? '').localeCompare(b.label ?? ''))
    : [];
  
    const cities = selectedCountry && businessList && Array.isArray(businessList) && businessList.length > 0 
    ? Array.from(new Set(
        businessList
          .filter(business => business.country === selectedCountry && business.city)
          .map(business => business.city)
      )).map(city => ({ value: city, label: city }))
    : [];

    const handleCountryChange = (selectedOption: { value: string; label: string } | null) => {
        onCountryChange(selectedOption ? selectedOption.value : null); // Pass the abbreviation (value)
    };

    const handleCityChange = (selectedOption: { value: string; label: string } | null) => {
        onCityChange(selectedOption ? selectedOption.value : null);
    };

    return (
        <div className="flex flex-col md:flex-row"> {/* Added flex container */}
            <div className="mb-4 md:mb-0 md:mr-4 w-full md:w-1/2"> {/* Added margin and width for larger screens */}
                <label htmlFor="country">{t.country || "Country"}:</label><br />
                <Select
                    id="country"
                    options={countries}
                    value={selectedCountry ? countries.find(c => c.value === selectedCountry) : null} // Find the correct option object
                    onChange={handleCountryChange}
                    isClearable
                    placeholder={t.selectCountry || "Select a country"}
                />
            </div>
            <div className="mb-4 md:mb-0 w-full md:w-1/2">
                <label htmlFor="city">{t.city || "City"}:</label><br />
                <Select
                    id="city"
                    options={cities}
                    value={selectedCity ? { value: selectedCity, label: selectedCity } : null}
                    onChange={handleCityChange}
                    isClearable
                    placeholder={t.selectCity || "Select a city"}
                    isDisabled={!selectedCountry}
                />
            </div>
        </div>
    );
};

export default FilterOptions;