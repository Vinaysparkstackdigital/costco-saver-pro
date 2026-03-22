import assert from "node:assert/strict";

export function createTestFile(name, options = {}) {
    return {
        name,
        type: options.type ?? "image/jpeg",
        size: options.size ?? 2 * 1024 * 1024,
        quality: options.quality ?? "good",
    };
}

export class MockAuthService {
    constructor({ registeredUsers = [], oauthFailures = {}, authRedirectUrl = "costcosaver://auth/callback" } = {}) {
        this.registeredUsers = new Map(registeredUsers.map((user) => [user.email, { ...user }]));
        this.oauthFailures = { ...oauthFailures };
        this.authRedirectUrl = authRedirectUrl;
        this.sessions = [];
    }

    async signUp(email, password) {
        if (!email.includes("@")) {
            return { error: new Error("Invalid email address") };
        }
        if (password.length < 6) {
            return { error: new Error("Password should be at least 6 characters") };
        }
        if (this.registeredUsers.has(email)) {
            return { error: new Error("User already registered") };
        }

        const user = { id: `user-${this.registeredUsers.size + 1}`, email, password };
        this.registeredUsers.set(email, user);
        return {
            error: null,
            user,
            emailRedirectTo: this.authRedirectUrl,
        };
    }

    async signIn(email, password) {
        const user = this.registeredUsers.get(email);
        if (!user || user.password !== password) {
            return { error: new Error("Invalid login credentials") };
        }

        const session = { accessToken: `token-${user.id}`, user: { id: user.id, email: user.email } };
        this.sessions.push(session);
        return { error: null, session };
    }

    async signInWithOAuth(provider) {
        if (this.oauthFailures[provider]) {
            throw new Error(this.oauthFailures[provider]);
        }

        return {
            provider,
            redirectTo: this.authRedirectUrl,
            status: "redirecting",
        };
    }

    async signOut() {
        this.sessions = [];
        return { error: null };
    }
}

export class MockReceiptParser {
    constructor(fixtures) {
        this.fixtures = fixtures;
    }

    async parseReceiptImage(file) {
        const fixture = this.fixtures[file.name];
        if (!fixture) {
            return { success: false, error: `No fixture registered for ${file.name}` };
        }
        return structuredClone(fixture);
    }
}

export class InMemoryTrackingStore {
    constructor({ duplicateStrategy = "allow" } = {}) {
        this.duplicateStrategy = duplicateStrategy;
        this.items = [];
        this.priceHistory = [];
        this.nextId = 1;
    }

    addItems(items, userId = "qa-user") {
        const inserted = [];
        for (const item of items) {
            const duplicate = this.items.find((existing) =>
                existing.userId === userId &&
                existing.itemName === item.itemName &&
                existing.purchaseDate === item.purchaseDate &&
                existing.receiptNumber === (item.receiptNumber ?? null)
            );

            if (duplicate && this.duplicateStrategy === "prevent") {
                continue;
            }

            const tracked = {
                id: `tracked-${this.nextId++}`,
                userId,
                itemName: item.itemName,
                itemNumber: item.itemNumber ?? null,
                purchasePrice: item.purchasePrice,
                currentPrice: item.currentPrice ?? item.purchasePrice,
                quantity: item.quantity ?? 1,
                purchaseDate: item.purchaseDate,
                storeLocation: item.storeLocation ?? null,
                receiptNumber: item.receiptNumber ?? null,
            };
            this.items.push(tracked);
            this.priceHistory.push({
                trackedItemId: tracked.id,
                price: tracked.purchasePrice,
                recordedAt: new Date().toISOString(),
            });
            inserted.push(tracked);
        }
        return inserted;
    }

    updatePrice(itemId, nextPrice) {
        const item = this.items.find((entry) => entry.id === itemId);
        assert.ok(item, `Unable to find tracked item ${itemId}`);
        item.currentPrice = nextPrice;
        this.priceHistory.push({
            trackedItemId: itemId,
            price: nextPrice,
            recordedAt: new Date().toISOString(),
        });
        return item;
    }

    getItems() {
        return structuredClone(this.items);
    }

    getPriceHistory(itemId) {
        return this.priceHistory.filter((entry) => entry.trackedItemId === itemId);
    }

    getSavingsTotal() {
        return this.items.reduce((total, item) => total + Math.max(item.purchasePrice - item.currentPrice, 0), 0);
    }

    getPriceDropCount() {
        return this.items.filter((item) => item.currentPrice < item.purchasePrice).length;
    }
}

export class MockPriceService {
    constructor(priceMatrix = {}) {
        this.priceMatrix = priceMatrix;
        this.failureCounts = new Map();
    }

    failNextForItem(itemId, times = 1) {
        this.failureCounts.set(itemId, times);
    }

    async checkItemPrice(item) {
        const pendingFailures = this.failureCounts.get(item.id) ?? 0;
        if (pendingFailures > 0) {
            this.failureCounts.set(item.id, pendingFailures - 1);
            throw new Error(`Transient network failure for ${item.id}`);
        }

        const next = this.priceMatrix[item.id];
        if (!next) {
            return { success: false, error: "Item not found in price source" };
        }

        if (Array.isArray(next)) {
            const price = next.length > 1 ? next.shift() : next[0];
            return { success: true, currentPrice: price, itemName: item.itemName };
        }

        return { success: true, currentPrice: next, itemName: item.itemName };
    }
}

export class NotificationCenterMock {
    constructor() {
        this.notifications = [];
        this.sentKeys = new Set();
    }

    sendPriceDrop({ itemId, itemName, originalPrice, currentPrice }) {
        const dedupeKey = `${itemId}:${currentPrice}`;
        if (this.sentKeys.has(dedupeKey)) {
            return false;
        }

        this.sentKeys.add(dedupeKey);
        this.notifications.push({
            itemId,
            itemName,
            originalPrice,
            currentPrice,
            savings: originalPrice - currentPrice,
            sentAt: new Date().toISOString(),
        });
        return true;
    }

    getAll() {
        return structuredClone(this.notifications);
    }
}

export class AutomationHarness {
    constructor({ parserFixtures, duplicateStrategy = "allow", priceMatrix = {} } = {}) {
        this.parser = new MockReceiptParser(parserFixtures ?? {});
        this.store = new InMemoryTrackingStore({ duplicateStrategy });
        this.priceService = new MockPriceService(priceMatrix);
        this.notifications = new NotificationCenterMock();
        this.retryLog = [];
    }

    async uploadReceipt(file, userId = "qa-user") {
        const parsed = await this.parser.parseReceiptImage(file);
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error,
                trackedCount: 0,
                items: [],
            };
        }

        const mappedItems = parsed.items.map((item) => ({
            itemName: item.name,
            itemNumber: item.itemNumber,
            purchasePrice: item.price,
            quantity: item.quantity ?? 1,
            purchaseDate: parsed.metadata?.purchaseDate ?? "2025-01-01",
            storeLocation: parsed.metadata?.storeLocation,
            receiptNumber: parsed.metadata?.receiptNumber,
        }));

        const inserted = this.store.addItems(mappedItems, userId);
        return {
            success: true,
            trackedCount: inserted.length,
            items: inserted,
            metadata: parsed.metadata ?? {},
        };
    }

    async runScheduledPriceCheck({ retries = 1 } = {}) {
        const trackedItems = this.store.getItems();
        for (const item of trackedItems) {
            let attempt = 0;
            while (attempt <= retries) {
                try {
                    const result = await this.priceService.checkItemPrice(item);
                    if (result.success && typeof result.currentPrice === "number") {
                        const updated = this.store.updatePrice(item.id, result.currentPrice);
                        if (updated.currentPrice < updated.purchasePrice) {
                            this.notifications.sendPriceDrop({
                                itemId: updated.id,
                                itemName: updated.itemName,
                                originalPrice: updated.purchasePrice,
                                currentPrice: updated.currentPrice,
                            });
                        }
                    }
                    break;
                } catch (error) {
                    attempt += 1;
                    this.retryLog.push({
                        itemId: item.id,
                        attempt,
                        error: error instanceof Error ? error.message : String(error),
                    });
                    if (attempt > retries) {
                        break;
                    }
                }
            }
        }
    }
}
