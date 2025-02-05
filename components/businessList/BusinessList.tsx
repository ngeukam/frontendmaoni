import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import Card from "../UI/card/Card";
import Sort from "./Sort";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { SortedBusinessesListActions } from "../../store/sortedBusinessList-slice";
import { IBusinessListRootState } from "../../lib/types/businessList";
import { IBusiness } from "../../lib/types/business";
import { getFilteredBusinesses } from "../../utilities/getFilteredBusinesses";
import dynamic from "next/dynamic";
import Breadcrumb from "../UI/Breadcrumb";
const FilterOptions = dynamic(() => import('./FilterOptions'), { ssr: false });

interface Props {
  businessList: IBusiness[];
  categoryName: string;
}

const BusinessList: React.FC<Props> = ({ businessList, categoryName }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedRadioBtn, setSelectedRadioBtn] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { country, city } = router.query; // Only get country and city

  const shouldHideFilterOptions = !!city; // Hide ONLY if BOTH country AND city are present

  useEffect(() => {
    const filteredBusinesses = getFilteredBusinesses(businessList, selectedCountry, selectedCity);

    dispatch(
      SortedBusinessesListActions.sortBusinessesList({
        businessesList: filteredBusinesses,
        sortBasedOn: selectedRadioBtn,
      })
    );
  }, [dispatch, businessList, selectedRadioBtn, selectedCountry, selectedCity]);

  const sortedBusinessList = useSelector(
    (state: IBusinessListRootState) => state.sortedBusinessesList.businessesList
  );

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedRadioBtn(e.currentTarget.id);
  }

  return (
    <div>
      <Breadcrumb />
      <h2 className="text-2xl font-bold text-center text-palette-primary mb-6">
        {categoryName}
      </h2>
      <div className="w-full xl:max-w-[2100px] mx-auto">
        <div>
          {router.isReady && !shouldHideFilterOptions && (<FilterOptions
            businessList={businessList}
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            onCountryChange={(country) => setSelectedCountry(country)}
            onCityChange={(city) => setSelectedCity(city)}
            t={t} // Pass the translation function
          />
          )}
          <Sort
            selectedBtn={selectedRadioBtn}
            onChangeSelectedBtn={onChangeHandler}
          />
          {sortedBusinessList.length > 0 ? (
            <div className="grid gap-4 md:gap-2 grid-cols-6 md:grid-cols-12">
              {sortedBusinessList.map((business: IBusiness) => {
                return <Card key={business.id} business={business} />;
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center mt-12">
              <p className="text-palette-mute text-center">
                {t.noBusiness || "No businesses found in this category."}
              </p>
              <button
                onClick={() => router.push("/categories")}
                className="mt-4 px-4 py-2 bg-palette-primary text-white rounded hover:bg-palette-secondary"
              >
                {t.backToCategories || "Go Back to Categories"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
