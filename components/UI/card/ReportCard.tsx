// ReportCard.tsx (New Component)
import React, { useState } from 'react';
import { Report } from '../../../lib/types/report';
import { useLanguage } from '../../../hooks/useLanguage';


interface ReportCardProps {
    reports: Report[];
    reportsPerPage?: number;
}

const ReportCard: React.FC<ReportCardProps> = ({ reports, reportsPerPage = 4 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const {t} = useLanguage()
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    if (!Array.isArray(reports)) {
        return null; // Or return some default value or handle the error
    }
    
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const totalPages = Math.ceil(reports.length / reportsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pageNumbers = [];

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center mt-4">
                {pageNumbers}
            </div>
        );
    };

    return (
        <div className="bg-white mt-4 rounded-lg shadow-md p-4 dark:border-slate-200 dark:bg-palette-card dark:text-white">
            <h2 className="text-xl font-bold mb-4 dark:text-blue-400">{t.reports || "Reports"}</h2>
            <div className="flex flex-wrap -mx-2">
                {Array.isArray(currentReports) && currentReports.map((report, index) => (
                    <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 py-4">
                        <div className="border rounded p-4 h-full dark:border-slate-700 shadow transition duration-300 hover:scale-105 hover:shadow-lg"> {/* Added shadow, transition, and hover effects */}
                            <h3 className="font-semibold text-lg dark:text-white truncate">{report.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{report.description}</p>
                            {/* Add company, country, and city information */}
                            <div className="mt-2">
                                <p className="text-sm dark:text-white">
                                    <strong>{t.company || "Company"}:</strong> {report.business?.name || "N/A"} {/* Replace with your data field */}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>{t.country || "Country"}:</strong> {report.business?.countrynamecode || "N/A"} {/* Replace with your data field */}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>{t.city || "City"}:</strong> {report.business?.city || "N/A"} {/* Replace with your data field */}
                                </p>
                            </div>
                            <a
                                href={report.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
                            >
                                {t.download || "Download"}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {renderPagination()}
        </div>
    );
};

export default ReportCard;