/**
 * Device Capabilities Configuration
 * Update deviceName and udid based on your device
 */

const adbDeviceId = process.env.ADB_DEVICE_ID || null;

const getCapabilities = () => {
  const baseCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:platformVersion': '13', // Adjust to your device Android version
    'appium:appPackage': 'com.sparkstack.costcosaver',
    'appium:appActivity': '.MainActivity',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 300,
    'appium:connectHardwareKeyboard': true,
  };

  // Configure device
  if (adbDeviceId) {
    // Real device
    return [{
      ...baseCapabilities,
      'appium:udid': adbDeviceId,
      'appium:deviceName': `Device-${adbDeviceId.substring(0, 8)}`,
    }];
  } else {
    // Android Emulator (default)
    return [{
      ...baseCapabilities,
      'appium:deviceName': 'emulator-5554', // Default emulator
      'appium:platformVersion': '13',
    }];
  }
};

module.exports = {
  maxInstances: 1,
  capabilities: getCapabilities(),
  
  // Helper method to get device info
  getDeviceInfo: async function(driver) {
    return {
      platformVersion: await driver.getPlatformVersion(),
      deviceName: await driver.getWindowHandle(),
      appVersion: await driver.queryAppState('com.sparkstack.costcosaver'),
    };
  },
  
  // Helper to check if running on emulator
  isEmulator: function() {
    return !adbDeviceId;
  },
  
  // Helper to get app package
  getAppPackage: function() {
    return 'com.sparkstack.costcosaver';
  },
  
  // Helper to get app activity
  getMainActivity: function() {
    return '.MainActivity';
  }
};
