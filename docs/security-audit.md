# Security Audit — Managed Database Restoration

## Scope

This audit examined the tracked application configuration and the generated browser bundle after the Sanity and Supabase migration. It focused on preventing credentials, privileged provider variables, and retired service configuration from reaching source control or client-side JavaScript.

## Findings

| Check                                | Result | Evidence                                                                                                                               |
| ------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Tracked private-variable assignments | Passed | No tracked assignments for Sanity tokens, Supabase service roles, Stripe secret keys, Kit API secrets, or Google OAuth client secrets. |
| Tracked credential-shaped values     | Passed | No tracked Stripe-like, webhook-secret, or Google-API-key token patterns outside ignored and documentation paths.                      |
| Generated client bundle              | Passed | No private server variable names or credential-shaped values found under `.next/static`.                                               |
| Retired external service imports     | Passed | No runtime Sanity or Supabase package imports remain in `src`.                                                                         |

## Operational Requirements

Production credentials must be supplied only through managed environment settings. The credentials previously shared in chat must be treated as exposed and rotated before any production connection. Google OAuth remains deferred until after the release-ready version is published and will require new credentials provided through managed settings.

## Limitations

The audit cannot validate third-party account configuration or secret rotation status. Those actions require the account owner to replace the prior values in the respective provider consoles before they are entered into managed environment settings.
