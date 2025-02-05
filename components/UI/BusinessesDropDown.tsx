import React, { useState, forwardRef, useRef } from "react";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { Transition } from "react-transition-group";
import { useLanguage } from "../../hooks/useLanguage";
import capitalizeWords from "../../utilities/capitalize";

interface Props {
    title: string;
    data: { id: string; name: string; city:string; countrynamecode:string; }[]; // Array of businesses
    required: boolean;
    placeholder: string;
    onChange: (businesses: { id: string; name: string }[]) => void; // Callback for selected businesses
}

const BusinessesDropDown = forwardRef<HTMLDivElement, Props>(
    ({ title, data = [], required, placeholder, onChange }, ref) => {
        const [openDropdown, setOpenDropdown] = useState(false);
        const [selectedBusinesses, setSelectedBusinesses] = useState<
            { id: string; name: string }[]
        >([]);
        const [searchTerm, setSearchTerm] = useState("");
        const nodeRef = useRef<HTMLDivElement>(null);
        const { t } = useLanguage();
        const ArrowDirection = !openDropdown ? HiChevronDown : HiChevronUp;

        if (!Array.isArray(data)) {
            console.error("Invalid data passed to Dropdown4:", data);
            return <div>Data format is incorrect. Expected an array.</div>;
        }

        const filteredData = data.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const handleSelect = (business: { id: string; name: string }) => {
            const isSelected = selectedBusinesses.some(
                (item) => item.id === business.id
            );
            const updatedBusinesses = isSelected
                ? selectedBusinesses.filter((item) => item.id !== business.id)
                : [...selectedBusinesses, business];

            setSelectedBusinesses(updatedBusinesses);
            onChange(updatedBusinesses);
        };

        const handleRemove = (id: string) => {
            const updatedBusinesses = selectedBusinesses.filter(
                (item) => item.id !== id
            );
            setSelectedBusinesses(updatedBusinesses);
            onChange(updatedBusinesses);
        };

        return (
            <div className="relative mb-8" ref={ref}>
                {/* Dropdown Header */}
                <div
                    className="w-full py-4 px-6 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md relative dark:border-slate-200 dark:bg-palette-card dark:text-white"
                    onClick={() => setOpenDropdown((prevState) => !prevState)}
                >
                    <h3
                        className={`absolute top-[-12px] left-3 bg-palette-card px-2 text-[16px] transition-all ${
                            openDropdown || selectedBusinesses.length
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-inherit"
                        }`}
                    >
                        {required && (
                            <span className="text-rose-700 mx-1">*</span>
                        )}
                        {t[`${title}`]}
                    </h3>
                    <div className="flex justify-between items-center">
                        <span className="flex flex-wrap gap-2 text-[16px] text-gray-400 dark:text-gray-500">
                            {selectedBusinesses.length > 0
                                ? selectedBusinesses.map((business) => (
                                      <span
                                          key={business.id}
                                          className="inline-flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded dark:bg-gray-600 dark:text-white"
                                      >
                                          {t[`${business.name}`] ||
                                              business.name}
                                          <button
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRemove(business.id);
                                              }}
                                              className="ml-2 text-red-600 dark:text-red-400"
                                          >
                                              &times;
                                          </button>
                                      </span>
                                  ))
                                : t[`${placeholder}`]}
                        </span>
                        <ArrowDirection style={{ fontSize: "1.5rem" }} />
                    </div>
                </div>

                {/* Dropdown List */}
                <Transition
                    mountOnEnter
                    unmountOnExit
                    in={openDropdown}
                    timeout={300}
                    nodeRef={nodeRef}
                >
                    {(state) => (
                        <div
                            ref={nodeRef}
                            className={`origin-top px-2 border border-slate-400 bg-white rounded-lg shadow-lg transition-transform dark:bg-gray-700 dark:border-slate-600 dark:text-white ${
                                state === "entering"
                                    ? "scale-y-100 opacity-100"
                                    : state === "entered"
                                    ? "scale-y-100 opacity-100"
                                    : "scale-y-0 opacity-0"
                            }`}
                        >
                            {/* Search Input */}
                            <div className="p-2">
                                <input
                                    type="text"
                                    placeholder={t[`${placeholder}`]}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-slate-600"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    required={required}
                                />
                            </div>
                            {/* Filtered Data */}
                            {filteredData.map((business) => (
                                <div
                                    className={`py-3 px-6 hover:bg-slate-100 cursor-pointer dark:hover:bg-gray-600 ${
                                        selectedBusinesses.some(
                                            (item) => item.id === business.id
                                        )
                                            ? "bg-gray-200 dark:bg-gray-600"
                                            : ""
                                    }`}
                                    key={business.id}
                                    onClick={() => handleSelect(business)}
                                >
                                    {capitalizeWords(business.name)} • 
                                    {business.city} • 
                                    {business.countrynamecode}
                                </div>
                            ))}
                            {filteredData.length === 0 && (
                                <div className="py-3 px-6 text-gray-500 dark:text-gray-400">
                                    No results found
                                </div>
                            )}
                        </div>
                    )}
                </Transition>
            </div>
        );
    }
);


BusinessesDropDown.displayName = "BusinessesDropDown";
export default BusinessesDropDown;
