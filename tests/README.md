# Testing Overview

This directory contains comprehensive testing suites for **Costco Saver Pro** across multiple platforms.

## Test Suites

### 1. Service-Level Tests (`./qa/`)
✅ **Fast, deterministic business logic validation**

- Receipt parsing and OCR
- Price tracking algorithms  
- Notification generation
- Authentication workflows
- Duplicate prevention
- Batch processing (100+ items)

**Run:** `npm run test:qa`  
**Duration:** < 2 minutes  
**CI-Friendly:** Yes

**Platforms:** All (Web, iOS, Android)

[See detailed README](./qa/README.md)

---

### 2. Android E2E Tests (`./android/`)
✅ **Real device UI and integration testing**

- User authentication flows
- Receipt upload and permissions
- Price tracking list interactions
- Push notification delivery
- Complete end-to-end user journeys
- Multi-user scenarios

**Run:** `cd android && npm run test:android`  
**Duration:** 5-15 minutes  
**CI-Friendly:** Requires device/emulator

**Platform:** Android only

[See detailed README](./android/README.md)

---

## Quick Start

### Service-Level Tests (Recommended First)
```bash
# All platforms
npm run test:qa
```

### Android E2E Tests (Requires Setup)
```bash
cd tests/android
npm install
npm run test:android
```

---

## Testing Strategy

See [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) for:
- How these tests complement each other
- Can service tests work for Android? (Answer: YES, but only backend logic)
- Complete testing pyramid architecture
- Test execution recommendations for CI/CD

---

## File Structure

```
tests/
├── qa/                                 # Service-level tests (all platforms)
│   ├── README.md
│   ├── authentication.test.mjs
│   ├── e2e-flow.test.mjs
│   ├── notifications.test.mjs
│   ├── price-tracking.test.mjs
│   ├── receipt-upload.test.mjs
│   ├── fixtures/
│   │   ├── receipt-fixtures.json
│   │   └── price-matrix.json
│   └── support/
│       ├── fixtures.mjs
│       └── harness.mjs
│
├── android/                            # Android E2E tests
│   ├── README.md
│   ├── wdio.conf.js
│   ├── capabilities.js
│   ├── package.json
│   ├── specs/
│   │   ├── authentication.android.js
│   │   ├── e2e-flow.android.js
│   │   ├── notifications.android.js
│   │   ├── price-tracking.android.js
│   │   └── receipt-upload.android.js
│   ├── support/
│   │   ├── adb-helper.js
│   │   ├── assertions.js
│   │   ├── driver.js
│   │   └── test-data.js
│   └── fixtures/
│       └── (test images, test accounts)
│
├── TESTING-STRATEGY.md                 # Testing architecture and approach
└── README.md                           # This file
```

---

## Coverage Matrix

| Feature | Service-Level | Android E2E | Status |
|---------|---------------|-------------|--------|
| Authentication | ✅ | ✅ | Complete |
| Receipt Upload | ✅ | ✅ | Complete |
| Price Tracking | ✅ | ✅ | Complete |
| Notifications | ✅ | ✅ | Complete |
| End-to-End Flows | ✅ | ✅ | Complete |
| **iOS E2E** | ❌ | ❌ | Planned |
| **Web E2E** | ❌ | ❌ | Planned |

---

## Running Tests

### All Service-Level Tests
```bash
npm run test:qa
```

### Specific Service Test
```bash
npm run test:qa -- tests/qa/e2e-flow.test.mjs
```

### Specific Android Test Suite
```bash
cd tests/android

npm run test:android:auth      # Authentication
npm run test:android:receipt   # Receipt upload
npm run test:android:tracking  # Price tracking
npm run test:android:notif     # Notifications
npm run test:android:e2e       # End-to-end flows

# Or run all
npm run test:android
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Service-Level Tests
  run: npm run test:qa

- name: Android E2E Tests
  if: github.event_name == 'pull_request'
  run: |
    cd tests/android && npm install
    npm run test:android
```

---

## Test Data

### Service-Level
- **Location:** `/tests/qa/fixtures/`
- **Files:** receipt-fixtures.json, price-matrix.json
- **Updates:** Rerun `npm run test:qa` to regenerate

### Android E2E
- **Location:** `/tests/android/support/test-data.js`
- **Dynamic:** Test accounts generated with timestamps
- **Isolation:** Each test run uses unique data

---

## Troubleshooting

### Service-Level Tests
**Issue:** Tests fail with "No fixtures found"
```bash
# Solution: Ensure fixture files exist
ls tests/qa/fixtures/
```

### Android Tests
**Issue:** Device not found
```bash
# Solution: Check USB debugging
adb devices -l

# Enable if needed
adb kill-server
adb start-server
```

---

## Best Practices

1. **Always run service tests first** - Fast validation before device testing
2. **Use test data helpers** - Keep tests consistent
3. **Handle permissions** - Android tests handle permission dialogs
4. **Isolate test data** - Each test cleans up after itself
5. **Log failures** - Use verbose mode to debug: `--logLevel verbose`

---

## Future Enhancements

- [ ] iOS E2E tests (parallel to Android)
- [ ] Web/Playwright tests
- [ ] Performance benchmarking
- [ ] Visual regression testing
- [ ] Cross-platform test sharing
- [ ] Integration with AWS Device Farm
- [ ] Automated test report generation

---

## Support

For questions about:
- **Service tests:** See [qa/README.md](./qa/README.md)
- **Android tests:** See [android/README.md](./android/README.md)
- **Overall strategy:** See [TESTING-STRATEGY.md](./TESTING-STRATEGY.md)

---

Updated: March 27, 2026
