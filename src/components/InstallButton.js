import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const InstallButton = ({ onInstall, isInstalling, disabled }) => {
  return (
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
            : isInstalling
            ? 'bg-green-600 text-white cursor-wait'
            : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-green-500'
        }
      `}
      onClick={onInstall}
      disabled={disabled || isInstalling}
    >
      {isInstalling ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Installing...
        </>
      ) : (
        <>
          <CloudArrowUpIcon className="w-5 h-5 mr-2" />
          Install APK
        </>
      )}
    </button>
  );
};

export default InstallButton;