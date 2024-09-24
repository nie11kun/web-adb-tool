import React, { useState, useEffect, useCallback } from 'react';
import DeviceScanner from './components/DeviceScanner';
import DeviceSelector from './components/DeviceSelector';
import FileUploader from './components/FileUploader';
import InstallButton from './components/InstallButton';

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [apkFile, setApkFile] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deviceAddress, setDeviceAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://localhost:5000');

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    try {
      const response = await fetch(`${backendUrl}/api/devices`);
      const data = await response.json();
      setDevices(data.devices);
    } catch (error) {
      console.error('Error scanning devices:', error);
      alert('Failed to scan devices');
    }
    setIsScanning(false);
  }, [backendUrl]);

  useEffect(() => {
    // Load saved data from localStorage
    const savedBackendUrl = localStorage.getItem('backendUrl');
    const savedDeviceAddress = localStorage.getItem('deviceAddress');
    const savedSelectedDevice = localStorage.getItem('selectedDevice');

    if (savedBackendUrl) setBackendUrl(savedBackendUrl);
    if (savedDeviceAddress) setDeviceAddress(savedDeviceAddress);
    if (savedSelectedDevice) setSelectedDevice(savedSelectedDevice);

    handleScan();
  }, [handleScan]); // Add handleScan to the dependency array

  const handleConnect = async () => {
    if (!deviceAddress) {
      alert('Please enter a device address');
      return;
    }
    setIsConnecting(true);
    try {
      const response = await fetch(`${backendUrl}/api/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceAddress }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Device connected successfully');
        setSelectedDevice(deviceAddress);
        localStorage.setItem('selectedDevice', deviceAddress);
        handleScan(); // Refresh device list
      } else {
        alert(`Failed to connect to device: ${data.error}\nDetails: ${data.details || 'No additional details'}`);
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
      alert(`Error connecting to device: ${error.message}`);
    }
    setIsConnecting(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (['apk', 'apex'].includes(fileExt)) {
        setApkFile(file);
      } else {
        alert('Invalid file type. Please select an APK or APEX file.');
        event.target.value = null; // Reset file input
      }
    }
  };

  const handleInstall = async () => {
    if (!apkFile || !selectedDevice) {
      alert('Please select both a device and an APK file');
      return;
    }
    
    setIsInstalling(true);
    
    const formData = new FormData();
    formData.append('apk', apkFile, apkFile.name);
    formData.append('device', selectedDevice);

    try {
      const response = await fetch(`${backendUrl}/api/install`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('APK installed successfully');
      } else {
        alert(`Failed to install APK: ${data.error}\nDetails: ${data.details || 'No additional details'}`);
      }
    } catch (error) {
      console.error('Error installing APK:', error);
      alert(`Error installing APK: ${error.message}`);
    }
    setIsInstalling(false);
  };

  const handleBackendUrlChange = (e) => {
    const newUrl = e.target.value;
    setBackendUrl(newUrl);
    localStorage.setItem('backendUrl', newUrl);
  };

  const handleDeviceAddressChange = (e) => {
    const newAddress = e.target.value;
    setDeviceAddress(newAddress);
    localStorage.setItem('deviceAddress', newAddress);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Mobile ADB Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="backendUrl" className="block text-sm font-medium text-gray-700 mb-1">Backend URL</label>
            <input
              id="backendUrl"
              type="text"
              placeholder="http://localhost:5000"
              value={backendUrl}
              onChange={handleBackendUrlChange}
              className="w-full p-2 h-10 text-sm border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="deviceAddress" className="block text-sm font-medium text-gray-700 mb-1">Device Address</label>
            <div className="flex">
              <input
                id="deviceAddress"
                type="text"
                placeholder="192.168.1.100:5555"
                value={deviceAddress}
                onChange={handleDeviceAddressChange}
                className="flex-grow p-2 h-10 text-sm border rounded-l focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleConnect}
                className="px-4 h-10 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex items-center">
          <div className="flex-grow">
            <DeviceSelector
              devices={devices}
              selectedDevice={selectedDevice}
              onSelect={setSelectedDevice}
            />
          </div>
          <div className="ml-2">
            <DeviceScanner onScan={handleScan} isScanning={isScanning} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploader onFileChange={handleFileChange} selectedFile={apkFile} />
          <InstallButton
            onInstall={handleInstall}
            isInstalling={isInstalling}
            disabled={!selectedDevice || !apkFile}
          />
        </div>
      </div>
    </div>
  );
}

export default App;