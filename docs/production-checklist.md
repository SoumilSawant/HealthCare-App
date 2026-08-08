# SoulPlace production checklist

## Release blockers

- [ ] Deploy the matching Soulplace backend changes and run `bench migrate`.
- [ ] Run backend portal-security tests on a staging copy of the production schema.
- [ ] Use HTTPS and a same-origin `/api` reverse proxy; do not ship browser API tokens.
- [ ] Set `VITE_DEMO_MODE=false` and verify the built bundle contains no demo flag.
- [ ] Configure Frappe allowed origins, secure/HTTP-only session cookies, CSRF, and trusted proxy headers.
- [ ] Enable the Frappe password policy and configure malware scanning/quarantine for private doctor-verification uploads.
- [ ] Configure SMS Settings and exercise OTP login and patient password reset on a real handset.
- [ ] Add the final HTTPS origin to the Google OAuth Web client, publish the consent screen, and complete verification if Google requests it.
- [ ] Publish approved privacy, terms, telemedicine-consent, retention, deletion, and emergency-support policies.
- [ ] Run patient-versus-patient, doctor-versus-doctor, and cross-portal denial tests in staging.
- [ ] Configure encrypted database/private-file backups and perform a restore drill.
- [ ] Configure error reporting, release IDs, uptime checks for the frontend and `soulplace.api.health`, alert recipients, and log retention.
- [ ] Name the deployment owner, rollback owner, clinical incident contact, and security incident contact.

## Build and deploy

- [ ] Run `npm ci`, `npm audit`, `npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run build`, and `npm run test:e2e`.
- [ ] Confirm `dist/` contains `_headers` and `_redirects`, or reproduce those rules in the chosen CDN/nginx configuration.
- [ ] Verify SPA deep links return `index.html` and `/api/*` is never rewritten to the SPA.
- [ ] On Netlify-style hosts, replace the shipped `/api/*` 503 guard with a backend proxy rule before enabling live mode; cross-origin deployments may keep the guard and set `VITE_FRAPPE_URL` explicitly.
- [ ] Verify CSP, HSTS, frame, referrer, permissions, MIME-sniffing, and cache headers with the deployed hostname.
- [ ] Keep `index.html` uncached; cache fingerprinted `/assets/*` as immutable.
- [ ] Verify the Google OAuth popup, Meet creation, doctor join, and patient join under the production CSP.
- [ ] Leave payments disabled unless a reviewed server-owned gateway flow is live; SoulPlace must never collect raw card data.
- [ ] Confirm `legacy/` and `docs/legacy-mobile/` are excluded from deployment artifacts.

## Clinical acceptance

- [ ] Register one patient and one doctor from clean browser profiles.
- [ ] Approve and reject test doctors; verify rejection reason visibility and pending access restrictions.
- [ ] Book, overlap-check, confirm, reschedule, cancel, and complete appointments; inspect the audit timeline.
- [ ] Save consultation notes and prescriptions; verify only the assigned doctor can read raw clinical notes, while the patient receives only the authored patient-friendly summary and their prescriptions.
- [ ] Grant and revoke each consent type and verify server timestamps/IP capture.
- [ ] Test keyboard-only navigation, modal focus containment, mobile layout, 200% zoom, and screen-reader labels.
- [ ] Validate emergency-support copy and local emergency numbers with the clinical/legal owner.

## Go-live and rollback

- [ ] Record the frontend artifact/version, backend commit, migration timestamp, and database backup ID.
- [ ] Deploy to staging, run smoke tests, then use a gradual or blue-green production rollout where available.
- [ ] Monitor authentication, 403/417/5xx rates, OTP delivery, Meet creation, and appointment mutation failures.
- [ ] Keep the previous frontend artifact and backend release available until the observation window closes.
- [ ] Follow `docs/production-runbook.md` for rollback; never reverse a schema migration without a tested database restore plan.
