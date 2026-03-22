const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 处理IPC通信
ipcMain.on('can-connect', (event, args) => {
  // 实现CAN通信连接逻辑（周立功CAN卡）
  console.log('CAN连接请求:', args);
  try {
    // 这里将使用canlib库连接周立功CAN卡
    // const canlib = require('canlib');
    // 初始化canlib
    // 打开CAN通道
    // 设置波特率等参数
    event.reply('can-connect-response', { success: true, message: '周立功CAN卡连接成功' });
  } catch (error) {
    console.error('CAN连接失败:', error);
    event.reply('can-connect-response', { success: false, message: 'CAN连接失败: ' + error.message });
  }
});

ipcMain.on('xcp-connect', (event, args) => {
  // 实现XCP通信连接逻辑
  console.log('XCP连接请求:', args);
  event.reply('xcp-connect-response', { success: true, message: 'XCP连接成功' });
});

ipcMain.on('start-calibration', (event, args) => {
  // 实现标定流程逻辑
  console.log('开始标定:', args);
  event.reply('calibration-status', { status: 'running', progress: 0 });
  
  // 模拟标定过程
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    event.reply('calibration-status', { status: 'running', progress });
    if (progress >= 100) {
      clearInterval(interval);
      event.reply('calibration-status', { status: 'completed', progress: 100 });
    }
  }, 1000);
});

ipcMain.on('read-sensor-data', (event) => {
  // 模拟传感器数据
  const sensorData = {
    oilTemp: Math.random() * 100,
    statorTemp: Math.random() * 150,
    controllerFault: false,
    waterTemp: Math.random() * 90,
    vibration: Math.random() * 10
  };
  event.reply('sensor-data', sensorData);
});