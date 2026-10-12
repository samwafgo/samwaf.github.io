# Website Access Authentication

## Overview

Website access authentication lets you require a password to access a protected website. After a website password is enabled, visitors must access the site with the password. The authentication accounts (username + password) are managed on this page, while the authentication type and authentication path prefix are configured on the website edit page.

<!-- Image: Website access authentication account list -->

## Prerequisites

Authentication accounts work together with the website's "Web Password Visit" switch:

1. Open the website edit page and turn **Web Password Visit** on (after enabling, the website requires a password for access; please add a username and password).
2. Choose an **Authentication Type**:
   - **Authorization Mode (Browser Popup)**: standard HTTP Basic Auth, authenticated through the browser popup.
   - **Custom Mode (Custom Page)**: a custom login page, suitable for avoiding conflicts when the backend site also uses Authorization authentication.
3. Set the **Auth Path Prefix**: a custom HTTP authentication path prefix to hide system features. Leave it empty for an auto-generated random path. Format: start with `/_`, at least 10 characters, lowercase letters, numbers, and underscores only. Example: `/_waf_a7k3m9x2`.
4. Optionally set **Protection scope** and the **path list** (whole site by default - see "Protection scope and password-free IP group" below).
5. Optionally set **Session lifetime / Idle timeout / Bind to login IP** - see "Session lifetime settings" below.
6. Add access accounts (username + password) on this page.

## Steps

### Add an account

1. Click **New**.
2. Enter a **Username** and **Password**.
3. Click **Confirm** to save.

> Note: the password must not contain a colon `:`, otherwise a "Password Not Normal" message appears.

<!-- Image: Add authentication account dialog -->

### Search / Edit / Delete

- Enter a keyword in the **Username** box at the top and click **Search**.
- In the list action column, click **Edit** to modify an account or **Delete** to remove it.

## Protection scope and password-free IP group

The default (and the behavior before this feature existed) is **whole site**: once the switch is on, every path requires the password. Two path-based modes are available:

| Protection scope | Behavior | Typical use |
| --- | --- | --- |
| Whole site | Every path requires the password (default). | Locking down an internal system or staging site. |
| Only listed paths require password | Only requests hitting the path list require the password; everything else is open. | Protecting just `/admin` or `/api/manage` consoles and APIs. |
| Whole site except listed paths | Requests hitting the path list are open; everything else requires the password. | Opening only `/healthz` for a monitor probe while locking the rest. |

### Writing the path list

One entry per line, comma also accepted; case-insensitive; at most 50 entries, 256 characters each. Two forms:

- **Plain path** (no `*`): matches a whole **directory tree**. `/admin` protects `/admin` and everything below it, but does not touch `/adminconsole`.
- **Wildcard path** (contains `*`): a wildcard match where `*` also crosses directories. `*.php` matches every PHP page; `/api/*/private` matches `/api/v1/private`; `/manage*` matches `/manage`, `/managex` and `/manage/panel`.

```text
/admin
/api/manage
*.php
```

::: warning Empty list fallback
If the scope is "only listed paths" but the list is empty, protection falls back to **whole site** with a note in the system log - an incomplete configuration never silently disables the gate. An empty "whole site except listed paths" list also means whole site, which is its literal meaning.
:::

::: tip ACME certificate issuance
With whole-site protection the HTTP-01 validation path is protected too (the original behavior). Sites that need automatic issuance or renewal can use the "whole site except listed paths" mode and put `/.well-known/acme-challenge` in the list, or switch to DNS-01.
:::

### Password-free IP group

The **password-free IP group** opens a direct lane for callers that cannot log in: sources hitting the selected IP group **skip the password check entirely** (for every protection scope). It suits internal monitors, health checks and collectors - programmatic access.

- IP groups are maintained on the IP Groups page; one change applies to every site referencing the group.
- Deleting the group simply restores the password requirement - the gate never opens by accident.
- The client IP used for the check is resolved through the website's "Real client IP source", same as session lifetime.

## Session lifetime settings

Configured under "Website password access" on the website edit page; they control how long one sign-in lasts.

| Setting | Default | Description |
| --- | --- | --- |
| Session lifetime | 1440 minutes (24 hours) | Counted from the moment of sign-in: past this duration the password must be entered again, no matter how actively the site is being used. |
| Idle timeout | 0 (off) | Sign out automatically after this long without any request. 0 disables it, leaving only the session lifetime. **Custom mode only**. |
| Bind to login IP | On | When on, the credential stops working from a different IP, so a copied cookie is useless elsewhere. |

::: tip Why Authorization mode has no idle timeout
Under HTTP Basic the browser caches the password and replays it on every request, so the server cannot tell whether the user has actually left - "idle" is not an observable state in that mode. Switch to Custom mode if you need idle timeout.
:::

::: warning Bind to login IP and CDNs
The client IP used for authentication is resolved through the website's "Real client IP source" setting, the same one used by access logs. For a website behind a CDN or a front Nginx this binds to the visitor's real IP: switching mobile towers or reconnecting a home line will drop the login. Turn this off if it happens too often.
:::

Idle timeout can take effect up to one minute later than configured: to avoid a database write per request, the last-active time is refreshed at most once every 60 seconds.

## Online sessions

Once website password access is enabled, the website edit page lists the visitors currently signed in with the password.

| Column | Description |
| --- | --- |
| Username / Method | Who signed in, and whether through the browser popup or the custom page. |
| Login IP / Location | The visitor's real IP and its location (resolved through the website's "Real client IP source"). |
| Login time / Last active / Expires at / Remaining | The timeline of this sign-in. Less than 10 minutes remaining is highlighted in orange. |
| Status | Online, or revoked (hover to see the reason). |

Three ways to sign someone out: **Kick** (one session), **Kick user** (every session of that user on this site) and **Kick all** (every visitor of this site - use it when a password leak is suspected).

::: warning How fast a kick takes effect, and its limits
- Because sessions are cached for up to 60 seconds, a kick takes effect within 60 seconds at worst.
- **In Authorization mode (browser popup), a kick can only force the person to type the password once more.** HTTP Basic has no logout mechanism; the server can only change the authentication realm to make the browser prompt again, and the same username and password will sign in successfully after that. **To keep someone out for good, delete their account.**
- In Custom mode (custom page) a kick is a clean one-way revocation and the visitor must sign in again.
:::

Deleting or modifying an account (renaming or changing its password) revokes that account's sessions automatically - no manual kick needed.

Revoked session records are kept for 30 days for later investigation, then cleaned up automatically.

## Security audit

Sign-in success, wrong password, lockout, kick and session expiry are all recorded under **System settings - Security audit** in the "Website password" category, and can be filtered by category, event, account, source IP and website.

Denied requests from visitors who are not signed in are recorded as well, but throttled to one entry per IP + website per 5 minutes: a single directory scan means thousands of unauthenticated requests, and without throttling they would flood the audit table and bury the records that matter.

## Field Reference

### Authentication account (this page)

| Field | Description |
| --- | --- |
| Username | The login username used to access the website. |
| Password | The login password used to access the website; it must not contain a colon `:`. |

### Related settings on the website edit page

| Field | Description |
| --- | --- |
| Web Password Visit | After enabling, the website requires a password for access. Please add a username and password. |
| Authentication Type | Authorization mode: standard HTTP Basic Auth (browser popup); Custom mode: custom login page, suitable for avoiding conflicts when the backend also uses Authorization authentication. |
| Auth Path Prefix | Custom HTTP authentication path prefix to hide system features. Leave empty for an auto-generated random path. Format: start with `/_`, at least 10 characters, lowercase letters, numbers, and underscores only. Example: `/_waf_a7k3m9x2`. |
| Protection scope | Whole site (default) / only listed paths require password / whole site except listed paths. |
| Path list | Path patterns for path-based modes, one entry per line (comma also accepted). A plain path matches a whole directory tree; an entry containing `*` is a wildcard match where `*` crosses directories. |
| Password-free IP group | Sources hitting this IP group skip the password check entirely. Empty means disabled. |
| Session lifetime | How long one sign-in lasts at most, in minutes. Default 1440 (24 hours). |
| Idle timeout | Sign out after this long without any request, in minutes. 0 disables it. Custom mode only. |
| Bind to login IP | Whether the credential is bound to the IP used at sign-in. On by default. |

## FAQ

- **"Password Not Normal" message?** The password must not contain a colon `:`. Remove the colon and try again.
- **Account added but the website does not ask for a password?** Make sure **Web Password Visit** is enabled on the website edit page.
- **When should I use Custom mode?** When the backend website itself also uses Authorization authentication, use Custom mode (a custom login page) to avoid authentication conflicts.
- **I kicked someone but they still seem to have access?** Sessions are cached for up to 60 seconds, so wait a moment. In Authorization mode, note that a kick can only force the password prompt again - anyone who knows the username and password can sign back in. Delete the account to block them for good.
- **Visitors are asked to sign in again very often?** Usually "Bind to login IP" combined with a changing visitor address (switching mobile towers, a new PPPoE session). Turn "Bind to login IP" off on the website edit page.
- **Selected "only listed paths" but the whole site asks for the password?** An empty path list falls back to whole-site protection; fill in the path list on the website edit page.
- **Does `/admin` also protect `/adminconsole`?** No. A plain path matches a whole directory tree, so only `/admin` and its sub-paths are protected. Write `/admin*` explicitly to cover sibling paths too.
- **Does everyone have to sign in again after the upgrade?** Yes - the upgrade invalidates existing credentials once, after which your configured lifetime applies normally.

## Update History

| Date | Applies to | Changes |
| ---- | ---- | ---- |
| 2026-10-12 | > v1.3.25-beta.7 | Added "Protection scope and password-free IP group": web password visit can be enabled per path (whole site / only listed paths / except listed paths) with `*` wildcard support in the path list, plus an optional password-free IP group that lets selected sources skip the password. Session lifetime (TTL / idle timeout / bind to login IP) is unreleased in the same batch. |

> About "Applies to": `vX.Y.Z` means the feature is available from that release; `> vX.Y.Z` means it is already in the code but not released yet and ships with the next version.
