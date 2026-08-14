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

1. Create a Google Cloud project owned by the SoulPlace organization—not a
   developer's personal Google account—and enable the Google Meet REST API.
   Give at least two organization administrators access for continuity.
2. Configure an OAuth consent screen and create an OAuth 2.0 Web client.
3. Use separate Google Cloud projects for development/staging and production.
   Add each exact app origin (for example `http://localhost:8081`) to the
   client's Authorized JavaScript origins; production origins must use HTTPS.
4. Set `VITE_GOOGLE_CLIENT_ID` to that web client ID and restart/rebuild the app.
   `.env.local` is intentionally ignored by Git, so every developer must set
   this value on their own machine.
5. While the consent screen is in **Testing**, add each doctor or developer's
   Google Account under **Google Auth Platform → Audience → Test users**. A
   Gmail address is not required: the person can create a Google Account using
   their existing professional email. An account that is not listed cannot
   complete the local OAuth flow.
6. Before public launch, publish verified homepage, privacy-policy, and terms
   URLs; move the OAuth consent screen from Testing to Production; add the final
   HTTPS origin; and complete Google verification if requested for the
   `meetings.space.created` scope.

The integration requests only the `meetings.space.created` scope when a doctor
clicks **Create Google Meet**. The short-lived Google access token remains in
browser memory and is never persisted by SoulPlace. Rooms use the Google
account's access and moderation defaults. Consumer Google accounts default to
restricted access; Google Workspace deployments must enforce the clinic's
required access policy through their Workspace administrator. External patients
may need to ask to join and be admitted by the doctor. SoulPlace persists the
Meet space identifier, join URL, scheduled time, participants, and lifecycle
status—not the Google token or clinical notes.

SoulPlace suggests the signed-in doctor's professional email in Google's
authorization flow. The doctor can use a Google Account created with that
non-Gmail address or choose a clinic-managed Google Workspace account. Meetings
are created only under the account the doctor chooses; no developer or
SoulPlace administrator's personal Google account is required at runtime.

To reproduce real Meet creation on another development machine:

1. Check out matching frontend and Soulplace backend revisions, then install
   dependencies and run the backend migrations.
2. Copy `.env.example` to `.env.local`, keep `VITE_DEMO_MODE=false`, set
   `FRAPPE_PROXY_TARGET` to that machine's Frappe site, and set the OAuth Web
   client ID in `VITE_GOOGLE_CLIENT_ID`.
3. Run the frontend on an origin already listed in the OAuth client's
   Authorized JavaScript origins, such as `http://localhost:8081`.
4. Add the doctor or developer's Google Account as an OAuth test user while the
   app is in Testing. That Google Account may use an existing non-Gmail email.
5. Create linked patient and approved doctor users in that local Frappe site,
   then create and confirm a teleconsult appointment before testing Meet.

The deployment and two-path manual acceptance procedure are documented in
[`docs/google-meet-production.md`](docs/google-meet-production.md).

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

The matching backend source is
[`dheer-java/Soulplace`](https://github.com/dheer-java/Soulplace), branch
`develop`. Deploy the frontend and backend revisions together and record both
commit IDs in the release manifest.

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

All mutation services pass through `src/validation.ts` before making a request.
The backend repeats these checks and remains the source of truth for permissions,
ownership, allowed status transitions, slot availability, and clinical data.

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
