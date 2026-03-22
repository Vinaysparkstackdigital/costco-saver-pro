import test from "node:test";
import assert from "node:assert/strict";

import { AutomationHarness, createTestFile } from "./support/harness.mjs";
import { loadFixture } from "./support/fixtures.mjs";

const parserFixtures = loadFixture("receipt-fixtures.json");

test("E2E-01 full flow: upload receipt, track item, detect drop, notify user", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 6.99 },
    });

    const upload = await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(upload.success, true);
    assert.equal(upload.trackedCount, 1);
    assert.equal(harness.store.getItems()[0].currentPrice, 6.99);
    assert.equal(harness.notifications.getAll().length, 1);
});

test("E2E-02 multi-item flow tracks and alerts independently", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: {
            "tracked-1": 7.99,
            "tracked-2": 5.49,
            "tracked-3": 4.99,
        },
    });

    const upload = await harness.uploadReceipt(createTestFile("multi-item-receipt.jpg"));
    await harness.runScheduledPriceCheck();

    assert.equal(upload.trackedCount, 3);
    assert.equal(harness.notifications.getAll().length, 2);
});

test("E2E-03 retry flow succeeds after an initial failure", async () => {
    const harness = new AutomationHarness({
        parserFixtures,
        priceMatrix: { "tracked-1": 6.49 },
    });

    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    harness.priceService.failNextForItem("tracked-1", 1);
    await harness.runScheduledPriceCheck({ retries: 2 });

    assert.equal(harness.store.getItems()[0].currentPrice, 6.49);
    assert.equal(harness.notifications.getAll().length, 1);
});
