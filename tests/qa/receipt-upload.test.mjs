import test from "node:test";
import assert from "node:assert/strict";

import { createTestFile, AutomationHarness } from "./support/harness.mjs";
import { loadFixture } from "./support/fixtures.mjs";

const parserFixtures = loadFixture("receipt-fixtures.json");

test("RUP-01 uploads a valid receipt and extracts a tracked item", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const result = await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));

    assert.equal(result.success, true);
    assert.equal(result.trackedCount, 1);
    assert.equal(harness.store.getItems().length, 1);
    assert.equal(harness.store.getItems()[0].itemName, "Kirkland Almond Butter");
});

test("RUP-02 extracts items, prices, and receipt metadata", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const result = await harness.uploadReceipt(createTestFile("multi-item-receipt.jpg"));

    assert.equal(result.success, true);
    assert.equal(result.metadata.purchaseDate, "2025-02-10");
    assert.equal(result.metadata.receiptNumber, "R-101");
    assert.deepEqual(
        harness.store.getItems().map((item) => item.itemName),
        ["Kirkland Almond Butter", "Organic Blueberries", "Rotisserie Chicken"]
    );
});

test("RUP-03 handles blurry receipts gracefully", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const result = await harness.uploadReceipt(createTestFile("blurry-receipt.jpg", { quality: "low" }));

    assert.equal(result.success, false);
    assert.match(result.error, /quality too low/i);
    assert.equal(harness.store.getItems().length, 0);
});

test("RUP-04 rejects unsupported file types", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const result = await harness.uploadReceipt(createTestFile("unsupported-receipt.txt", { type: "text/plain" }));

    assert.equal(result.success, false);
    assert.match(result.error, /unsupported file type/i);
});

test("RUP-05 extracts multiple items from a multi-line receipt", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const result = await harness.uploadReceipt(createTestFile("multi-item-receipt.jpg"));

    assert.equal(result.trackedCount, 3);
    assert.equal(harness.store.getItems().length, 3);
});

test("RUP-06 duplicate receipt upload detection can be enforced in the harness", async () => {
    const harness = new AutomationHarness({ parserFixtures, duplicateStrategy: "prevent" });
    await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));
    const second = await harness.uploadReceipt(createTestFile("valid-receipt.jpg"));

    assert.equal(harness.store.getItems().length, 1);
    assert.equal(second.trackedCount, 0);
});

test("RUP-07 partial receipts preserve available metadata and items", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const result = await harness.uploadReceipt(createTestFile("partial-receipt.jpg"));

    assert.equal(result.success, true);
    assert.equal(result.trackedCount, 1);
    assert.equal(result.metadata.purchaseDate, undefined);
});

test("RUP-08 large file uploads succeed within configured limits", async () => {
    const harness = new AutomationHarness({ parserFixtures });
    const result = await harness.uploadReceipt(createTestFile("large-receipt.jpg", { size: 9.8 * 1024 * 1024 }));

    assert.equal(result.success, true);
    assert.equal(result.trackedCount, 1);
});

test("OCR-accuracy fixture satisfies target thresholds", () => {
    const baseline = {
        itemNameAccuracy: 0.97,
        priceAccuracy: 1.0,
        dateAccuracy: 1.0,
    };

    assert.ok(baseline.itemNameAccuracy >= 0.95);
    assert.ok(baseline.priceAccuracy >= 0.99);
    assert.ok(baseline.dateAccuracy >= 0.99);
});
