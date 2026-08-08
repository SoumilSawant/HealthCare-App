# SoulPlace Web

SoulPlace Web is a React + TypeScript + Vite application with separate patient,
doctor, and administrator portals backed by the existing SoulPlace Frappe app.
It replaces the previous React Native/Expo entry point for browser use. The
preserved native implementation now lives in `legacy/mobile/`, outside the
Vite TypeScript build.

## Project structure

```
src/
  api/          Typed Frappe services and demo-mode adapter
  auth/         Session provider and role-based guards
  components/   Shared portal shells and UI primitives
  pages/        Patient, doctor, administrator, and auth screens
  test/         Critical workflow and interaction tests
  types/        Shared domain models
  App.tsx       Route tree and providers
  main.tsx      Vite entry point
  styles.css    Global design tokens and responsive styles
docs/
  backend-integration-gaps.md  Backend prerequisites for live integration
  legacy-mobile/               Historical Expo implementation notes
legacy/mobile/                 Preserved, inactive React Native/Expo source
```

Only `src/` is compiled and tested by the web application. The `legacy/`
directory is intentionally kept for reference and is not a supported runtime.

## Stack

- React 19 and TypeScript
- Vite
- React Router
- TanStack Query
- Recharts
- Frappe REST resources and whitelisted RPC methods
- Vitest and Testing Library

No passwords, medical notes, tokens, or other sensitive care data are persisted
to `localStorage`. Cookie sessions use `credentials: "include"` and Frappe CSRF
tokens. Browser API tokens are intentionally unsupported because every
`VITE_*` value is public in the compiled bundle.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`. For local development, set
   `FRAPPE_PROXY_TARGET=http://healthcare.test:8000` and leave
   `VITE_FRAPPE_URL` empty. Production should normally keep API requests
   same-origin through an `/api` reverse proxy.

3. Start the development server:

   ```bash
   npm run dev
   ```

   The local web UI is available at `http://localhost:8081/`.

   In development, the browser uses same-origin `/api` requests and Vite proxies
   them to `FRAPPE_PROXY_TARGET`.

4. Run validation:

   ```bash
   npm run lint
   npm run typecheck
   npm run test:coverage
   npm run build
   npm run test:e2e
   ```

### Google Meet setup

Doctors can create a private Google Meet room from a confirmed video
appointment; the saved link then appears in both doctor and patient appointment
details. To enable creation outside demo mode:

1. Enable the Google Meet REST API in a Google Cloud project.
2. Configure an OAuth consent screen and create an OAuth 2.0 Web client.
3. Add each deployed app origin (for example `http://localhost:8081`) to the
   client's Authorized JavaScript origins.
4. Set `VITE_GOOGLE_CLIENT_ID` to that web client ID and restart/rebuild the app.
5. Before public launch, publish verified homepage, privacy-policy, and terms
   URLs; move the OAuth consent screen from Testing to Production; add the final
   HTTPS origin; and complete Google verification if requested for the
   `meetings.space.created` scope.

The integration requests only the `meetings.space.created` scope when a doctor
clicks **Create Google Meet**. The short-lived Google access token remains in
browser memory; SoulPlace persists only the Meet space identifier and join URL.

## Frontend-only demo mode

To test every portal without connecting to Frappe, create
`.env.development.local` with:

```bash
VITE_DEMO_MODE=true
```

Restart Vite after changing the setting. In demo mode the API layer makes no
Frappe REST or RPC requests; seeded data and mutations live only in browser
memory and reset on reload. The selected demo identity is kept in
`sessionStorage` so a tab can restore its portal, but passwords and medical
records are never persisted.

Demo accounts all use the password `Demo1234!`:

- Patient: `9000000001`
- Approved doctor: `doctor@soulplace.demo`
- Pending doctor: `pending.doctor@soulplace.demo`
- Administrator: `admin@soulplace.demo`

Patients become active immediately and have no approval state or admin approval
actions. Doctor approval remains available in the administrator portal.
Remove `.env.development.local`, or set `VITE_DEMO_MODE=false`, to reconnect the
typed API layer to Frappe. Demo mode defaults to off in `.env.example` and
should remain off for production builds.

## Frappe configuration

The audited backend source is
[`dheer-java/Soulplace`](https://github.com/dheer-java/Soulplace), branch
`develop`, commit `130a924391dc8f4564f333ca8b5ac86271db99f1`.

For production, serve the built Vite assets from the same origin as Frappe or
reverse-proxy `/api` to Frappe. `public/_headers`, `public/_redirects`, and
`vercel.json` provide security headers and SPA fallback for compatible hosts.
For a deliberate cross-origin deployment:

- configure the exact frontend origin in Frappe CORS settings;
- allow credentials and secure session cookies;
- use HTTPS;
- do not use a wildcard origin with credentials;
- ensure CSRF token retrieval is allowed;
- assign `Patient App User` and `Doctor App User` roles only through trusted
  server-side registration/review logic;
- extend `connect-src` in the production CSP with the exact Frappe origin.

### Authentication used by the frontend

- Patient login: `soulplace.auth.patient_login`
- Patient registration: `soulplace.auth.register_patient`
- Patient OTP: `soulplace.auth.request_patient_otp` and
  `soulplace.auth.verify_patient_otp`
- Doctor registration: `soulplace.api.register_doctor`
- Doctor/admin login: Frappe `/api/method/login`
- Session restoration: `soulplace.api.get_portal_identity`
- Logout: `/api/method/logout`

New patients are linked through `PatientUser.app_user` by the corrected
registration RPC and receive the `Patient App User` role immediately; patients
do not have an approval workflow. A phone-derived compatibility fallback
remains for older records created before that correction. Doctors are linked by
the unique `Doctor.app_user` field and remain restricted until an administrator
records an approval decision.

## Portal routes

- Patient: `/patient/*`
- Doctor: `/doctor/*`
- Admin: `/admin/*`

The portal layouts are intentionally different. Route guards prevent
cross-portal navigation, and pending/rejected doctors are restricted to
`/doctor/pending`.

## API architecture

Generic, typed Frappe operations are in `src/api/client.ts`. Domain services are
split into:

- `auth.ts`
- `patients.ts`
- `doctors.ts`
- `appointments.ts`
- `consultations.ts`
- `prescriptions.ts`
- `teleconsult.ts`
- `consents.ts`
- `admin.ts`

All backend-driven screens expose loading, empty, error, retry, disabled-submit,
and mutation-feedback states. Query invalidation refreshes appointment,
availability, consultation, prescription, and approval data after updates.

## Deployment gate

Read the [production checklist](./docs/production-checklist.md) and
[runbook](./docs/production-runbook.md). The previously blocking backend
permission, ownership, transaction, scheduling, registration, OTP, and audit
issues are implemented locally. Google production verification, SMS delivery,
legal policy approval, final hostnames, backups, and alert destinations remain
environment-owned release gates.

## Dependency advisory note

The project pins `react-router-dom` 7.18.2, the patched boundary for
GHSA-qwww-vcr4-c8h2. `npm audit` is enforced in CI and currently reports no
known vulnerabilities.
