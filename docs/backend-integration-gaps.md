# SoulPlace backend integration audit

Audit source: the live SoulPlace app at
`/Users/adios/Projects/Soulplace`, installed on `healthcare.test`.

The patient registration controller and PatientUser gender options were
corrected on 2026-07-29 and migrated to the live site.

## Confirmed schema

The frontend types use the exact DocType and custom-field definitions under
`soulplace/soulplace/doctype/*/*.json` and
`soulplace/fixtures/custom_field.json`.

Confirmed appointment custom fields:

- `booking_source`
- `is_teleconsult`
- `teleconsult_session_id`
- `cancel_reason`
- `rescheduled_from`

## Blocking permission issues

1. `Appointment` grants CRUD only to `System Manager`. Patients cannot create or
   cancel their appointments, and doctors cannot confirm assigned requests.
2. `Prescription` grants CRUD only to `System Manager`. Doctors cannot create
   prescriptions and patients cannot read their own.
3. `Doctor Schedule Exception` grants CRUD only to `System Manager`. Doctors
   cannot manage their own exceptions.
4. `Consultation`, `Doctor`, `PatientUser`, `Patient Consent Record`, and
   `Teleconsult Session` give broad CRUD to both app roles.
5. No `permission_query_conditions` or `has_permission` hooks scope records to
   the current patient or doctor. Frontend filtering is not a security boundary.

Required backend correction: least-privilege DocPerm entries plus record-level
query and document permission hooks for every clinical DocType.

## Controller/DocType mismatches

### `soulplace/events.py`

The Appointment validation/update hooks reference:

- `appointment_with`
- `party`
- `scheduled_time`
- statuses `Open`, `Unverified`, `Scheduled`, and `Closed`

None match the Appointment DocType. The actual fields are `doctor`,
`appointment_date`, `appointment_time`, and statuses Pending, Confirmed,
Completed, Cancelled.

The audit hook writes `event_type = "Status Update"`, but that is not an option
in Appointment Audit Timeline.

The Custom teleconsult provider generates a `.local` meeting URL. This is not a
production provider integration.

### `soulplace/auth.py`

`get_user_details` reads nonexistent fields:

- `first_name` instead of `name1`
- `living_status` instead of `livingstatus`
- `therapy_status` instead of `therapyexp`

`register_patient` now creates the User and PatientUser profile atomically,
assigns `Patient App User`, links `PatientUser.app_user`, persists language and
emergency-contact fields, sets `consent_status`, and creates Web-captured
Privacy and Treatment consent records before logging the patient in. Mobile
verification remains false until a genuine OTP verification endpoint exists.

## Missing endpoints or schema

The following are genuinely missing and cannot be safely implemented solely in
the browser:

- doctor registration with User creation, role assignment, and private
  verification upload linkage;
- doctor approval-status RPC scoped to the logged-in doctor;
- doctor rejection reason field or immutable review record;
- medical-registration information field;
- professional terms/consent field or record;
- OTP request and verification;
- password-reset delivery flow appropriate for phone-derived local emails;
- structured doctor working days/hours;
- authoritative available-slot RPC that combines regular schedule, duration,
  appointments, and schedule exceptions;
- atomic appointment booking with overlap protection and consent validation;
- safe cancel/reschedule/confirm/complete RPCs with ownership checks;
- safe consultation and prescription RPCs with doctor ownership checks;
- administrative KPI/search endpoints for scalable server-side aggregation;
- Resource and Saved Resource DocTypes/endpoints;
- payment method/payment gateway schema and endpoints.

## Recommended server APIs

Names are intentionally not assumed by the frontend. Implement and document
server-owned RPCs for:

- register doctor;
- get current portal identity and roles;
- get effective doctor slots;
- book/cancel/reschedule/confirm/complete appointment atomically;
- create/update consultation and prescriptions;
- approve/reject doctor with reviewer and reason;
- submit/revoke consent with server-captured IP and timestamp.

Until these permission and controller issues are fixed, the current backend
must not be used for production clinical data. The frontend displays explicit
integration notices and normalized 401/403/validation/network errors rather
than falling back to mock data.
