import React from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const InstallButton = ({ onInstall, isInstalling, disabled }) => {
  return (
    <button
      className="w-full p-2 bg-green-500 text-white rounded-md flex items-center justify-center"
      onClick={onInstall}
      disabled={disabled || isInstalling}
    >
      <CloudArrowUpIcon className="w-5 h-5 mr-2" />
      {isInstalling ? 'Installing...' : 'Install APK'}
    </button>
  );
};

export default InstallButton;