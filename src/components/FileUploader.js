import React from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const FileUploader = ({ onFileChange, selectedFile }) => {
  return (
    <div className="mb-4">
      <label className="w-full p-2 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center cursor-pointer">
        <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
        {selectedFile ? selectedFile.name : 'Choose APK File'}
        <input
          type="file"
          accept=".apk"
          onChange={onFileChange}
          className="hidden"
        />
      </label>
      {selectedFile && (
        <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>
      )}
    </div>
  );
};

export default FileUploader;