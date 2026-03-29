/**
 * WebDriver initialization and helpers
 */

const driver = {
  // Common Android selectors
  selectors: {
    // Auth
    emailInput: '//*[@resource-id="com.sparkstack.costcosaver:id/email_input"]',
    passwordInput: '//*[@resource-id="com.sparkstack.costcosaver:id/password_input"]',
    loginButton: '//*[@resource-id="com.sparkstack.costcosaver:id/login_button"]',
    signupButton: '//*[@resource-id="com.sparkstack.costcosaver:id/signup_button"]',
    logoutButton: '//*[contains(@text, "Logout")]',
    
    // Receipt Upload
    uploadButton: '//*[@resource-id="com.sparkstack.costcosaver:id/upload_receipt_button"]',
    cameraButton: '//*[@resource-id="com.sparkstack.costcosaver:id/camera_button"]',
    galleryButton: '//*[@resource-id="com.sparkstack.costcosaver:id/gallery_button"]',
    receiptImage: '//*[@resource-id="com.sparkstack.costcosaver:id/receipt_image"]',
    confirmButton: '//*[@resource-id="com.sparkstack.costcosaver:id/confirm_button"]',
    
    // Tracking
    trackedItemsList: '//*[@resource-id="com.sparkstack.costcosaver:id/tracked_items_list"]',
    trackedItem: '//*[@resource-id="com.sparkstack.costcosaver:id/tracked_item_card"]',
    itemName: '//*[@resource-id="com.sparkstack.costcosaver:id/item_name"]',
    itemPrice: '//*[@resource-id="com.sparkstack.costcosaver:id/current_price"]',
    deleteButton: '//*[@resource-id="com.sparkstack.costcosaver:id/delete_button"]',
    
    // Notifications
    notificationArea: '//*[@resource-id="com.android.systemui:id/notification_stack_scroller"]',
    notificationButton: '//*[contains(@class, "NotificationItemView")]',
  },

  /**
   * Find element by selector
   */
  async findElement(selector, timeout = 10000) {
    try {
      return await $().waitForDisplayed(timeout);
    } catch (error) {
      throw new Error(`Element not found: ${selector}`);
    }
  },

  /**
   * Type text into field
   */
  async typeText(selector, text) {
    const element = await $(selector);
    await element.setValue(text);
  },

  /**
   * Click element
   */
  async click(selector) {
    const element = await $(selector);
    await element.click();
  },

  /**
   * Get text from element
   */
  async getText(selector) {
    const element = await $(selector);
    return await element.getText();
  },

  /**
   * Scroll within element
   */
  async scroll(direction = 'down', duration = 1000) {
    const size = await driver.window.size();
    const startX = size.width / 2;
    const startY = size.height / 2;
    let endX = startX;
    let endY = startY + 250;

    if (direction === 'up') {
      endY = startY - 250;
    }

    await driver.action('pointer')
      .move({ x: startX, y: startY })
      .down()
      .move({ x: endX, y: endY, duration })
      .up()
      .perform();
  },

  /**
   * Wait for element to be displayed
   */
  async waitForElement(selector, timeout = 10000) {
    return await $(selector).waitForDisplayed({ timeout });
  },

  /**
   * Accept system permission dialog (Android)
   */
  async acceptPermissionDialog() {
    try {
      const allowButton = await $('//*[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
      if (await allowButton.isDisplayed()) {
        await allowButton.click();
        await driver.pause(500);
      }
    } catch (e) {
      // Permission dialog might not appear
    }
  },

  /**
   * Go back (Android back button)
   */
  async goBack() {
    await driver.back();
  },

  /**
   * Get current URL/Activity
   */
  async getCurrentActivity() {
    return await driver.getCurrentActivity();
  },

  /**
   * Pause execution
   */
  async pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
};

module.exports = driver;
