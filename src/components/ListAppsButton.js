import React, { useState } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';

const ListAppsButton = ({ onListApps, isListing, disabled, backendUrl, selectedDevice }) => {
  const [apps, setApps] = useState([]);

  const handleListApps = async () => {
    if (!selectedDevice) {
      alert('Please select a device first');
      return;
    }

    onListApps(true);
    try {
      const response = await fetch(`${backendUrl}/api/list-apps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device: selectedDevice }),
      });
      const data = await response.json();
      if (data.success) {
        setApps(data.apps);
      } else {
        alert(`Failed to list apps: ${data.error}`);
      }
    } catch (error) {
      console.error('Error listing apps:', error);
      alert(`Error listing apps: ${error.message}`);
    }
    onListApps(false);
  };

  return (
    <div>
      <button
        className={`
          w-full h-10 px-4
          flex items-center justify-center
          rounded-md
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isListing
              ? 'bg-blue-600 text-white cursor-wait'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-500'
          }
        `}
        onClick={handleListApps}
        disabled={disabled || isListing}
      >
        <ListBulletIcon className="w-5 h-5 mr-2" />
        {isListing ? 'Listing Apps...' : 'List Installed Apps'}
      </button>
      {apps.length > 0 && (
        <div className="mt-4 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Installed Apps:</h3>
          <ul className="list-disc pl-5">
            {apps.map((app, index) => (
              <li key={index} className="mb-1">{app}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListAppsButton;