/**
 * Custom assertions for Android E2E tests
 */

const { expect } = require('chai');

const assertions = {
  /**
   * Assert element is displayed and visible
   */
  async isDisplayed(selector, message = '') {
    const element = await $(selector);
    expect(await element.isDisplayed(), message || `Element ${selector} is not displayed`).to.be.true;
  },

  /**
   * Assert element is not displayed
   */
  async isNotDisplayed(selector, message = '') {
    const element = await $(selector);
    expect(await element.isDisplayed(), message || `Element ${selector} is displayed`).to.be.false;
  },

  /**
   * Assert element exists in DOM
   */
  async elementExists(selector, message = '') {
    const element = await $(selector);
    expect(await element.isExisting(), message || `Element ${selector} does not exist`).to.be.true;
  },

  /**
   * Assert text content matches
   */
  async textMatches(selector, expectedText, message = '') {
    const element = await $(selector);
    const text = await element.getText();
    expect(text).to.include(expectedText, message || `Text "${text}" does not include "${expectedText}"`);
  },

  /**
   * Assert text equals exactly
   */
  async textEquals(selector, expectedText, message = '') {
    const element = await $(selector);
    const text = await element.getText();
    expect(text).to.equal(expectedText, message || `Expected "${expectedText}" but got "${text}"`);
  },

  /**
   * Assert element count
   */
  async elementCount(selector, expectedCount, message = '') {
    const elements = await $$(selector);
    expect(elements.length).to.equal(expectedCount, message || `Expected ${expectedCount} elements but found ${elements.length}`);
  },

  /**
   * Assert element is enabled
   */
  async isEnabled(selector, message = '') {
    const element = await $(selector);
    expect(await element.isEnabled(), message || `Element ${selector} is not enabled`).to.be.true;
  },

  /**
   * Assert element is disabled
   */
  async isDisabled(selector, message = '') {
    const element = await $(selector);
    expect(await element.isEnabled(), message || `Element ${selector} is enabled`).to.be.false;
  },

  /**
   * Assert attribute value
   */
  async attributeEquals(selector, attribute, expectedValue, message = '') {
    const element = await $(selector);
    const value = await element.getAttribute(attribute);
    expect(value).to.equal(expectedValue, message || `Attribute ${attribute} expected "${expectedValue}" but got "${value}"`);
  },

  /**
   * Assert attribute contains value
   */
  async attributeIncludes(selector, attribute, expectedValue, message = '') {
    const element = await $(selector);
    const value = await element.getAttribute(attribute);
    expect(value).to.include(expectedValue, message || `Attribute ${attribute} value "${value}" does not include "${expectedValue}"`);
  },

  /**
   * Assert element has class
   */
  async hasClass(selector, className, message = '') {
    const element = await $(selector);
    const classes = await element.getAttribute('class');
    expect(classes).to.include(className, message || `Element does not have class ${className}`);
  },

  /**
   * Assert view is focused
   */
  async isFocused(selector, message = '') {
    const element = await $(selector);
    const focused = await element.getAttribute('focused');
    expect(focused).to.equal('true', message || `Element ${selector} is not focused`);
  },

  /**
   * Wait for element and assert visibility
   */
  async waitAndAssertVisible(selector, timeout = 10000, message = '') {
    try {
      await $(selector).waitForDisplayed({ timeout });
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(message || `Element ${selector} did not become visible within ${timeout}ms`);
    }
  },

  /**
   * Wait for element to disappear
   */
  async waitForDisappear(selector, timeout = 5000, message = '') {
    try {
      await $(selector).waitForDisplayed({ timeout, reverse: true });
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(message || `Element ${selector} did not disappear within ${timeout}ms`);
    }
  },

  /**
   * Assert URL contains
   */
  async currentUrlContains(urlPart, message = '') {
    const url = await driver.getUrl();
    expect(url).to.include(urlPart, message || `Current URL "${url}" does not contain "${urlPart}"`);
  },

  /**
   * Assert current activity (Android specific)
   */
  async currentActivityIs(expectedActivity, message = '') {
    const activity = await driver.getCurrentActivity();
    expect(activity).to.include(expectedActivity, message || `Expected activity "${expectedActivity}" but got "${activity}"`);
  },

  /**
   * Assert toast message
   */
  async toastDisplayed(expectedText, timeout = 5000) {
    const toastSelector = `//*[@class="android.widget.Toast"][contains(@text, "${expectedText}")]`;
    try {
      await $(toastSelector).waitForDisplayed({ timeout });
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(`Toast with text "${expectedText}" was not displayed`);
    }
  },

  /**
   * Assert notification displayed
   */
  async notificationDisplayed(titleText, timeout = 5000) {
    const notificationSelector = `//*[contains(@text, "${titleText}")]`;
    try {
      await $(notificationSelector).waitForDisplayed({ timeout });
      expect(true).to.be.true;
    } catch (error) {
      expect.fail(`Notification with title "${titleText}" was not displayed`);
    }
  }
};

module.exports = assertions;
