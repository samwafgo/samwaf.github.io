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
4. Optionally set **Session lifetime / Idle timeout / Bind to login IP** - see "Session lifetime settings" below.
5. Add access accounts (username + password) on this page.

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
| Session lifetime | How long one sign-in lasts at most, in minutes. Default 1440 (24 hours). |
| Idle timeout | Sign out after this long without any request, in minutes. 0 disables it. Custom mode only. |
| Bind to login IP | Whether the credential is bound to the IP used at sign-in. On by default. |

## FAQ

- **"Password Not Normal" message?** The password must not contain a colon `:`. Remove the colon and try again.
- **Account added but the website does not ask for a password?** Make sure **Web Password Visit** is enabled on the website edit page.
- **When should I use Custom mode?** When the backend website itself also uses Authorization authentication, use Custom mode (a custom login page) to avoid authentication conflicts.
- **I kicked someone but they still seem to have access?** Sessions are cached for up to 60 seconds, so wait a moment. In Authorization mode, note that a kick can only force the password prompt again - anyone who knows the username and password can sign back in. Delete the account to block them for good.
- **Visitors are asked to sign in again very often?** Usually "Bind to login IP" combined with a changing visitor address (switching mobile towers, a new PPPoE session). Turn "Bind to login IP" off on the website edit page.
- **Does everyone have to sign in again after the upgrade?** Yes - the upgrade invalidates existing credentials once, after which your configured lifetime applies normally.
