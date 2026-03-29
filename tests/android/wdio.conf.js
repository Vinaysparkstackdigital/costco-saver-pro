const capabilities = require('./capabilities');

exports.config = {
  runner: 'local',
  port: 4723,
  specs: [
    './specs/**/*.android.js'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: capabilities,
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
    retries: 0
  },
  reporterOptions: {
    outputDir: './test-results'
  },
  reporters: [['spec', {
    onComplete: function() {
      console.log('\n✓ Android E2E testing complete\n');
    }
  }]],
  services: [
    ['appium', {
      args: {
        relaxedSecurityEnabled: true,
      },
    }]
  ],
  onPrepare: async function() {
    console.log('Setting up Android test environment...');
  },
  onComplete: async function() {
    console.log('Android E2E tests finished');
  }
};
