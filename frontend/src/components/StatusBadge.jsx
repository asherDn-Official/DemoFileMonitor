import React from 'react';



export const StatusBadge = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    // Handle undefined/null/empty status
    if (!status) return 'bg-gray-500 text-white';

    // Normalize the status string
    const normalizedStatus = status.toString().toLowerCase().trim();

    switch (normalizedStatus) {
      case 'yes':
        return 'bg-[#19CD40] text-white';
      case 'no':
        return 'bg-[#D20C2D] text-white';
      case 'nc':
      case 'fc':  // fc is treated same as nc
        return 'bg-[#DD9804] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getDisplayText = () => {
    if (!status) return 'UNKNOWN';
    return status.toString().toUpperCase();
  };

  return (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getStatusStyles()} ${className}`}
    >
      {getDisplayText()}
    </span>
  );
};