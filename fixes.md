## Paystreet ↔ Wallex Integration – Current Status and Fix Plan

This doc compiles what works today, what doesn’t, and what we still need from the Wallex docs to finish hardening the integration.

Reference: Wallex Partner API overview – https://docs.wallex.asia/docs/intro


### Environment and Auth
- Base URL currently used by tests: `https://api-sg.wallex.plus`
- Recommended base URL per docs: `https://api.wallex.asia`
- Auth method: Bearer token via `POST /v2/authenticate` plus `X-Api-Key` header
- Status: Authentication working (token issued and used successfully)


### API Endpoints – Working vs Not Working (as tested)

- Working
  - `POST /v2/authenticate` – returns bearer token
  - `GET /v2/balances` – 200 OK (returns data + pagination)
  - `GET /v2/beneficiaries` – 200 OK (returns data + pagination)
  - `GET /v2/payments` – 200 OK (returns data + pagination)

- Not working or restricted
  - `GET /v2/collections/accounts` – 400 NOT_AUTHORIZED
    - Likely permission/plan gating; now handled gracefully in code (returns empty array)
  - `GET /v2/transactions` (and tried `/v2/transactions/list`, `/v2/transactions/search`) – 404 Not Found
    - Endpoint path appears different for our tenant/environment; needs exact path from docs/account

- Legacy/SigV4 tests
  - v1-style SigV4 endpoints return 403/invalid token and are not used by the app. We did not migrate these; they are for reference only.


### Code Adjustments Made
- Provider `WallexAdapter` now handles:
  - `collections accounts` NOT_AUTHORIZED → returns `[]` (prevents UI breakage)
  - `transactions` 404 → returns `[]` (prevents UI breakage)
- No linter errors introduced.


### What We Need From Documentation/Account Setup
To finalize integration and enable all checks to pass, we need:

1) Exact v2 Transactions listing endpoint
   - Confirm the correct route and any base path nuances for our environment (e.g. `/v2/transactions`, `/v2/payments/transactions`, `/v2/ledger/transactions`, etc.).
   - Expected response shape (top-level `data` + `pagination`?) and query params (paging, date filters, status filters).

2) Collections Accounts permissions/scope
   - Required scopes/plan or feature flag for `GET /v2/collections/accounts`.
   - Any allowlists per IP/org that must be configured.

3) Base URL confirmation
   - Should we move all calls to `https://api.wallex.asia` (recommended) vs `https://api-sg.wallex.plus`? If yes, confirm there are no region-specific differences.

4) Error model and pagination
   - Canonical error codes/messages for v2 endpoints used above (especially NOT_AUTHORIZED variants).
   - Pagination contract (`page`, `limit`, `nextToken` or cursor fields).

5) Rate limits and best practices
   - Per-endpoint rate limits and backoff guidance (429 behavior) so we can tune react-query refresh intervals.


### Action Items
- If staying on v2 only (recommended by docs):
  1. Provide or confirm the correct Transactions endpoint; we will update the test and adapter.
  2. Confirm/enable access for Collections Accounts in our Wallex tenant; once enabled, the existing code path will work.
  3. Switch `.env`/`.env.local` base URL to `https://api.wallex.asia` unless a regional host is required.


### How to Re-Run Tests Locally
- V2 connectivity and endpoints:
  - `npm run wallex:v2`
- Legacy SigV4 experiment (kept for reference only):
  - `npm run wallex:sigv4`


### Notes
- The admin app already uses the provider–adapter pattern and v2 auth in `WallexAdapter`. The above gaps are endpoint access/path details, not structural changes.


