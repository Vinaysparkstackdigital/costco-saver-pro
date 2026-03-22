import test from "node:test";
import assert from "node:assert/strict";

import { AutomationHarness, createTestFile } from "./support/harness.mjs";
import { loadFixture } from "./support/fixtures.mjs";

const parserFixtures = loadFixture("receipt-fixtures.json");

test("APT-01 tracks an item after receipt upload", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));

    assert.equal(harness.store.getItems().length, 1);
});

test("APT-02 runs background monitoring and updates price history", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 7.49 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(harness.store.getItems()[0].currentPrice, 7.49);
    assert.equal(harness.store.getPriceHistory("tracked-1").length, 2);
});

test("APT-03 detects price changes correctly", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 6.99 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(harness.store.getPriceDropCount(), 1);
    assert.equal(harness.store.getSavingsTotal(), 2);
});

test("APT-04 keeps state stable when no price change occurs", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 8.99 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(harness.store.getPriceDropCount(), 0);
    assert.equal(harness.notifications.getAll().length, 0);
});

test("APT-05 tracks multiple items independently", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: {
            "tracked-1": 7.99,
            "tracked-2": 5.99,
            "tracked-3": 4.99,
        },
    });
    await harness.uploadReceipt(createTestFile("multi-item-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.deepEqual(
        harness.store.getItems().map((item) => item.currentPrice),
        [7.99, 5.99, 4.99]
    );
    assert.equal(harness.store.getPriceDropCount(), 2);
});

test("APT-06 retries after a transient network failure", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 7.25 },
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    harness.priceService.failNextForItem("tracked-1", 1);
    await harness.runScheduledPriceCheck({ retries: 2 });

    assert.equal(harness.store.getItems()[0].currentPrice, 7.25);
    assert.equal(harness.retryLog.length, 1);
});

test("APT-07 duplicate tracking prevention is configurable", async () => {
    const harness = new AutomationHarness({ parserFixtures, duplicateStrategy: "prevent" });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));

    assert.equal(harness.store.getItems().length, 1);
});

test("APT edge case: item not found in price database does not corrupt tracked state", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: {},
    });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(harness.store.getItems()[0].currentPrice, 8.99);
});

test("APT performance: can process 100 tracked items in a batch simulation", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const bulkItems = Array.from({ length: 100 }, (_, index) => ({
        itemName: `Bulk Item ${index + 1}`,
        purchasePrice: 10 + index,
        quantity: 1,
        purchaseDate: "2025-02-10",
        receiptNumber: "R-BULK"
    }));
    harness.store.addItems(bulkItems);

    for (const item of harness.store.getItems()) {
        harness.priceService.priceMatrix[item.id] = item.purchasePrice - 0.5;
    }

    await harness.runScheduledPriceCheck();

    assert.equal(harness.store.getItems().length, 100);
    assert.equal(harness.notifications.getAll().length, 100);
});
