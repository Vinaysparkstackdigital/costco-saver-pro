# Live Auth E2E Plan

This plan covers staging validation for real authentication flows that cannot be fully trusted through mocked automation alone.

## Goal

Validate that these flows work against live staging configuration:

- Email/password registration
- Email/password login
- Google sign-in
- Apple sign-in
- Facebook sign-in
- Sign-out
- Auth redirect back into the iOS app
- Session persistence after relaunch

## Why This Is Separate

The automated QA suite under `tests/qa` already validates app-side auth logic and provider initiation paths.

This plan exists because live OAuth providers add external dependencies that mocks do not cover:

- provider redirect configuration
- native redirect handling
- Supabase staging auth settings
- Apple/Google/Facebook provider setup
- account-level restrictions, MFA, consent, and revoked sessions

## Environment

- App build: Staging iOS build
- Platform: iPhone, iOS 16+
- Backend: Staging Supabase project
- Redirect scheme: verify native auth callback is configured for staging
- Test accounts:
  - `qa.email.user+new@example.com`
  - `qa.email.user+existing@example.com`
  - test Google account
  - test Apple ID
  - test Facebook account

## Preconditions

- Staging auth providers are enabled in Supabase
- Provider client IDs/secrets are valid
- Redirect URLs match staging app scheme and Supabase settings
- Test accounts exist and are accessible
- Push and session storage do not block auth callback handling

## Test Cases

| Test ID | Scenario | Steps | Expected Result | Priority |
|---|---|---|---|---|
| AUTH-LIVE-01 | Register with email/password | Open auth dialog, switch to Sign Up, submit new email/password | Account created, success toast shown, redirect or authenticated state established | High |
| AUTH-LIVE-02 | Login with existing email/password | Sign in with valid existing credentials | User is signed in and session is created | High |
| AUTH-LIVE-03 | Reject invalid email/password | Sign in with wrong password | Error toast shown, no session created | High |
| AUTH-LIVE-04 | Google sign-in | Tap Google, complete provider flow | Returns to app authenticated as Google user | High |
| AUTH-LIVE-05 | Apple sign-in | Tap Apple, complete provider flow | Returns to app authenticated as Apple user | High |
| AUTH-LIVE-06 | Facebook sign-in | Tap Facebook, complete provider flow | Returns to app authenticated as Facebook user | High |
| AUTH-LIVE-07 | Cancel provider login | Start OAuth flow, cancel before completion | App returns gracefully, no broken loading state, no session created | Medium |
| AUTH-LIVE-08 | Redirect handling | Complete OAuth login | App opens through native callback and lands in authenticated state | High |
| AUTH-LIVE-09 | Session persistence | Sign in, terminate app, relaunch | User remains signed in | High |
| AUTH-LIVE-10 | Sign out | Sign in, then sign out from UI | Session cleared and app returns to signed-out state | High |
| AUTH-LIVE-11 | Repeat login after sign-out | Sign out, then sign in again | User can log back in successfully | Medium |
| AUTH-LIVE-12 | Existing registered email on sign-up | Attempt sign-up with already registered email | Clear error shown, no duplicate account created | Medium |

## Provider-Specific Checks

### Google

- Consent screen completes without redirect mismatch
- Returning user login works
- Revoked access can be re-granted cleanly

### Apple

- Apple login works on device
- Hide My Email accounts still create valid app session
- Re-login works after prior authorization

### Facebook

- Consent screen loads correctly
- Return redirect succeeds
- Existing Facebook-linked user maps to correct app account

## Edge Cases

- Network drop during OAuth redirect
- User force-closes app during provider flow
- Provider returns error or denied consent
- Callback URL opens app but session exchange fails
- Device has stale prior provider session
- Same email exists across email/password and social login

## Evidence to Capture

For each live E2E run, record:

- device and iOS version
- build number
- auth provider used
- test account used
- screenshots of start, redirect, and final signed-in state
- any Supabase auth logs or provider console errors

## Exit Criteria

- All High priority tests pass
- No redirect mismatch or callback failures
- No broken loading states after provider cancellation
- Sign-out and relaunch behavior confirmed

## Execution Notes

- Run before release candidate sign-off
- Re-run after any changes to:
  - auth redirect handling
  - Supabase project settings
  - bundle ID / URL scheme
  - Apple/Google/Facebook provider configuration

## Relationship to Automated Suite

Use both layers:

- `npm run test:qa`
  - fast deterministic validation of app-side auth and business logic
- this live staging auth E2E plan
  - validates real provider integration and callback behavior
