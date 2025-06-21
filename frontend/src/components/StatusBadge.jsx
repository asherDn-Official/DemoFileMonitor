export const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'yes':
        return 'bg-[#19CD40] text-white';
      case 'no':
        return 'bg-[#D20C2D] text-white';
      case 'nc':
        return 'bg-[#DD9804] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyles()}`}>
      {status.toUpperCase()}
    </span>
  );
};