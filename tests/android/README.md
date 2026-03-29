# Android E2E Testing Suite

This suite provides deterministic end-to-end testing for the Android app on real devices or emulators using **Appium** and **ADB**.

## Architecture

```
tests/android/
├── README.md                          # This file
├── package.json                       # Android test dependencies
├── appium.config.js                   # Appium configuration
├── capabilities.js                    # Device capabilities
├── specs/
│   ├── authentication.android.js      # Auth flow tests
│   ├── receipt-upload.android.js      # Receipt upload & OCR
│   ├── price-tracking.android.js      # Price tracking & alerts
│   ├── notifications.android.js       # Push notification handling
│   └── e2e-flow.android.js            # Full user journeys
├── support/
│   ├── driver.js                      # Appium driver setup
│   ├── adb-helper.js                  # ADB utility commands
│   ├── assertions.js                  # Custom Android assertions
│   ├── test-data.js                   # Test fixtures for Android
│   └── helpers.js                     # Common test utilities
└── fixtures/
    ├── sample-receipt.jpg             # Test receipt image
    └── test-accounts.json             # Test user credentials
```

## Coverage

### Service-Level Tests (Existing - `/tests/qa/`)
- Receipt parsing logic
- Price tracking algorithms
- Notification generation
- Authentication logic
- Duplicate prevention
- Batch performance (100+ items)

### Android UI Tests (New)
- **Authentication**: Email/password login, Google OAuth, Account switching
- **Receipt Upload**: Camera/gallery access, image validation, OCR feedback
- **Price Tracking**: Item list display, price history, tracking UI
- **Notifications**: Push notification handling, deep linking, alert display
- **End-to-End Flows**: Complete user journeys on Android device

## Prerequisites

1. **Java Development Kit (JDK)** 11+
   ```bash
   java -version
   ```

2. **Android SDK & Build Tools**
   ```bash
   # Android Studio or standalone SDK
   # Ensure ANDROID_HOME is set
   ```

3. **Appium** (v2.x)
   ```bash
   npm install -g appium
   appium --version
   ```

4. **Appium Inspector** (Optional but recommended)
   - Download from: https://github.com/appium/appium-inspector
   - Useful for element inspection on device

## Setup

### 1. Install Dependencies

```bash
cd tests/android
npm install
```

### 2. Build Android App

```bash
cd ../..
npm run build
npx cap sync android
```

### 3. Configure Devices

#### Using Real Device
```bash
# Enable Developer Mode on Android device
# Enable USB Debugging in Developer Options
# Connect via USB

# Verify device is detected
adb devices
```

#### Using Emulator
```bash
# Start Android emulator (from Android Studio or CLI)
emulator -avd <your_avd_name> &

# Verify emulator is detected
adb devices
```

### 4. Update Capabilities (if needed)

Edit `capabilities.js` to match your device:
```javascript
{
  "platformName": "Android",
  "automationName": "UiAutomator2",
  "deviceName": "your_device_id_from_adb_devices",
  "app": "/path/to/built/app.apk",
  "appPackage": "com.sparkstack.costcosaver",
  "appActivity": ".MainActivity"
}
```

## Running Tests

### Run All Android Tests
```bash
npm run test:android
```

### Run Specific Test File
```bash
npm run test:android -- --spec specs/authentication.android.js
```

### Run with Detailed Logging
```bash
npm run test:android -- --logLevel verbose
```

### Run on Specific Device
```bash
ADB_DEVICE_ID=<device_id> npm run test:android
```

## Test Suites

### Authentication Tests (`authentication.android.js`)
- ✓ Email/password registration
- ✓ Email/password login
- ✓ Google OAuth flow (deep link handling)
- ✓ Account switching
- ✓ Logout
- ✓ Session persistence

### Receipt Upload Tests (`receipt-upload.android.js`)
- ✓ Camera permission request
- ✓ Gallery permission request
- ✓ Capture receipt with camera
- ✓ Select receipt from gallery
- ✓ Image validation feedback
- ✓ OCR parsing display
- ✓ Error handling (blurry, invalid image)

### Price Tracking Tests (`price-tracking.android.js`)
- ✓ Track item after upload
- ✓ View tracked items list
- ✓ Item details and price history
- ✓ Sort and filter tracked items
- ✓ Remove tracked item
- ✓ Batch tracking (multiple items)
- ✓ Price update detection

### Notification Tests (`notifications.android.js`)
- ✓ Receive price drop alert
- ✓ Notification deep linking to item
- ✓ Multiple notifications handling
- ✓ Notification dismissal
- ✓ Background notification delivery
- ✓ Rich notification content

### End-to-End Flow Tests (`e2e-flow.android.js`)
- ✓ E2E-01: New user signup → upload receipt → track → get alert
- ✓ E2E-02: Existing user login → upload → track multi-item
- ✓ E2E-03: Price drop detection → alert notification → navigate
- ✓ E2E-04: Multiple items with mixed price movements
- ✓ E2E-05: Account switching with different tracked items

## Troubleshooting

### Appium Server Issues
```bash
# Kill existing Appium processes
pkill -f appium

# Start fresh
appium
```

### Device Connection Issues
```bash
# Check device is connected
adb devices

# Restart ADB
adb kill-server
adb start-server

# Check USB debugging permissions
adb shell getprop ro.secure
```

### App Installation Issues
```bash
# Clear app and reinstall
adb uninstall com.sparkstack.costcosaver
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

### Element Not Found
- Use Appium Inspector to find correct selectors
- Ensure app is fully loaded before interaction
- Check for webview vs native elements

## Integration with CI/CD

Add to your CI/CD pipeline (GitHub Actions, GitLab CI, etc.):

```yaml
- name: Run Android E2E Tests
  run: |
    cd tests/android
    npm install
    npm run test:android
```

## Notes

- Tests run against debug APK for easier instrumentation
- Each test is isolated and cleans up after itself
- Use test data from `fixtures/` to ensure consistent results
- Combine with service-level tests (`npm run test:qa`) for complete coverage
- For performance testing, see `/tests/qa/e2e-flow.test.mjs` for batch scenarios

## Related Files

- Service-level tests: `/tests/qa/`
- App configuration: `/capacitor.config.ts`
- Android manifest: `/android/app/src/main/AndroidManifest.xml`
- iOS tests: `/tests/ios/` (see iOS implementation plan)
