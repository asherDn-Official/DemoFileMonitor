export const SummaryCard= ({ 
  count, 
  label, 
  bgColor, 
  textColor = 'text-white' 
}) => {
  return (
    <div className={`${bgColor} ${textColor}  py-3 pl-2 pr-20 rounded-lg shadow-sm cursor-pointer`}>
      <div className="text-2xl font-bold mb-1">{count} Device</div>
      <div className="text-sm opacity-90  text-black  font-semibold ">{label}</div>
    </div>
  );
};