# Google Meet production acceptance

Last updated: 2026-08-14

## What SoulPlace guarantees

- Only the doctor assigned to a confirmed teleconsult appointment can save its
  Google Meet room, and the doctor must still be active and approved.
- One appointment has at most one immutable Meet room. Repeated identical saves
  are idempotent; attempts to replace a saved room are rejected.
- Meet URLs and space identifiers are validated independently in the browser
  and in Frappe. SoulPlace opens only canonical HTTPS `meet.google.com` links.
- New rooms use the Google account's access and moderation defaults. Consumer
  Google accounts default to restricted access; Google Workspace deployments
  must enforce the required access policy through their Workspace administrator.
  Patients outside the host's organization may need to ask to join and be
  admitted by the doctor.
- Rescheduling updates session times; completing or cancelling the appointment
  updates the teleconsult lifecycle and removes the join action.
- Google access tokens remain in browser memory for the creation request. They
  are not sent to Frappe, logged, or stored by SoulPlace.

## Option A: real Google Cloud acceptance

1. Use a development or staging Google Cloud project—not the production
   project—and enable the Google Meet REST API.
2. Configure the OAuth consent screen. While it is in Testing, add the doctor's
   Google account as a test user.
3. Create an OAuth 2.0 **Web application** client and add the exact frontend
   origin to **Authorized JavaScript origins**. Do not add paths, wildcards, or
   trailing slashes.
4. Set `VITE_GOOGLE_CLIENT_ID` to the Web client ID, keep
   `VITE_DEMO_MODE=false`, and restart/rebuild the frontend.
5. In SoulPlace, use an approved doctor with teleconsult enabled and a patient.
   Book a video appointment, then confirm it as the assigned doctor.
6. Click **Create Google Meet**, choose the intended host Google account, and
   grant only the meeting-space creation permission. Confirm one room appears
   and that repeated clicks or refreshes do not create a second stored room.
   Confirm the resulting room uses the access policy required by your clinic.
7. Open the room as the doctor. In a separate browser profile, sign in as the
   patient, open the same appointment, click **Join consultation**, request
   entry, and confirm the doctor can admit the patient.
8. Reschedule the appointment and verify the Teleconsult Session times change.
   Complete or cancel a separate test appointment and verify the join action is
   removed and the backend session status matches.
9. Block popups once and disable the network once. Confirm the UI gives a
   recoverable error and a retry remains available.

Before public launch, create a separate production Cloud project, configure its
homepage/privacy/terms and verified domains, add only the final HTTPS origins,
move the consent screen to Production, and complete any brand or sensitive
scope verification shown by Google Cloud. Keep `VITE_GOOGLE_CLIENT_ID` public;
it is an identifier, not a client secret. Never ship a Google client secret.

## Option B: no Google Cloud Console

This validates SoulPlace's UI and record flow, but cannot prove real OAuth or
Google Meet API access.

1. Set `VITE_DEMO_MODE=true`, leave `VITE_GOOGLE_CLIENT_ID` empty, and restart
   the frontend.
2. Sign in as `doctor@soulplace.demo` with `Demo1234!`.
3. Open a confirmed video appointment and click **Create Google Meet**.
4. Confirm the room card changes to ready and exposes the canonical demo Meet
   link. Sign in as patient `9000000001` with the same password and verify the
   same appointment exposes **Join consultation**.
5. Verify pending, completed, and cancelled appointments never expose a join
   action. Reloading resets demo mutations because they are browser-only.

Real production room creation is impossible without a Google Cloud project,
the Meet REST API, and an OAuth Web client.

## Release evidence

Record the frontend and backend commit IDs, production origin, Google Cloud
project ID, OAuth client ID suffix (not secrets), consent-screen status,
verification status, test timestamp, doctor/patient test identities, and the
result of the restricted-room admission test. Monitor Google API 401/403/429/5xx
failures without logging bearer tokens or full appointment data.
