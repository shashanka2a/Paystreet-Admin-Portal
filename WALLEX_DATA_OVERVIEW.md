## Wallex Data Usage Overview

This document summarizes where real-time Wallex data is fetched and displayed in the app, and where placeholder data remains.

### Live Wallex Data (real API)

- Transactions page (`src/components/TransactionsView.tsx`)
  - Hook: `useWallexTransactions({ limit: 100, sort: 'timestamp:desc' })`
  - Backend: `wallexService.getTransactions` → `WallexAdapter.getTransactions()` → `GET /v2/payments`
  - Behavior: auto-refetch every 30s.

- Clients page (`src/components/ClientsView.tsx`)
  - Hook: `useClients()`
  - Backend: `wallexService.getBeneficiaries()` (beneficiaries mapped to client shape)
  - Client transactions panel: `useClientTransactions(clientId)` → `wallexService.getTransactions({ limit: 200 })` filtered by beneficiary id.

- Collections balance fallback (`src/services/collection.service.tsx`)
  - If Wallex available: `wallexService.getBalances()` → `GET /v2/balances` to populate balances for the collection view.

- Shared Wallex hooks (`src/lib/api-hooks.ts`)
  - `useWallexBalances` → `getBalances()` → `GET /v2/balances`
  - `useWallexTransactions` → `getTransactions()` → `GET /v2/payments`
  - `useWallexBeneficiaries` → `getBeneficiaries()`
  - `useCreateWallexPayment`, `useWallexProviderStatus`, etc. call Wallex-backed service methods when used.

### Placeholder / Dummy Data (to be replaced)

- Dashboard (`src/components/DashboardView.tsx`)
  - KPI cards, alerts, and recent activity are static arrays.
  - Not yet using live counts/metrics.

- Legacy mock hooks in `src/lib/api-hooks.ts`
  - `useTransactions` has been wired to Wallex in our changes, but any screen still calling older mock structures should be reviewed.

- Clients mapping
  - `useClients()` maps beneficiaries to a rich `Client` shape; several fields (KYB/KYC, totals, risk) are defaulted until proper endpoints are integrated.

- Client transactions linking
  - `useClientTransactions` filters by `beneficiary.id`/`beneficiaryId`. If your environment links differently, adjust the predicate accordingly.

### What changed in this integration pass

- Switched transaction listings to `GET /v2/payments` (v2), avoiding 404s on legacy `/v2/transactions`.
- Kept collections accounts call (`GET /v2/collections/accounts`) with graceful handling for 400 NOT_AUTHORIZED.
- Wired clients and client transactions to live Wallex data via beneficiaries and payments.

### Suggested next steps to fully go “live”

- Dashboard KPIs
  - Total volume and counts via `useWallexTransactionStats` (already scaffolded in `api-hooks`), or by aggregating results from `useWallexTransactions`.
  - Balances totals via `useWallexBalances`.
  - Flagged count via `useWallexTransactions({ status: 'flagged', limit: 1 })` and pagination/aggregate if available.

- Clients (if you need true user entities)
  - Replace beneficiary mapping with the appropriate Wallex Users endpoints and map to `Client` fields.

- Collections
  - Work with Wallex to enable permissions for `/v2/collections/accounts`; UI already tolerates NOT_AUTHORIZED by returning an empty list.

### Key files

- `src/services/providers/WallexAdapter.ts` – implements v2 API calls
- `src/lib/api-hooks.ts` – hooks exposing Wallex data to UI
- `src/components/TransactionsView.tsx` – uses live transactions
- `src/components/ClientsView.tsx` – beneficiaries as clients; client transactions
- `src/services/collection.service.tsx` – balance integration with Wallex


