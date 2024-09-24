import React from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const FileUploader = ({ onFileChange, selectedFile }) => {
  return (
    <label className="flex items-center justify-center p-2 h-10 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 transition-colors duration-200">
      <ArrowUpTrayIcon className="w-5 h-5 mr-2 flex-shrink-0" />
      <span className="truncate">
        {selectedFile ? selectedFile.name : 'Choose APK File'}
      </span>
      <input
        type="file"
        accept=".apk,.apex"
        onChange={onFileChange}
        className="hidden"
      />
    </label>
  );
};

export default FileUploader;