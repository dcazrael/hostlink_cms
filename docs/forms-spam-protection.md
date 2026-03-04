# Forms Spam Protection

This project uses layered anti-spam protection for public form submissions (`POST /api/form-submissions`).

## Layers

1. Honeypot field
- Hidden field is injected client-side and submitted as `spam_hp`.
- If this field is not empty, the request is marked suspicious.

2. Minimum fill time
- Form render timestamp is submitted as `spam_startedAt`.
- If submit happens faster than `SPAM_MIN_SUBMIT_MS`, the request is marked suspicious.

3. Rate limiting (Postgres-backed)
- Counters are stored in `form-rate-limits`.
- Limits are checked by IP hash + form.
- Defaults:
  - `SPAM_RATE_MINUTE_LIMIT=5`
  - `SPAM_RATE_HOUR_LIMIT=20`
  - `SPAM_BLOCK_MINUTES=30`

4. Turnstile on suspicion
- Suspicious submissions require a valid Turnstile token (`spam_turnstileToken`).
- Token is verified server-side against Cloudflare.

## Error Contract

- `CAPTCHA_REQUIRED` (`400`): suspicious request with no token.
- `CAPTCHA_INVALID` (`400`): token verification failed.
- `RATE_LIMITED` (`429`): request exceeded configured limits.

## Required Environment Variables

- `TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `SPAM_IP_HASH_SALT`
- `SPAM_MIN_SUBMIT_MS`
- `SPAM_RATE_MINUTE_LIMIT`
- `SPAM_RATE_HOUR_LIMIT`
- `SPAM_BLOCK_MINUTES`

## Operational Notes

- `submissionData` metadata fields (`spam_hp`, `spam_startedAt`, `spam_turnstileToken`) are removed before persistence.
- If Turnstile keys are missing, suspicious requests are rejected.
- IPs are hashed before storage; raw IP is not persisted.
