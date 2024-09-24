import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    handleScan();
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('http://localhost:5000/api/devices');
      const data = await response.json();
      setDevices(data.devices);
    } catch (error) {
      console.error('Error scanning devices:', error);
      alert('Failed to scan devices');
    }
    setIsScanning(false);
  };

  const handleConnect = async () => {
    if (!deviceAddress) {
      alert('Please enter a device address');
      return;
    }
    setIsConnecting(true);
    try {
      const response = await fetch('http://localhost:5000/api/connect', {
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
      const response = await fetch('http://localhost:5000/api/install', {
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Mobile ADB Tool</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Device Address (IP:PORT)"
            value={deviceAddress}
            onChange={(e) => setDeviceAddress(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleConnect}
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded"
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect to Device'}
        </button>
        <DeviceScanner onScan={handleScan} isScanning={isScanning} />
        <DeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onSelect={setSelectedDevice}
        />
        <FileUploader onFileChange={handleFileChange} selectedFile={apkFile} />
        <InstallButton
          onInstall={handleInstall}
          isInstalling={isInstalling}
          disabled={!selectedDevice || !apkFile}
        />
      </div>
    </div>
  );
}

export default App;