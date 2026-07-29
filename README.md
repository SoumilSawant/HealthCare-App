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
tokens. An optional build-time API token is supported for controlled internal
deployments, but an administrator token must never be embedded in a public
browser bundle.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`. For local development, set
   `FRAPPE_PROXY_TARGET=http://healthcare.test:8000` and leave
   `VITE_FRAPPE_URL` empty. For a cross-origin production build, set
   `VITE_FRAPPE_URL`.

3. Start the development server:

   ```bash
   npm run dev
   ```

   The local web UI is available at `http://localhost:8081/`.

   In development, the browser uses same-origin `/api` requests and Vite proxies
   them to `FRAPPE_PROXY_TARGET`. In production, the browser uses
   `VITE_FRAPPE_URL` directly.

4. Run validation:

   ```bash
   npm run typecheck
   npm test
   npm run build
   ```

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

For same-origin deployment, serve the built Vite assets from the same parent
origin as Frappe or reverse-proxy `/api` to Frappe. For cross-origin deployment:

- configure the exact frontend origin in Frappe CORS settings;
- allow credentials and secure session cookies;
- use HTTPS;
- do not use a wildcard origin with credentials;
- ensure CSRF token retrieval is allowed;
- assign `Patient App User` and `Doctor App User` roles only through trusted
  server-side registration/review logic;
- implement record-level permission query conditions before clinical use.

### Authentication used by the frontend

- Patient login: `soulplace.auth.patient_login`
- Patient registration: `soulplace.auth.register_patient`
- Doctor/admin login: Frappe `/api/method/login`
- Session restoration: `frappe.auth.get_logged_user`, followed by the
  authenticated user's User/PatientUser/Doctor records
- Logout: `/api/method/logout`

New patients are linked through `PatientUser.app_user` by the corrected
registration RPC and receive the `Patient App User` role immediately; patients
do not have an approval workflow. A phone-derived compatibility fallback
remains for older records created before that correction. Doctors are linked by
`Doctor.email` because Doctor has no `app_user` field, and only Doctor records
use the admin approval workflow.

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

Read [the backend integration gaps](./docs/backend-integration-gaps.md) before
deployment. Several required server permissions and endpoints are missing or
inconsistent. With demo mode disabled, the UI names these gaps and does not
substitute mock records or invent backend fields. The explicitly enabled local
demo mode is the only frontend-data fallback.

## Dependency advisory note

The project uses the current published `react-router-dom` 7.18.2. As of
2026-07-29, npm reports
[GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)
against React Router 7.12–8.2. The advisory applies only to unstable RSC APIs;
this Vite SPA does not use RSC, actions, server actions, or React Router SSR.
The advisory lists 8.3.0 as patched, but that package was not available from the
npm registry during validation. Upgrade when the patched release is published.
