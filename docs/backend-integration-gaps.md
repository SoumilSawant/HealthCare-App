# SoulPlace backend integration status

Audited source: `/Users/adios/Projects/Soulplace`, installed on the local
`healthcare.test` Frappe site.

## Implemented production safeguards

- Least-privilege DocPerm entries for every clinical DocType.
- Administrator-only field permissions for verification proofs, portal-user
  links, review metadata, consent IPs, actor identities, and raw clinical notes;
  patient/doctor RPCs return explicit role-safe response shapes.
- Record query and document permission hooks scope patients, doctors,
  consultations, prescriptions, consents, teleconsults, schedules, and audit
  events to the authenticated record owner.
- Atomic appointment booking captures required consent, serializes concurrent
  bookings per doctor, and rejects overlaps using the real Appointment schema.
- Controlled appointment confirm, cancel, complete, and reschedule transitions.
- Doctor-owned consultation, prescription, schedule, exception, profile, and
  Google Meet mutations.
- Patient-owned profile and consent mutations.
- Doctor application registration with User/role creation, unique medical
  registration, professional declaration, and a private 5 MB verification file.
- Administrator review records decision, reason, reviewer, and timestamp.
- Five-minute, rate-limited patient OTP login/password reset with hashed codes,
  attempt limits, enumeration-safe responses, and Frappe SMS delivery.
- Server-side dashboard aggregation instead of loading thousands of records.
- Appointment audit events now use actual fields and valid event types.
- Google Meet sessions require HTTPS links on `meet.google.com`; mock `.local`
  links were removed.

The schema was applied successfully with:

```bash
bench --site healthcare.test migrate
```

The security suite lives in `soulplace/tests/test_portal_security.py` and runs
with:

```bash
bench --site healthcare.test run-tests --app soulplace \
  --module soulplace.tests.test_portal_security
```

## Environment-owned release gates

These cannot be completed safely in source code without the production vendor
accounts, hostname, and approved policies:

- Configure and test Frappe SMS Settings with the production SMS gateway.
- Finish Google OAuth production publishing/verification and register the final
  HTTPS JavaScript origin.
- Publish counsel-approved privacy policy, terms, telemedicine consent, and
  retention/deletion policy.
- Select and configure a payment gateway before enabling payments; payment
  navigation remains hidden by default.
- Configure backups, alert delivery, uptime checks, error collection, log
  retention, and an on-call owner.
- Resource and Saved Resource are editorial/product features, not clinical
  release blockers; their current frontend content remains static.
