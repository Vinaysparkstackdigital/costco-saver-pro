# CostcoSaver iOS Implementation Plan

## Current Product Feature Audit

The existing app is already structured as a cross-platform React and Capacitor product, not an Android-only native codebase. The functional feature set is:

- Receipt ingestion: upload or capture a receipt, send it to the `parse-receipt` Supabase Edge Function, and extract item lines plus receipt metadata.
- Purchase tracking: persist tracked purchases in Supabase with purchase price, purchase date, quantity, receipt number, and store location.
- Price monitoring: call the `check-price` Supabase Edge Function per item, update current prices, and persist price history.
- Savings dashboard: compute total savings, price-drop counts, tracked-item counts, and refund urgency based on Costco's 30-day price-adjustment window.
- Alerts: surface in-app alerts for price drops and send native local notifications when running on a device.
- Authentication: email/password plus OAuth providers backed by Supabase.

## Logical Issues Resolved In This Pass

- Native OAuth redirecting to `window.location.origin` would not reliably complete inside an iOS shell. The app now uses a native callback URL and listens for Capacitor deep-link events.
- Sign in with Apple was present in the auth hook but missing from the UI. The auth dialog now exposes it.
- Receipt capture relied on browser file inputs. The app now uses the Capacitor Camera plugin for native camera and photo-library access.
- The tracked-items screen still referenced the old `PriceDrop` brand. That inconsistency is now removed.

## iOS Translation Plan By Feature

### 1. Authentication

- Keep Supabase as the auth backend.
- Use PKCE and a custom callback URL for iOS.
- Add the `App` and `Browser` Capacitor plugins so the app can receive OAuth callbacks and close the browser after sign-in.
- Enable the Sign in with Apple capability in Xcode before App Store submission.

### 2. Receipt Capture And OCR

- Use the Capacitor Camera plugin for `Camera` and `Photos` sources on iPhone.
- Keep the existing Supabase receipt-parsing function so OCR behavior remains consistent across Android, iOS, and web.
- Add `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` to `Info.plist` after generating the iOS target.

### 3. Price Tracking And Refund Workflow

- Reuse the current Supabase-backed tracked-item and price-history model.
- Preserve the 30-day refund countdown logic.
- Keep the "Check All Prices" workflow but evaluate background refresh in a later phase if scheduled updates become a product requirement.

### 4. Notifications

- Continue using Capacitor local notifications for price-drop alerts.
- Add push-notification credentials only if remote alerts are required; the current app behavior is local-device notification delivery.

### 5. UI And Platform Fit

- Reuse the shared React UI initially to minimize regression risk.
- Keep mobile-first layouts and verify safe-area spacing, modal behavior, and gesture interactions in the iOS simulator.
- If deeper native polish is needed later, move high-touch flows such as receipt capture, alerts, and tracked-item detail into native SwiftUI screens incrementally.

## Xcode Setup Steps

The repository now includes scripts for the iOS workflow, but this machine does not currently have Node.js or npm available, so the iOS project could not be generated in this session.

Once Node.js is installed:

1. Run `npm install`.
2. Run `npm run cap:add:ios`.
3. Run `npm run ios:build`.
4. Run `npm run cap:open:ios` to open the generated Xcode workspace.
5. In Xcode, add URL Types for `com.sparkstack.costcosaver`.
6. In Xcode, add `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` to `Info.plist`.
7. In Xcode, enable the Sign in with Apple capability if Apple OAuth will ship.
8. In Supabase Auth settings, add `com.sparkstack.costcosaver://auth/callback` as an allowed redirect URL.

## Remaining Validation Work

After the iOS target is generated, validate:

- Email sign-up and OAuth callbacks on a simulator and a physical device.
- Camera capture and photo-library import permissions.
- Local notification permission prompts and delivery.
- Safe-area handling on current iPhone sizes.
- App Store metadata, privacy disclosures, and sign-in compliance.
