import React from 'react';

const DeviceSelector = ({ devices, selectedDevice, onSelect }) => {
  const getDeviceDisplayName = (device) => {
    if (device.id.includes(':')) {
      // This is likely a network device
      return `Network: ${device.id}`;
    } else if (device.description.includes('model:')) {
      // Extract model name if available
      const modelMatch = device.description.match(/model:(\S+)/);
      return modelMatch ? `${modelMatch[1]} (${device.id})` : device.id;
    } else {
      // Fallback to just the ID
      return device.id;
    }
  };

  return (
    <select
      className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      value={selectedDevice}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select a device</option>
      {devices.map((device) => (
        <option key={device.id} value={device.id}>
          {getDeviceDisplayName(device)}
        </option>
      ))}
    </select>
  );
};

export default DeviceSelector;