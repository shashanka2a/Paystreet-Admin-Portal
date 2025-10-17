## Paystreet Migration, Admin Dashboard, Frontend

**Overall Readiness: 70%**

This document summarizes what’s production-ready and what remains for MVP across three scopes: Paystreet API migration, Admin dashboard, and overall frontend readiness.

---

### Ready for MVP (Production Ready)

#### 1) API Layer and Provider Abstraction (Paystreet → Providers) — 80%

- **Axios Base + Interceptors (Complete)**
  - Centralized `PaystreetService` with `baseURL`, auth header, and 401 handling.
  - Error export/logging wired via `exportApi.allErrorHandle`.

- **Environment Configuration (Mostly Complete)**
  - Central `getEnvironmentConfig` consolidates keys/URLs for Paystreet and future providers (Wallex, Airwallex, Currencycloud).
  - Validation helpers exist for required provider vars; minor polishing needed.

- **Provider Abstraction (Phase 1 live, fallback intact)**
  - `ProviderManager`, `BaseProvider`, and `WallexAdapter` scaffold the provider pattern.
  - `payment.service` tries provider-first, then falls back to legacy Paystreet endpoints.

What works now
- Auth headers and error handling are consistent across services.
- Payments: create/fetch routes fall back to legacy endpoints when a provider is unavailable.
- Export/email endpoints are implemented behind `PaystreetService`.

Gaps (pre-MVP polish)
- Harden `environment.ts` utilities (complete function bodies, add guardrails and tests).
- Extend provider coverage beyond payments (e.g., beneficiaries, conversions) where applicable.
- Add observability around provider selection/fallback paths.

#### 2) Admin Dashboard — 75%

- **Routing and Access (Ready)**
  - Private routes include `AdminDashboard`, `AdminUsers`, `AdminKyc`, `AdminTransactions`.
  - Lazy-loaded admin modules are wired and reachable under `/app/admin/*`.

- **Dashboard Data Fetch (Functional, Needs hardening)**
  - Dashboard aggregates counts from `/v2/users` and `/v2/transactions` via active provider axios instance.
  - Uses pagination `totalEntries` for efficient count reads.

- **UI (Usable)**
  - KPI cards: total clients, active accounts, pending KYCs, total transactions.
  - Alerts: pending KYC and flagged transactions.

Gaps (pre-MVP polish)
- Error handling and empty states should be surfaced to the operator (catch blocks to set messages, retries/backoff for transient errors).
- Add loading skeletons and basic analytics (e.g., time window selectors, trends).
- Permissions: ensure only admin roles can access `/app/admin/*` routes.

#### 3) Frontend Readiness (Routing, Layouts, Core Flows) — 80%

- **Routing (Ready)**
  - Public and Private route maps are comprehensive (onboarding, recipients, send money steps, transactions, reports, settings, admin).
  - Code-splitting via `React.lazy` across pages.

- **Core User Flows (Largely Complete)**
  - Recipients CRUD (multi-step), Send Money steps, Transactions list/details, Reports, Settings, Help/FAQs.
  - Session service endpoints and guards in place; logout-on-401 handled globally.

- **UX (Solid baseline)**
  - Responsive layout, sidebar/navigation components, loading components present.

Gaps (pre-MVP polish)
- Strengthen route guards for role/permission-specific pages (admin vs standard user).
- Tighten form validations and error surfacing for transaction flows.
- Add smoke tests for primary flows (navigate + API happy-paths).

---

### MVP Development Roadmap

#### Phase 1: Complete Paystreet → Provider Migration (2–4 days)
- [ ] Finalize `environment.ts` helpers (validation, provider getters) and add unit tests.
- [ ] Expand provider-first approach to beneficiaries, conversions, collections where relevant.
- [ ] Centralize provider availability checks and structured fallback logging.
- [ ] Add feature flag/env to force provider vs fallback for rollout control.

#### Phase 2: Admin Dashboard Hardening (1–2 days)
- [ ] Implement robust error states and retry/backoff strategies.
- [ ] Add role-guarding for `/app/admin/*` and hide admin nav for non-admins.
- [ ] Add basic analytics widgets (trends, last 7/30 days) and filters.
- [ ] Include CSV export buttons where available datasets support it.

#### Phase 3: Frontend QA and Guardrails (1–2 days)
- [ ] Smoke tests for key flows: login, recipients add/edit, send money, transactions.
- [ ] Permission tests for admin vs user routes.
- [ ] Improve empty states/loading skeletons on primary screens.

---

### Current Status

| Component | Status | Completion | Priority |
|---|---|---:|---|
| API Base (PaystreetService) | ✅ Ready | 100% | ✅ Complete |
| Env Config + Validation | ⚠️ Partial | 70% | 🟡 Medium |
| Provider Abstraction (Payments) | ✅ Ready | 85% | 🟡 High |
| Provider Coverage (Other domains) | ⚠️ Partial | 50% | 🟡 Medium |
| Admin Dashboard | ⚠️ Partial | 75% | 🟡 High |
| Frontend Routing/Core Flows | ✅ Ready | 80% | 🟡 Medium |


---

### Conclusion

The project is in a strong position for an MVP with Paystreet migration in progress and a provider-first architecture already powering payments. Completing env validation, expanding provider coverage, and hardening the admin dashboard/error UX will close the remaining gaps.


