# QA Automation Suite

This suite provides deterministic automation coverage for the app's core flows using seeded test data and in-memory mocks.

## Coverage

- Receipt upload and OCR extraction
- Automated price tracking and scheduled refresh
- Price drop notification behavior
- Authentication flows: email/password, Google, Apple, Facebook
- End-to-end upload -> track -> drop -> alert flows
- Duplicate prevention and retry scenarios
- Batch/performance-style simulations for 100 tracked items

## Run

```bash
npm run test:qa
```

## Structure

- `fixtures/receipt-fixtures.json`: receipt parsing test data
- `support/harness.mjs`: in-memory parser, tracking store, scheduler, and notification mocks
- `receipt-upload.test.mjs`: receipt/OCR coverage
- `price-tracking.test.mjs`: tracking and scheduler coverage
- `notifications.test.mjs`: alert coverage
- `authentication.test.mjs`: email/password and OAuth auth coverage
- `e2e-flow.test.mjs`: end-to-end scenario coverage

## Notes

- This suite is service-level automation. It avoids live Supabase, push infrastructure, and device dependencies.
- It is intended for CI and fast QA validation.
- If you later add Playwright or XCUI tests, keep this suite as the fast preflight layer and add device/UI coverage on top.
