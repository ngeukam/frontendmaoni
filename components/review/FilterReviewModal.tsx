import React, { useState } from "react";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: { searchTerm: string; selectedRating: number | null; dateFilter: string }) => void;
    t: any; // Pour la traduction
}

const FilterReviewModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters, t }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [dateFilter, setDateFilter] = useState<string>(""); // Filtrage par date

    const handleApplyFilters = () => {
        onApplyFilters({ searchTerm, selectedRating, dateFilter });
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-semibold mb-4">{t["filterOptions"]}</h3>

                        {/* Recherche par texte */}
                        <div className="mb-4">
                            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">
                                {t["searchPlaceholder"]}
                            </label>
                            <input
                                id="searchTerm"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder={t["searchPlaceholder"]}
                            />
                        </div>

                        {/* Filtre par note */}
                        <div className="mb-4">
                            <label htmlFor="ratingFilter" className="block text-sm font-medium text-gray-700">
                                {t["rating"]}
                            </label>
                            <select
                                id="ratingFilter"
                                value={selectedRating || ""}
                                onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : null)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">{t["allRatings"]}</option>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} {t["stars"]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre par date */}
                        <div className="mb-4">
                            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">
                                {t["datePublished"]}
                            </label>
                            <select
                                id="dateFilter"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">{t["allReviews"]}</option>
                                <option value="last30Days">{t["last30Days"]}</option>
                                <option value="last3Months">{t["last3Months"]}</option>
                                <option value="last6Months">{t["last6Months"]}</option>
                                <option value="last12Months">{t["last12Months"]}</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-md text-sm text-gray-800"
                            >
                                {t["cancel"]}
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                            >
                                {t["applyFilters"]}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterReviewModal;
