import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const DeviceScanner = ({ onScan, isScanning }) => {
  return (
    <button
      className="w-full p-2 mb-4 bg-blue-500 text-white rounded-md flex items-center justify-center"
      onClick={onScan}
      disabled={isScanning}
    >
      <ArrowPathIcon className="w-5 h-5 mr-2" />
      {isScanning ? 'Scanning...' : 'Scan for Devices'}
    </button>
  );
};

export default DeviceScanner;