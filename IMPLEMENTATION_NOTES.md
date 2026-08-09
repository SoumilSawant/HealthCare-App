# SoulPlace Frontend Implementation Notes

Last updated: 2026-08-09

This document records the frontend work currently present in the local working tree. It is intended for reviewers and coworkers who will test or merge the feature. These changes are not a substitute for the backend changes documented in the Soulplace backend repository.

## Feature summary

The frontend now supports:

- submitting the doctor application form to `soulplace.auth.register_doctor`;
- collecting a real patient email address during registration;
- sending that address to `soulplace.auth.register_patient`;
- preserving patient email in demo-mode data;
- displaying progress while a doctor confirms or completes an appointment;
- displaying the backend error when an appointment status update fails.

The patient still signs in with their phone number and password. The email address is contact information for appointment notifications; it does not replace the existing phone-derived Frappe login ID.

## Changed files

### `src/api/auth.ts`

- Added the typed `DoctorRegistrationResponse` contract.
- Added `email` to the patient registration request contract.
- Added `authApi.registerDoctor()`.
- Connected doctor registration to the whitelisted Frappe RPC method `soulplace.auth.register_doctor`.

### `src/api/demo.ts`

- Added example email addresses to seeded demo patients.
- Added email to the demo patient-registration input and stored patient record.

### `src/pages/auth.tsx`

- Added a required Email Address field to patient registration.
- Sends the patient email to the registration API.
- Prevents continuing while the required email is empty.
- Replaced the disabled doctor application with a working submission flow.
- Added names and value mappings for doctor form fields.
- Added loading, upload, API-error, success-toast, and post-success navigation behavior.
- Calls `soulplace.auth.register_doctor` and returns the applicant to the doctor login page after a successful application.
- Verification-document upload remains optional in the current UI.

### `src/pages/doctor.tsx`

- Disables the appointment action while its mutation is running.
- Shows `Confirming…` and `Updating…` progress labels.
- Shows normalized Frappe errors instead of making a failed click appear to do nothing.

### `src/pages/patient.tsx`

- Adds the missing string type to available appointment-slot values so strict TypeScript validation and production builds succeed.

### `src/test/api.test.ts`

- Updated the patient-registration contract test to include email.
- Added a doctor-registration RPC contract test.
- Updated appointment request and cancellation expectations to the canonical URL-encoded `Patient Appointment` resource path.

### `src/types/domain.ts`

- Added optional `PatientUser.email` to the shared domain type.
- The type is optional for compatibility with patient records created before this field existed.

## Backend contract required by this frontend

The connected Frappe site must provide:

- `soulplace.auth.register_patient` with an `email` argument;
- `soulplace.auth.register_doctor`;
- a `PatientUser.email` field;
- the `Patient Appointment` DocType;
- appointment status values `Pending`, `Confirmed`, `Completed`, and `Cancelled`;
- the email notification hooks described in the backend `IMPLEMENTATION_NOTES.md`.

If the backend schema changes have been pulled but are not visible, run `bench migrate` on the backend site.

## Local frontend configuration

Create `.env.local` in this repository. It is intentionally ignored by Git.

```dotenv
VITE_FRAPPE_URL=
FRAPPE_PROXY_TARGET=http://your-site.localhost:8000
VITE_DEMO_MODE=false
VITE_FRAPPE_API_TOKEN=
VITE_CONSENT_VERSION=1.0
```

For the current local site, replace `your-site.localhost` with the actual Frappe site name. Do not commit `.env.local`, API tokens, passwords, cookies, or other secrets.

Install and run:

```bash
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:8081` and proxies `/api` requests to `FRAPPE_PROXY_TARGET`.

## End-to-end email test from the frontend

1. Confirm the backend, Redis processes, scheduler, and worker are running.
2. Register a new patient with a real email address that can receive mail.
3. Ensure the chosen Doctor record contains a real email address.
4. Sign in as the patient and submit a new appointment request.
5. Confirm that the doctor receives the request email.
6. Sign in as the assigned doctor and confirm the appointment.
7. Confirm that the patient receives the confirmation email.
8. Repeat with a new Pending appointment and cancel it to test cancellation email.

Existing patients created before the email-field migration need their `PatientUser.email` field populated in Frappe Desk before they can receive confirmation or cancellation messages.

## Validation status

The full Vitest suite, strict TypeScript check, and production build should all pass before this branch is pushed or merged:

```bash
npm test -- --run
npm run typecheck
npm run build
```

## Collaboration and merge notes

- Frontend pull requests should target `Main`.
- Keep frontend and backend changes in separate repository branches and pull requests.
- Merge the backend pull request first because the frontend depends on the new patient email field and RPC behavior.
- Do not commit `.env.local` or any SMTP credential.
- After resolving conflicts, repeat the registration and appointment-email workflow against the merged backend.
