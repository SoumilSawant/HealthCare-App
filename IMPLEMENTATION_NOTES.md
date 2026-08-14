# SoulPlace validation and appointment-email integration

Last updated: 2026-08-09

The frontend `Main` branch includes `bir/appointment-email-notifications` and uses the matching Soulplace backend `develop` branch. The canonical scheduling record is `Appointment`; `Patient Appointment` is not used by the web app.

## Live backend contracts

- Patient registration: `soulplace.auth.register_patient` (contact email is required).
- Doctor registration: `soulplace.api.register_doctor` (multipart verification proof is required).
- Discoverable doctors: `soulplace.api.list_portal_doctors` and `soulplace.api.get_portal_doctor`.
- Booking and lifecycle: scoped RPCs in `soulplace.api`; generic resource writes are not used in live mode.
- Google Meet persistence: `soulplace.api.save_google_meet_session` for confirmed teleconsult appointments.

## Validation model

`src/validation.ts` normalizes and validates registration, profiles, appointment lifecycle, schedules, clinical notes, prescriptions, and Meet links before any live or demo mutation. The backend independently repeats all security-relevant checks, owns the record relationships, rejects unknown transitions, and uses explicit public-field allowlists.

Client validation is user feedback only; it is never an authorization boundary.

## Appointment email lifecycle

1. A patient creates a Pending `Appointment`; Frappe queues a request email to `Doctor.email`.
2. The assigned doctor confirms or cancels it; Frappe queues the corresponding email to `PatientUser.email`.
3. Internal `@soulplace.local` login IDs are never used as recipients.
4. Clinical notes, symptoms, and cancellation reasons are excluded from email bodies.

Configure a Default Outgoing Email Account and an active Frappe worker/scheduler on each deployed site. Existing patients need a real `PatientUser.email` value.

## Local verification

```bash
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

From the Frappe bench:

```bash
bench --site healthcare.test migrate
bench --site healthcare.test set-config allow_tests true
bench --site healthcare.test run-tests --module soulplace.tests.test_portal_security
bench --site healthcare.test run-tests --module soulplace.tests.test_email_notifications
```

Keep `VITE_DEMO_MODE=false` for live testing and production builds. Never commit OAuth client secrets, SMTP passwords, API tokens, cookies, or site configuration.
