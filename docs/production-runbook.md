# SoulPlace production runbook

## Health and monitoring

- Frontend: request `/` and one representative SPA deep link; both must return the current release and security headers.
- Backend: request `/api/method/soulplace.api.health`; expect `{"message":{"status":"ok"}}`.
- Track login/OTP failure rate, HTTP 403/417/429/5xx rate, booking conflicts,
  Google Meet creation failures, queue depth, database health, and SMS delivery.
- Set `VITE_APP_RELEASE` to the deployed commit or artifact ID. Configure
  `VITE_ERROR_REPORTING_URL` only for a reviewed endpoint and add its origin to
  CSP `connect-src` if it is not same-origin.

## Release sequence

1. Take and verify an encrypted database/private-file backup.
2. Deploy backend code, enter maintenance mode if the migration requires it,
   run `bench migrate`, clear cache, and execute backend security smoke tests.
3. Deploy the immutable frontend artifact and purge only `index.html` or HTML CDN cache.
4. Exercise patient login/OTP, doctor login/Meet creation, admin review, booking,
   clinical-note read/write, and cross-role denial checks.
5. Observe dashboards and alerts before completing the rollout.

## Rollback

1. Stop or drain write traffic if a data-integrity or authorization issue is suspected.
2. Roll the frontend back to the recorded previous immutable artifact.
3. Roll backend code back only when it remains compatible with the migrated schema.
4. If schema/data rollback is necessary, keep maintenance mode enabled and restore
   the verified database/private-file backup; do not improvise a reverse migration.
5. Re-run health, authorization, appointment, and audit checks before reopening traffic.
6. Record the incident timeline, affected release IDs, decision owner, and follow-up actions.
