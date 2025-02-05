import React, { useState, forwardRef, useRef, useEffect } from "react";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { Transition } from "react-transition-group";
import { useLanguage } from "../../hooks/useLanguage";

interface Props {
    title: string;
    data: { name: string; id: string }[];
    required: boolean;
    placeholder: string;
    onChange: (category: { id: string; name: string } | null) => void;
    defaultValue?: { id: string; name: string }; // Nouvelle prop
}

const CategoriesDropDown = forwardRef<HTMLDivElement, Props>(
    ({ title, data, required, placeholder, onChange, defaultValue }, ref) => {
        const [openDropdown, setOpenDropDown] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(
            defaultValue || null // Initialise avec la valeur par défaut
        );
        const [searchTerm, setSearchTerm] = useState("");
        const nodeRef = useRef<HTMLDivElement>(null);
        const { t } = useLanguage();
        const ArrowDirection = !openDropdown ? HiChevronDown : HiChevronUp;

        useEffect(() => {
            setSelectedCategory(defaultValue || null);
        }, [defaultValue]);

        const handleSelect = (category: { id: string; name: string }) => {
            setSelectedCategory(category);
            onChange(category); // Passe l'objet sélectionné au parent
            setOpenDropDown(false);
        };

        const filteredData = data.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="relative mb-8" ref={ref}>
                {/* Dropdown Header */}
                <div
                    className="w-full py-4 px-6 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md relative dark:border-slate-200 dark:bg-palette-card dark:text-white"
                    onClick={() => setOpenDropDown((prevState) => !prevState)}
                >
                    <h3
                        className={`absolute top-[-12px] left-3 bg-palette-card px-2 text-[16px] transition-all ${
                            openDropdown || selectedCategory ? "text-gray-700 dark:text-gray-300" : "text-inherit"
                        }`}
                    >
                        {required && <span className="text-rose-700 mx-1">*</span>}
                        {t[`${title}`]}
                    </h3>
                    <div className="flex justify-between items-center">
                        <span
                            className={`text-[16px] ${selectedCategory ? "text-inherit" : "text-gray-400 dark:text-gray-500"}`}
                        >
                            {selectedCategory ? (t[`${selectedCategory.name}`] || selectedCategory.name) : t[`${placeholder}`]}
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
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    required={required}
                                />
                            </div>
                            {/* Filtered Data */}
                            {filteredData.map((category, index) => (
                                <div
                                    className="py-3 px-6 hover:bg-slate-100 cursor-pointer dark:hover:bg-gray-600"
                                    key={`${category.id}-${index}`}
                                    onClick={() => handleSelect(category)}
                                >
                                    {t[`${category.name}`] || category.name}
                                </div>
                            ))}
                            {filteredData.length === 0 && (
                                <div className="py-3 px-6 text-gray-500 dark:text-gray-400">No results found</div>
                            )}
                        </div>
                    )}
                </Transition>
            </div>
        );
    }
);

CategoriesDropDown.displayName = "CategoriesDropDown";
export default CategoriesDropDown;
