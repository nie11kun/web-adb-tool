const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    cb(null, `${Date.now()}${fileExt}`);
  }
});

const upload = multer({ storage: storage });

// 允许所有来源的跨域请求
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Start ADB server
exec('adb start-server', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting ADB server: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`ADB server stderr: ${stderr}`);
    return;
  }
  console.log(`ADB server started: ${stdout}`);
});

// Check ADB version
exec('adb version', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error getting ADB version: ${error.message}`);
    return;
  }
  console.log(`ADB version: ${stdout}`);
});

app.get('/api/devices', async (req, res) => {
  try {
    const { stdout, stderr } = await execPromise('adb devices -l');
    if (stderr) {
      console.error('ADB devices stderr:', stderr);
      return res.status(500).json({ error: 'Failed to list devices' });
    }
    const lines = stdout.split('\n').slice(1);
    const devices = lines
      .filter(line => line.trim() !== '')
      .map(line => {
        const parts = line.split(/\s+/);
        return { id: parts[0], description: parts.slice(1).join(' ') };
      });
    res.json({ devices });
  } catch (error) {
    console.error('Error listing devices:', error);
    res.status(500).json({ error: 'Failed to list devices' });
  }
});

app.post('/api/connect', async (req, res) => {
  const { deviceAddress } = req.body;
  if (!deviceAddress) {
    return res.status(400).json({ error: 'Device address is required' });
  }
  console.log(`Attempting to connect to device: ${deviceAddress}`);
  try {
    const { stdout, stderr } = await execPromise(`adb connect ${deviceAddress}`);
    if (stderr) {
      console.error('ADB connect stderr:', stderr);
      return res.status(500).json({ error: 'Failed to connect to device', details: stderr });
    }
    console.log('ADB connect stdout:', stdout);
    if (stdout.includes('connected') || stdout.includes('already connected')) {
      res.json({ success: true, message: 'Device connected successfully' });
    } else {
      res.status(500).json({ error: 'Failed to connect to device', details: stdout });
    }
  } catch (error) {
    console.error('Error connecting to device:', error);
    res.status(500).json({ error: 'Failed to connect to device', details: error.message });
  }
});

app.post('/api/install', upload.single('apk'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No APK file provided' });
  }

  const { device } = req.body;
  const apkPath = req.file.path;

  // 检查文件扩展名
  if (!['.apk', '.apex'].includes(path.extname(apkPath).toLowerCase())) {
    fs.unlinkSync(apkPath); // 删除不正确的文件
    return res.status(400).json({ error: 'Invalid file type. Only .apk and .apex files are allowed.' });
  }

  try {
    const command = `adb -s ${device} install -r "${apkPath}"`;
    console.log('Executing command:', command);
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error('APK install stderr:', stderr);
      return res.status(500).json({ error: 'Failed to install APK', details: stderr });
    }
    
    console.log('APK install stdout:', stdout);
    if (stdout.includes('Success')) {
      res.json({ success: true, message: 'APK installed successfully' });
    } else {
      res.status(500).json({ error: 'Failed to install APK', details: stdout });
    }
  } catch (error) {
    console.error('Error installing APK:', error);
    res.status(500).json({ error: 'Failed to install APK', details: error.message });
  } finally {
    // Clean up the uploaded file
    fs.unlinkSync(apkPath);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});