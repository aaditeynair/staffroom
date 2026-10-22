# Security Policy

## Supported versions

This project is unmaintained and no longer receives security updates. There
are no supported versions.

## Reporting a vulnerability

If you find a security issue, please report it privately rather than opening a
public issue. Use GitHub's **Security Advisories** feature on this repository
("Security" tab -> "Report a vulnerability"), or open a private issue if
advisories are unavailable.

Please include:

- A description of the issue and its impact
- Steps to reproduce, ideally with a minimal example
- Any suggested mitigation

You can expect an acknowledgement, though please note that this project is
archived and fixes may not be possible.

## Deploying this app

Staffroom handles authentication, teacher personal data, and leave reasons. If
you deploy your own instance:

- **Set Row Level Security policies on every table.** The admin UI performs
  writes through the browser's Supabase client (the anon key), so RLS is the
  only thing enforcing who can read or modify teacher records. Without RLS
  policies, anyone with the anon key can read or write every row.
- **Never commit a service role key.** `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS
  entirely. It is only read by the webhook routes in `app/api/webhooks/`.
- **Use a long random `SUPABASE_WEBHOOK_SECRET`.** The webhook routes compare
  it with a plain string equality check, so it needs to be unguessable.
- **Audit the webhook routes before enabling them.** They use the service role
  client to look up teachers and send push notifications.
