import React, { useState } from 'react'
import { IReview } from '../../../lib/types/review'
import { Table, TableBody, TableCell, TableHeader, TableRow } from './Table'
import { AiOutlineDelete, AiOutlineDownload } from 'react-icons/ai'
import { formatDateTime } from '../../../utilities/formatDateTime'
import { exportToExcel, exportToJson } from '../../../utilities/downloadExcel'
import { useLanguage } from '../../../hooks/useLanguage'


interface Props {
  reviewsData: IReview[];
  handleDeleteReview: (id: string) => void;
  reviewsPerPage?: number;
}
const ReviewsDataTable: React.FC<Props> = ({ reviewsData, handleDeleteReview, reviewsPerPage = 10 }) => {
  const { t } = useLanguage();
  const handleExcelExport = () => {
    exportToExcel(reviewsData, 'reviews'); // Pass the data and filename
  };

  const handleJsonExport = () => {
    exportToJson(reviewsData, 'reviews'); // Pass the data and filename
  };

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastReview = currentPage * (reviewsPerPage);
  const indexOfFirstReview = indexOfLastReview - (reviewsPerPage);
  if (!Array.isArray(reviewsData)) {
    return null;
  }
  const currentReviews = reviewsData.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviewsData.length / (reviewsPerPage));

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
          className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
    <div>
      <h2 className="text-xl items-center mt-4 font-semibold mb-2">{t.customersReviews || "Customers reviews"}</h2>
      <div className="flex justify-end mb-4"> {/* Container for the buttons */}
        <button onClick={handleExcelExport} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
          <AiOutlineDownload className="mr-2 inline-block" /> Excel
        </button>
        <button onClick={handleJsonExport} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <AiOutlineDownload className="mr-2 inline-block" /> JSON
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell width="8%">{t.author || "Author"}</TableCell>
            <TableCell width="15%">{t.title || "Title"}</TableCell>
            <TableCell width="20%">{t.createdAt || "Created at"}</TableCell>
            <TableCell width="12%">{t.expDate || "Exp. Date"}</TableCell>
            <TableCell width="40%">{t.review || "Review"}</TableCell>
            <TableCell width="5%">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentReviews.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.contact ? `${row.authorname} • ${row.contact}` : row.authorname}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{formatDateTime(row.created_at)}</TableCell>
              <TableCell>{row.expdate}</TableCell>
              <TableCell>{row.text}</TableCell>
              <TableCell> <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the button click from propagating to the row click
                  handleDeleteReview(row.id);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <AiOutlineDelete size={25} />
              </button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {renderPagination()}
    </div>
  )
}

export default ReviewsDataTable