import React, { useEffect, useRef, forwardRef } from "react";
import { useLanguage } from "../../hooks/useLanguage";
interface CityAutocompleteProps {
    onCitySelect: (city: string) => void;
    selectedCountry: string | null;
    id: string;
    type: string;
    placeholder?: string;
    classes?: string;
    readonly?: boolean;
    title?: string;
    required?: boolean;
}

const CityAutocomplete = forwardRef<HTMLInputElement, CityAutocompleteProps>(
    (props, ref) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const { t } = useLanguage();
        useEffect(() => {
            if (!inputRef.current || typeof google === "undefined") return;

            const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
                types: ["(cities)"],
                componentRestrictions: props.selectedCountry
                    ? { country: props.selectedCountry }
                    : undefined,
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.address_components) {
                    const city = place.address_components[0]?.long_name;
                    props.onCitySelect(city);
                }
            });
        }, [props.selectedCountry]);

        return (
            <div className="relative mb-8">
                <label
                    className="absolute -top-[30%] ltr:left-3 rtl:right-3 bg-palette-card p-[0.3rem] whitespace-nowrap"
                    htmlFor={props.id}
                >
                    {props.required ? (
                        <span className="text-rose-700 mx-1 mt-1">*</span>
                    ) : null}
                    {t[`${props.id}`]}
                </label>
                <input
                    ref={(node) => {
                        inputRef.current = node;
                        if (typeof ref === "function") {
                            ref(node);
                        } else if (ref) {
                            (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                        }
                    }}
                    id={props.id}
                    type={props.type || "text"}
                    readOnly={props.readonly || false}
                    placeholder={t[`${props.placeholder}`]}
                    className={`w-full py-4 px-6 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md ${props.classes || ""
                        }`}
                    title={props.title || ""}
                    required={props.required || false}
                />
            </div>
        );
    }
);

CityAutocomplete.displayName = "CityAutocomplete"; 
export default CityAutocomplete;
