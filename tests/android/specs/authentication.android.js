/**
 * Android Authentication E2E Tests
 * Tests login, signup, OAuth, and session management
 */

const driver = require('../support/driver');
const assert = require('../support/assertions');
const { testData, generateUniqueEmail, createTestAccount } = require('../support/test-data');
const adb = require('../support/adb-helper');

describe('Authentication - Android', () => {
  
  before(async function() {
    this.timeout(30000);
    // Clear app data before tests
    adb.clearAppData('com.sparkstack.costcosaver');
    await driver.pause(2000);
  });

  afterEach(async function() {
    // Return to home screen after each test
    try {
      await driver.goBack();
    } catch (e) {
      // Ignore back button errors
    }
  });

  it('AUTH-01: User can register with email and password', async function() {
    this.timeout(15000);
    
    const testAccount = createTestAccount();

    // Tap sign up button
    await assert.waitAndAssertVisible('//*[contains(@text, "Sign Up")]');
    await driver.click('//*[contains(@text, "Sign Up")]');
    await driver.pause(1000);

    // Enter email
    await driver.typeText(driver.selectors.emailInput, testAccount.email);
    
    // Enter password
    await driver.typeText(driver.selectors.passwordInput, testAccount.password);
    
    // Confirm password
    await driver.typeText('//*[@resource-id="com.sparkstack.costcosaver:id/password_confirm_input"]', testAccount.password);
    
    // Tap signup button
    await driver.click(driver.selectors.signupButton);
    
    // Verify redirected to home/tracking page
    await driver.pause(2000);
    await assert.waitAndAssertVisible(driver.selectors.trackedItemsList, 10000, 'Signup failed - tracking list not visible');
  });

  it('AUTH-02: User can login with email and password', async function() {
    this.timeout(15000);
    
    // First logout if needed
    await driver.click('//*[@resource-id="com.sparkstack.costcosaver:id/menu_button"]');
    await driver.pause(500);
    
    try {
      const logoutButton = await $(driver.selectors.logoutButton);
      if (await logoutButton.isDisplayed()) {
        await driver.click(driver.selectors.logoutButton);
        await driver.pause(1000);
      }
    } catch (e) {
      // Not logged in, proceed
    }

    // Enter email
    await driver.typeText(driver.selectors.emailInput, testData.accounts.existingUser.email);
    
    // Enter password
    await driver.typeText(driver.selectors.passwordInput, testData.accounts.existingUser.password);
    
    // Tap login button
    await driver.click(driver.selectors.loginButton);
    
    // Verify logged in
    await driver.pause(2000);
    await assert.waitAndAssertVisible(driver.selectors.trackedItemsList, 10000, 'Login failed');
  });

  it('AUTH-03: Invalid credentials show error message', async function() {
    this.timeout(10000);
    
    // Click logout first
    await driver.click('//*[@resource-id="com.sparkstack.costcosaver:id/menu_button"]');
    await driver.pause(500);

    try {
      const logoutBtn = await $(driver.selectors.logoutButton);
      if (await logoutBtn.isDisplayed()) {
        await driver.click(driver.selectors.logoutButton);
        await driver.pause(1000);
      }
    } catch (e) {
      // Already logged out
    }

    // Enter invalid credentials
    await driver.typeText(driver.selectors.emailInput, 'invalid@example.com');
    await driver.typeText(driver.selectors.passwordInput, 'wrongpassword');
    
    // Attempt login
    await driver.click(driver.selectors.loginButton);
    
    // Verify error message
    await assert.toastDisplayed('Invalid login credentials', 5000);
  });

  it('AUTH-04: Password validation - rejects short passwords', async function() {
    this.timeout(10000);
    
    // Tap sign up
    await driver.click('//*[contains(@text, "Sign Up")]');
    await driver.pause(1000);

    const testEmail = generateUniqueEmail();

    // Enter email
    await driver.typeText(driver.selectors.emailInput, testEmail);
    
    // Enter short password
    await driver.typeText(driver.selectors.passwordInput, '123');
    await driver.typeText('//*[@resource-id="com.sparkstack.costcosaver:id/password_confirm_input"]', '123');
    
    // Tap signup
    await driver.click(driver.selectors.signupButton);
    
    // Verify error message
    await assert.toastDisplayed('at least 6 characters', 5000);
  });

  it('AUTH-05: Email validation - rejects invalid email format', async function() {
    this.timeout(10000);
    
    // Tap sign up
    await driver.click('//*[contains(@text, "Sign Up")]');
    await driver.pause(1000);

    // Enter invalid email
    await driver.typeText(driver.selectors.emailInput, 'notanemail');
    await driver.typeText(driver.selectors.passwordInput, 'ValidPass123!');
    await driver.typeText('//*[@resource-id="com.sparkstack.costcosaver:id/password_confirm_input"]', 'ValidPass123!');
    
    // Attempt signup
    await driver.click(driver.selectors.signupButton);
    
    // Verify error message
    await assert.toastDisplayed('valid email', 5000);
  });

  it('AUTH-06: Duplicate email registration is rejected', async function() {
    this.timeout(15000);
    
    const duplicateEmail = 'duplicate@example.com';

    // Try to signup with duplicate email (second time)
    // First signup
    await driver.click('//*[contains(@text, "Sign Up")]');
    await driver.pause(1000);
    await driver.typeText(driver.selectors.emailInput, duplicateEmail);
    await driver.typeText(driver.selectors.passwordInput, 'ValidPass123!');
    await driver.typeText('//*[@resource-id="com.sparkstack.costcosaver:id/password_confirm_input"]', 'ValidPass123!');
    await driver.click(driver.selectors.signupButton);
    
    // Wait for successful signup
    await driver.pause(3000);

    // Logout
    await driver.click('//*[@resource-id="com.sparkstack.costcosaver:id/menu_button"]');
    await driver.pause(500);
    await driver.click(driver.selectors.logoutButton);
    await driver.pause(1000);

    // Try signup again with same email
    await driver.click('//*[contains(@text, "Sign Up")]');
    await driver.pause(1000);
    await driver.typeText(driver.selectors.emailInput, duplicateEmail);
    await driver.typeText(driver.selectors.passwordInput, 'AnotherPass123!');
    await driver.typeText('//*[@resource-id="com.sparkstack.costcosaver:id/password_confirm_input"]', 'AnotherPass123!');
    await driver.click(driver.selectors.signupButton);
    
    // Verify duplicate registration error
    await assert.toastDisplayed('already registered', 5000);
  });

  it('AUTH-07: Logout clears session', async function() {
    this.timeout(10000);
    
    // Open menu
    await driver.click('//*[@resource-id="com.sparkstack.costcosaver:id/menu_button"]');
    await driver.pause(500);
    
    // Tap logout
    await driver.click(driver.selectors.logoutButton);
    
    // Verify back at login screen
    await driver.pause(2000);
    await assert.waitAndAssertVisible(driver.selectors.emailInput, 10000, 'Not logged out - login screen not visible');
  });

  it('AUTH-08: Session persists on app restart', async function() {
    this.timeout(20000);
    
    // Login first
    await driver.typeText(driver.selectors.emailInput, testData.accounts.existingUser.email);
    await driver.typeText(driver.selectors.passwordInput, testData.accounts.existingUser.password);
    await driver.click(driver.selectors.loginButton);
    
    await driver.pause(2000);
    
    // Verify logged in
    await assert.elementExists(driver.selectors.trackedItemsList);
    
    // Close and reopen app
    adb.stopApp('com.sparkstack.costcosaver');
    await driver.pause(1000);
    adb.startApp('com.sparkstack.costcosaver', '.MainActivity');
    
    await driver.pause(3000);
    
    // Verify still logged in (no login screen)
    await assert.waitForDisappear(driver.selectors.emailInput, 5000, 'Still showing login screen after restart');
    await assert.waitAndAssertVisible(driver.selectors.trackedItemsList, 10000, 'Not logged in after restart');
  });
});
