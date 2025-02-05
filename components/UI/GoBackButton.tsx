import React from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';

const GoBackButton: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="mb-2 p-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md focus:outline-none" // Removed border, padding adjusted, dark mode hover
    >
      <FaArrowLeft size={20} className="text-gray-600 dark:text-white" /> {/* Added dark mode to icon */}
    </button>
  );
};

export default GoBackButton;