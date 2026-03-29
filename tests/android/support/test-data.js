/**
 * Test data and fixtures for Android E2E tests
 */

const testData = {
  // Test accounts for authentication
  accounts: {
    newUser: {
      email: `qa.user.${Date.now()}@example.com`,
      password: 'SecurePassword123!'
    },
    existingUser: {
      email: 'qa.existing@example.com',
      password: 'ExistingPassword123!'
    },
    oauthUser: {
      email: 'qa.oauth@example.com',
      googleAccount: 'qa.google@gmail.com'
    }
  },

  // Receipt test data
  receipts: {
    validReceipt: {
      filename: 'valid-receipt.jpg',
      expectedItems: 3,
      items: [
        {
          name: 'Kirkland Almond Butter',
          price: 8.99,
          quantity: 1
        },
        {
          name: 'Organic Salmon',
          price: 14.99,
          quantity: 2
        },
        {
          name: 'Greek Yogurt',
          price: 5.99,
          quantity: 1
        }
      ]
    },
    multiItemReceipt: {
      filename: 'multi-item-receipt.jpg',
      expectedItems: 5,
      items: [
        { name: 'Item 1', price: 9.99 },
        { name: 'Item 2', price: 7.49 },
        { name: 'Item 3', price: 12.99 },
        { name: 'Item 4', price: 4.99 },
        { name: 'Item 5', price: 15.99 }
      ]
    },
    invalidReceipt: {
      filename: 'blurry-receipt.jpg',
      expectedError: 'Unable to parse receipt'
    }
  },

  // Price scenarios for testing
  prices: {
    priceDropSmall: {
      original: 10.00,
      updated: 9.50,
      expectedSavings: 0.50
    },
    priceDropMedium: {
      original: 10.00,
      updated: 7.99,
      expectedSavings: 2.01
    },
    priceDropLarge: {
      original: 20.00,
      updated: 12.99,
      expectedSavings: 7.01
    },
    priceIncrease: {
      original: 10.00,
      updated: 11.50
    },
    priceUnchanged: {
      original: 10.00,
      updated: 10.00
    }
  },

  // Timeout values (in milliseconds)
  timeouts: {
    short: 3000,
    medium: 8000,
    long: 15000,
    veryLong: 30000
  },

  // Delay values for user actions
  delays: {
    alertDisplay: 2000,
    pageTransition: 1000,
    notification: 3000,
    dialog: 500
  },

  // Expected UI elements
  ui: {
    buttons: {
      upload: 'Upload Receipt',
      track: 'Track Item',
      delete: 'Delete',
      confirm: 'Confirm',
      cancel: 'Cancel',
      submit: 'Submit'
    },
    labels: {
      trackedItems: 'Tracked Items',
      priceHistory: 'Price History',
      settings: 'Settings',
      logout: 'Logout'
    }
  },

  // Deep link URLs for notification testing
  deepLinks: {
    itemDetail: (itemId) => `costcosaver://item/${itemId}`,
    tracking: 'costcosaver://tracking',
    settings: 'costcosaver://settings'
  },

  // Permission strings
  permissions: [
    'android.permission.CAMERA',
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE'
  ]
};

/**
 * Helper to generate unique test data
 */
function generateUniqueEmail(prefix = 'qa') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}.${timestamp}.${random}@example.com`;
}

/**
 * Helper to generate test account
 */
function createTestAccount() {
  return {
    email: generateUniqueEmail('testuser'),
    password: `TestPass${Date.now()}!`,
    firstName: 'QA',
    lastName: 'Tester'
  };
}

/**
 * Helper to simulate price changes
 */
function getPriceChangeScenario(scenario = 'drop') {
  const scenarios = {
    drop: { original: 10.00, updated: 6.99, shouldAlert: true },
    increase: { original: 10.00, updated: 12.99, shouldAlert: false },
    unchanged: { original: 10.00, updated: 10.00, shouldAlert: false },
    smallDrop: { original: 10.00, updated: 9.50, shouldAlert: true },
    largeDrop: { original: 20.00, updated: 9.99, shouldAlert: true }
  };
  return scenarios[scenario] || scenarios.drop;
}

module.exports = {
  testData,
  generateUniqueEmail,
  createTestAccount,
  getPriceChangeScenario
};
