import test from "node:test";
import assert from "node:assert/strict";

import { MockAuthService } from "./support/harness.mjs";

test("AUTH-EMAIL-01 registers with valid email and password", async () => {
    const auth = new MockAuthService();
    const result = await auth.signUp("qa.user@example.com", "secure123");

    assert.equal(result.error, null);
    assert.equal(result.user.email, "qa.user@example.com");
    assert.match(result.emailRedirectTo, /auth\/callback$/);
});

test("AUTH-EMAIL-02 rejects duplicate email registration", async () => {
    const auth = new MockAuthService({
        registeredUsers: [{ id: "user-1", email: "qa.user@example.com", password: "secure123" }],
    });

    const result = await auth.signUp("qa.user@example.com", "secure123");
    assert.match(result.error.message, /already registered/i);
});

test("AUTH-EMAIL-03 rejects short passwords during registration", async () => {
    const auth = new MockAuthService();
    const result = await auth.signUp("qa.user@example.com", "123");

    assert.match(result.error.message, /at least 6/i);
});

test("AUTH-EMAIL-04 signs in successfully with email and password", async () => {
    const auth = new MockAuthService({
        registeredUsers: [{ id: "user-1", email: "qa.user@example.com", password: "secure123" }],
    });

    const result = await auth.signIn("qa.user@example.com", "secure123");
    assert.equal(result.error, null);
    assert.equal(result.session.user.email, "qa.user@example.com");
});

test("AUTH-EMAIL-05 rejects invalid login credentials", async () => {
    const auth = new MockAuthService({
        registeredUsers: [{ id: "user-1", email: "qa.user@example.com", password: "secure123" }],
    });

    const result = await auth.signIn("qa.user@example.com", "wrongpass");
    assert.match(result.error.message, /invalid login credentials/i);
});

test("AUTH-GOOGLE-01 starts Google OAuth redirect successfully", async () => {
    const auth = new MockAuthService();
    const result = await auth.signInWithOAuth("google");

    assert.equal(result.provider, "google");
    assert.equal(result.status, "redirecting");
});

test("AUTH-APPLE-01 starts Apple OAuth redirect successfully", async () => {
    const auth = new MockAuthService();
    const result = await auth.signInWithOAuth("apple");

    assert.equal(result.provider, "apple");
    assert.equal(result.status, "redirecting");
});

test("AUTH-FACEBOOK-01 starts Facebook OAuth redirect successfully", async () => {
    const auth = new MockAuthService();
    const result = await auth.signInWithOAuth("facebook");

    assert.equal(result.provider, "facebook");
    assert.equal(result.status, "redirecting");
});

test("AUTH-OAUTH-02 surfaces provider-specific OAuth failures", async () => {
    const auth = new MockAuthService({
        oauthFailures: {
            google: "Google auth temporarily unavailable",
            apple: "Apple auth temporarily unavailable",
            facebook: "Facebook auth temporarily unavailable",
        },
    });

    await assert.rejects(() => auth.signInWithOAuth("google"), /Google auth temporarily unavailable/);
    await assert.rejects(() => auth.signInWithOAuth("apple"), /Apple auth temporarily unavailable/);
    await assert.rejects(() => auth.signInWithOAuth("facebook"), /Facebook auth temporarily unavailable/);
});

test("AUTH-SESSION-01 sign out clears active sessions", async () => {
    const auth = new MockAuthService({
        registeredUsers: [{ id: "user-1", email: "qa.user@example.com", password: "secure123" }],
    });

    await auth.signIn("qa.user@example.com", "secure123");
    assert.equal(auth.sessions.length, 1);

    const result = await auth.signOut();
    assert.equal(result.error, null);
    assert.equal(auth.sessions.length, 0);
});
