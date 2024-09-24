import React, { useState } from 'react';
import { ListBulletIcon, TrashIcon } from '@heroicons/react/24/outline';

const ListAppsButton = ({ onListApps, isListing, disabled, backendUrl, selectedDevice }) => {
  const [apps, setApps] = useState([]);
  const [confirmUninstall, setConfirmUninstall] = useState(null);

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

  const handleUninstall = async (packageName) => {
    if (!selectedDevice) {
      alert('Please select a device first');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/uninstall-app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device: selectedDevice, packageName }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Successfully uninstalled ${packageName}`);
        setApps(apps.filter(app => app.packageName !== packageName));
      } else {
        alert(`Failed to uninstall app: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uninstalling app:', error);
      alert(`Error uninstalling app: ${error.message}`);
    }
    setConfirmUninstall(null);
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
          <ul className="space-y-2">
            {apps.map((app, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <div className="flex-grow mr-2">
                  <span className="font-medium">{app.packageName}</span>
                  <span className="text-sm text-gray-500 ml-2">v{app.version}</span>
                </div>
                <button
                  onClick={() => setConfirmUninstall(app.packageName)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {confirmUninstall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Confirm Uninstall</h3>
            <p>Are you sure you want to uninstall {confirmUninstall}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setConfirmUninstall(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUninstall(confirmUninstall)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Uninstall
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAppsButton;