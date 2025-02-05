import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Input, { IImperativeHandler } from "../UI/Input";
import { useLanguage } from "../../hooks/useLanguage";
import { IUser } from "../../lib/types/user";
import CountriesDropDown from "../UI/CountriesDropDown";
import CityAutocomplete from "./CityAutocomplete";
import BusinessNameAutocomplete from "./BusinessNameAutocomplete";
import africanCountries from "../../utilities/countries";
import { IBusiness } from "../../lib/types/business";
import { toast } from "react-toastify";
import CategoriesDropDown from "../UI/CategoriesDropDown";
import GoBackButton from "../UI/GoBackButton";

interface Props {
  title: "login" | "signUp";
  submitHandler: (user: IUser, business?: IBusiness) => void;
  buscategories: { name: string; id: string }[];
  errorMessage?: string;
  loading: boolean;
  success: boolean;
}
const EnteringBox: React.FC<Props> = ({
  title,
  submitHandler,
  buscategories,
  errorMessage,
  loading,
  success,
}) => {
  const passwordRef = useRef<IImperativeHandler | null>(null);
  const emailRef = useRef<IImperativeHandler | null>(null);
  const websiteRef = useRef<IImperativeHandler | null>(null);
  const cityRef = useRef<HTMLInputElement | null>(null);
  const errorMessageRef = useRef<HTMLSpanElement | null>(null);
  const { t } = useLanguage();
  const [inputBusinessName, setInputBusinessName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isWebsiteValid, setIsWebsiteValid] = useState(false);

  const handleCitySelect = (city: string) => {
    if (cityRef.current) {
      cityRef.current.value = city;
    }
  };
  const handleBusinessNameSelect = (name: string) => {
    setInputBusinessName(name);
  };

  if (errorMessage) {
    title === "signUp" ? emailRef.current?.focus() : null;
    passwordRef.current?.focus();
  }

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.getValue();
    const password = passwordRef.current?.getValue();
    const website = websiteRef.current?.getValue();

    if (!email || !isEmailValid) {
      return toast.error(t.emailError);
    }
    if (!password || !isPasswordValid) {
      return toast.error(t.passwordError);
    }
    if(website && !isWebsiteValid){
      return toast.error(t.websiteError);
    }
    const user: IUser = {
      email: email.toLowerCase(),
      password,
      role: title === "signUp" ? "manager" : undefined,
    };

    let business: IBusiness | null = null;
    if (title === "signUp") {
      if (!inputBusinessName || !selectedCategory || !selectedCountry || !cityRef.current?.value) {
        return toast.error(t.requiredFieldsError);
      }
      business = {
        name: inputBusinessName.trim(),
        category_id: selectedCategory.id,
        country: selectedCountry,
        city: cityRef.current?.value,
        website: websiteRef.current?.getValue() || "",
        isverified: true,
      };
    }

    submitHandler(user, business || undefined);
  };
  useEffect(() => {
    if (success) {
      setInputBusinessName("");
      setSelectedCategory({
        name: "",
        id: ""
      });
      setSelectedCountry("");
    }
    emailRef.current?.clear();
    passwordRef.current?.clear();
    websiteRef.current?.clear();
  }, [success]);


  return (
    <>
      {(title === "signUp" || "login") && <GoBackButton />}
      <div className="flex flex-col items-center justify-center mt-6">
        <div className="w-full md:w-[50%] max-w-[500px] border-2 bg-palette-card shadow-lg py-4 px-8 rounded-lg">
          <h2 className="text-lg md:text-2xl font-bold">{t[title]}</h2>
          <p className="mt-4 mb-2">
            {t.hi}
            {/* {title === "signUp" ? (
              <>
                <br />
                <span className="inline-block text-palette-mute dark:text-palette-base/80 text-[12px] mt-2 bg-palette-fill p-2">
                  {t.loginExplanation}
                </span>
              </>
            ) : null} */}
          </p>
          <form onSubmit={onSubmitHandler}>
            <div className="mt-6">
              {title === "signUp" ? (
                <>
                  <h3 className="text-lg font-semibold mb-8">{t.businessRegistration}</h3>
                  <div>
                    <BusinessNameAutocomplete
                      onSelect={handleBusinessNameSelect}
                      id="businessName"
                      required={true}
                      placeholder="enterBusinessName"
                    />
                    <CategoriesDropDown
                      title="selectBusinessCategory"
                      data={buscategories}
                      required={true}
                      placeholder="enterBusinessCategory"
                      onChange={(category) => setSelectedCategory(category)}
                    />
                    <CountriesDropDown
                      title="selectBusinessCountry"
                      data={africanCountries.map((c) => c.name)}
                      required={true}
                      placeholder="enterBusinessCountry"
                      onChange={(country) => {
                        const countryCode = africanCountries.find(
                          (c) => c.name === country
                        )?.code;
                        setSelectedCountry(countryCode || null);
                      }}
                    />
                    <CityAutocomplete
                      onCitySelect={handleCitySelect}
                      selectedCountry={selectedCountry}
                      id="selectBusinessCity"
                      type="text"
                      placeholder="enterbusinessCityName"
                      required={true}
                      readonly={selectedCountry ? false : true}
                    />
                    <input type="text" ref={cityRef} hidden />
                    <Input
                      ref={websiteRef}
                      type="text"
                      id="businessWebsite"
                      placeholder="enterBusinessWebsite"
                      validationType="website"
                      onValidate={setIsWebsiteValid}
                      validateWebsite
                      required={false}
                    />
                  </div>
                </>

              ) : null}
              {title === "signUp" && (<h3 className="text-lg font-semibold mt-6 mb-6">{t.yourPersonalInfo}</h3>)}
              <div className="mt-4">
                <Input
                  ref={emailRef}
                  type="email"
                  id="email"
                  placeholder="enterYourEmail"
                  validationType="email"
                  onValidate={setIsEmailValid}
                  validateEmail
                  required
                />
                <Input
                  ref={passwordRef}
                  type="password"
                  id="password"
                  placeholder="enterYourPassword"
                  validationType="password"
                  onValidate={setIsPasswordValid}
                  validatePassword
                  minLength={8}
                  required
                />
              </div>
            </div>
            {errorMessage && (
              <span
                ref={errorMessageRef}
                className="text-rose-600 block -mt-4 mb-4"
              >
                {t.errorMessage ? t.errorMessage : errorMessage}
              </span>
            )}

            <button
              type="submit"
              disabled={loading || !isEmailValid || !isPasswordValid}
              className="bg-palette-primary w-full py-4 rounded-lg text-palette-side text-xl shadow-lg flex items-center justify-center focus:outline-none disabled:bg-red-300"
            >
              {loading ? <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                : t[title]}
            </button>
          </form>
          <Link href={title === "login" ? "/businessSpace/signup" : "/businessSpace/login"}>
            <a className="block mt-4 text-sm">
              {title === "login" ? t.doHaveAnAccount : t.alreadyHaveAnAccount}{" "}
              <span className="text-cyan-500 text-lg">{t[title === "login" ? "signUp" : "login"]}</span>
            </a>
          </Link>
        </div>
      </div>
    </>
  );

};

export default EnteringBox;
