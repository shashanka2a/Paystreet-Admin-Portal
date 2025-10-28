## Paystreet ↔ Wallex Integration – Current Status and Fix Plan


Reference: Wallex Partner API overview – https://docs.wallex.asia/docs/intro


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


### Notes
- The admin app already uses the provider–adapter pattern and v2 auth in `WallexAdapter`. The above gaps are endpoint access/path details, not structural changes.


