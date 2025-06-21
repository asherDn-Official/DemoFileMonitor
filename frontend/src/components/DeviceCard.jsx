import React from 'react';
import { StatusBadge } from './StatusBadge';



export const DeviceCard = ({ device }) => {
  
  const getHeaderColor = (device) => {
  // First check if device and device.Connected exist
  if (!device?.Connected) return 'bg-[#D20C2D]'; // Default color
  
  const status = device.Connected.toLowerCase();
  
  if (status === 'yes') return 'bg-[#19CD40]';
  if (status === 'fc') return 'bg-[#DD9804]';
  return 'bg-[#D20C2D]';
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden  min-w-[300px] cursor-pointer ">
      <div className={`${getHeaderColor(device)} text-white p-3`}>
        <div className="font-semibold text-sm">Device Id : {device.Deviceid}</div>
      </div>
      
      <div className="p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Date :</span>
          <span className="font-medium">{formatDate(device.Date)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Time :</span>
          <span className="font-medium">{device.Time}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Operator 1 :</span>
          <StatusBadge status={device['operator 1']} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Operator 2 :</span>
          <StatusBadge status={device.Operator2} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">MAT 1 :</span>
          <StatusBadge status={device.Mat1} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">MAT 2 :</span>
          <StatusBadge status={device.Mat2} />
        </div>
      </div>
    </div>
  );
};