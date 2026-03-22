const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // CAN通信
  canConnect: (config) => ipcRenderer.send('can-connect', config),
  onCanConnectResponse: (callback) => ipcRenderer.on('can-connect-response', (event, ...args) => callback(...args)),
  
  // XCP通信
  xcpConnect: (config) => ipcRenderer.send('xcp-connect', config),
  onXcpConnectResponse: (callback) => ipcRenderer.on('xcp-connect-response', (event, ...args) => callback(...args)),
  
  // 标定流程
  startCalibration: (config) => ipcRenderer.send('start-calibration', config),
  onCalibrationStatus: (callback) => ipcRenderer.on('calibration-status', (event, ...args) => callback(...args)),
  
  // 传感器数据
  readSensorData: () => ipcRenderer.send('read-sensor-data'),
  onSensorData: (callback) => ipcRenderer.on('sensor-data', (event, ...args) => callback(...args))
});