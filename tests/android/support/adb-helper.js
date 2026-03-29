/**
 * ADB (Android Debug Bridge) Helper Utilities
 */

const { execSync } = require('child_process');

const adbHelper = {
  /**
   * Get list of connected devices
   */
  getDevices() {
    try {
      const output = execSync('adb devices -l', { encoding: 'utf-8' });
      const lines = output.split('\n').filter(line => line && !line.startsWith('List'));
      return lines.map(line => line.split(/\s+/)[0]).filter(id => id);
    } catch (error) {
      throw new Error('ADB not found or not in PATH');
    }
  },

  /**
   * Get first available device
   */
  getDefaultDevice() {
    const devices = this.getDevices();
    if (devices.length === 0) {
      throw new Error('No Android devices found. Please connect a device or start an emulator.');
    }
    return devices[0];
  },

  /**
   * Get device info
   */
  getDeviceInfo(deviceId) {
    try {
      const manufacturer = execSync(`adb -s ${deviceId} shell getprop ro.manufacturer`, { encoding: 'utf-8' }).trim();
      const model = execSync(`adb -s ${deviceId} shell getprop ro.model`, { encoding: 'utf-8' }).trim();
      const version = execSync(`adb -s ${deviceId} shell getprop ro.build.version.release`, { encoding: 'utf-8' }).trim();
      
      return {
        id: deviceId,
        manufacturer,
        model,
        androidVersion: version
      };
    } catch (error) {
      console.warn(`Could not get info for device ${deviceId}`);
      return { id: deviceId };
    }
  },

  /**
   * Install APK on device
   */
  installApp(apkPath, deviceId = null) {
    const cmd = deviceId ? `adb -s ${deviceId} install -r "${apkPath}"` : `adb install -r "${apkPath}"`;
    try {
      execSync(cmd, { stdio: 'inherit' });
      console.log('✓ App installed successfully');
    } catch (error) {
      throw new Error(`Failed to install app: ${error.message}`);
    }
  },

  /**
   * Uninstall app from device
   */
  uninstallApp(packageName, deviceId = null) {
    const cmd = deviceId ? `adb -s ${deviceId} uninstall ${packageName}` : `adb uninstall ${packageName}`;
    try {
      execSync(cmd, { stdio: 'inherit' });
      console.log('✓ App uninstalled');
    } catch (error) {
      console.warn('App might not be installed');
    }
  },

  /**
   * Clear app data
   */
  clearAppData(packageName, deviceId = null) {
    const cmd = deviceId ? `adb -s ${deviceId} shell pm clear ${packageName}` : `adb shell pm clear ${packageName}`;
    try {
      execSync(cmd, { stdio: 'inherit' });
      console.log('✓ App data cleared');
    } catch (error) {
      throw new Error(`Failed to clear app data: ${error.message}`);
    }
  },

  /**
   * Grant permissions
   */
  grantPermissions(packageName, permissions = [], deviceId = null) {
    const perms = permissions.length > 0 ? permissions : [
      'android.permission.CAMERA',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_EXTERNAL_STORAGE'
    ];

    perms.forEach(perm => {
      const cmd = deviceId 
        ? `adb -s ${deviceId} shell pm grant ${packageName} ${perm}`
        : `adb shell pm grant ${packageName} ${perm}`;
      try {
        execSync(cmd);
      } catch (error) {
        console.warn(`Could not grant permission: ${perm}`);
      }
    });
  },

  /**
   * Pull file from device
   */
  pullFile(remotePath, localPath, deviceId = null) {
    const cmd = deviceId 
      ? `adb -s ${deviceId} pull ${remotePath} ${localPath}`
      : `adb pull ${remotePath} ${localPath}`;
    try {
      execSync(cmd);
      console.log(`✓ File pulled: ${remotePath}`);
    } catch (error) {
      throw new Error(`Failed to pull file: ${error.message}`);
    }
  },

  /**
   * Push file to device
   */
  pushFile(localPath, remotePath, deviceId = null) {
    const cmd = deviceId 
      ? `adb -s ${deviceId} push ${localPath} ${remotePath}`
      : `adb push ${localPath} ${remotePath}`;
    try {
      execSync(cmd);
      console.log(`✓ File pushed: ${remotePath}`);
    } catch (error) {
      throw new Error(`Failed to push file: ${error.message}`);
    }
  },

  /**
   * Get app version
   */
  getAppVersion(packageName, deviceId = null) {
    const cmd = deviceId 
      ? `adb -s ${deviceId} shell dumpsys package ${packageName} | grep versionName`
      : `adb shell dumpsys package ${packageName} | grep versionName`;
    try {
      const output = execSync(cmd, { encoding: 'utf-8' });
      return output.split('=')[1]?.trim();
    } catch (error) {
      return 'Unknown';
    }
  },

  /**
   * Take screenshot
   */
  takeScreenshot(remoteDir = '/sdcard', deviceId = null) {
    const timestamp = Date.now();
    const remotePath = `${remoteDir}/screenshot_${timestamp}.png`;
    const cmd = deviceId 
      ? `adb -s ${deviceId} shell screencap ${remotePath}`
      : `adb shell screencap ${remotePath}`;
    
    try {
      execSync(cmd);
      return remotePath;
    } catch (error) {
      throw new Error(`Failed to take screenshot: ${error.message}`);
    }
  },

  /**
   * Get logcat output
   */
  getLogs(filterPattern = '', deviceId = null) {
    const cmd = deviceId 
      ? `adb -s ${deviceId} logcat -d ${filterPattern}`
      : `adb logcat -d ${filterPattern}`;
    try {
      return execSync(cmd, { encoding: 'utf-8' });
    } catch (error) {
      throw new Error(`Failed to get logs: ${error.message}`);
    }
  },

  /**
   * Start app
   */
  startApp(packageName, activity, deviceId = null) {
    const cmd = deviceId 
      ? `adb -s ${deviceId} shell am start -n ${packageName}/${activity}`
      : `adb shell am start -n ${packageName}/${activity}`;
    try {
      execSync(cmd);
      console.log('✓ App started');
    } catch (error) {
      throw new Error(`Failed to start app: ${error.message}`);
    }
  },

  /**
   * Stop app
   */
  stopApp(packageName, deviceId = null) {
    const cmd = deviceId 
      ? `adb -s ${deviceId} shell am force-stop ${packageName}`
      : `adb shell am force-stop ${packageName}`;
    try {
      execSync(cmd);
      console.log('✓ App stopped');
    } catch (error) {
      throw new Error(`Failed to stop app: ${error.message}`);
    }
  }
};

module.exports = adbHelper;
