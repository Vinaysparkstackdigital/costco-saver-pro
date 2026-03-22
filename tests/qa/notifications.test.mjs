import test from "node:test";
import assert from "node:assert/strict";

import { AutomationHarness, createTestFile } from "./support/harness.mjs";
import { loadFixture } from "./support/fixtures.mjs";

const parserFixtures = loadFixture("receipt-fixtures.json");

test("PDA-01 sends an alert on price drop", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 6.99 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(harness.notifications.getAll().length, 1);
    assert.equal(harness.notifications.getAll()[0].savings, 2);
});

test("PDA-02 sends no alert when price is unchanged", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 8.99 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(harness.notifications.getAll().length, 0);
});

test("PDA-03 prevents duplicate alerts for the same item and price", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": [6.99, 6.99] },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();
    await harness.runScheduledPriceCheck();

    assert.equal(harness.notifications.getAll().length, 1);
});

test("PDA-04 background app state still allows alert generation in automation", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 6.49 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(harness.notifications.getAll()[0].itemName, "Kirkland Almond Butter");
});

test("PDA-06 notification payload supports opening the correct item", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 6.99 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    const notification = harness.notifications.getAll()[0];
    assert.equal(notification.itemId, "tracked-1");
});

test("PDA-08 retry queue handles temporary network outages before alerting", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 6.79 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    harness.priceService.failNextForItem("tracked-1", 1);
    await harness.runScheduledPriceCheck({ retries: 2 });

    assert.equal(harness.notifications.getAll().length, 1);
    assert.equal(harness.retryLog.length, 1);
});

test("PDA edge case: same item tracked by multiple users triggers per-user notifications", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: {
            "tracked-1": 6.99,
            "tracked-2": 6.99,
        },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"), "user-a");
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"), "user-b");
    await harness.runScheduledPriceCheck();

    assert.equal(harness.notifications.getAll().length, 2);
});
