# Auth Settings

## 1 Overview

**Access Authentication** puts a single sign-in gate in front of every site proxied by the WAF: once enabled, visiting any site first requires signing in at the **auth center**; after that, every other site is reachable without signing in again.

The motivation: many self-hosted open-source services have no security hardening of their own, and exposing them directly to the internet is risky. With this gate in place, only the accounts you allow ever reach the backend.

This page configures **how it behaves once turned on**. Three things are needed to make it work:

1. Create accounts under [Access Accounts](./AccessAccount.md)
2. Pick an **auth center origin** on this page
3. Turn on the **master switch** at the top of this page

::: warning
Do not reorder these steps. The moment the master switch goes on, every protected site requires signing in — with no accounts created, nobody gets in.
:::

<!-- Image: Auth settings page -->

## 2 Master switch

The **Access authentication master switch** sits at the top of the page and can be flipped right here. **It takes effect immediately — no save needed.**

Notice on the page: **While off, nothing below takes effect. Create your [Access Accounts] and pick an auth center origin first, then turn it on. Takes effect immediately — no save needed.**

- **Turning it on** asks for confirmation: *Once on, every protected site will require signing in first. Make sure you have created at least one account under [Access Accounts], or nobody gets in.* If no auth center origin has been set, the dialog adds a red warning — without an auth center there is no place to sign in, so the feature will not actually take effect (the engine lets requests through and logs a warning).
- **Turning it off** needs no confirmation and applies immediately.

The **Create accounts** button next to the switch jumps straight to the accounts page.

::: tip
This switch maps to `access_enable` under the `access` category in system config, off by default. Changing it in [System Config](./SystemConfig.md) has the same effect.
:::

## 3 Basics

### 3.1 Auth center origin (required)

One domain is dedicated to signing in: every protected site redirects there first, and one sign-in gets you into all of them.

The dropdown lists sites that are **already configured and started** (excluding the global site and wildcards). Pick one — the scheme and port are already assembled for you. If the address you want is not listed, you may type it in directly.

::: warning
The auth center must be a domain the **WAF actually proxies**. If requests never reach the engine, redirecting there just yields a 403 loop. This is validated on save.
:::

Either approach works:

- **Reuse one of your business domains** — no extra domain needed; that site both serves its own traffic and acts as the auth center.
- **Add a dedicated site** — add something like `sso.example.com` under [Sites](./Host.md) purely for signing in.

If no eligible site exists yet, a notice below the dropdown points you to [Sites](./Host.md) to add a started site first.

::: warning
The site hosting the auth center **cannot be deleted, and its domain cannot be changed** — that would strip every site of its sign-in entry point at once. Both actions are blocked, telling you to switch to another domain on this page first.
:::

### 3.2 Sign-in lifetime

How long one sign-in lasts before the user must authenticate again. Default **720 minutes (12 hours)**.

### 3.3 Global two-step verification

When on, accounts **with an authenticator bound** must also enter a 6-digit code. Accounts without one are unaffected (so nobody gets locked out at the sign-in page).

Sites and accounts can override this. Precedence: **account > site > global**.

### 3.4 Failed sign-in lockout

Lock for M minutes after N consecutive failures. Counted separately **per source IP** and **per account name**; hitting either limit locks. Both dimensions are tracked so that credential stuffing and distributed brute force against one account are both covered.

### 3.5 Global bypass paths

Applies to every site, **prefix match**, one per line. For health checks, webhook callbacks and other callers that cannot sign in.

::: tip
The ACME path `/.well-known/acme-challenge/` is always allowed and does not need to be listed — otherwise certificate renewal would fail.
:::

### 3.6 Global bypass IP group

Sources matching this [IP Group](./IPGroup.md) are let through on every site. A site can name its own group, which takes precedence.

## 4 Advanced

The defaults suit almost every deployment, and getting these wrong can lock you out.

### 4.1 Paths and cookies

| Field | Description |
| --- | --- |
| Auth path prefix | Where the sign-in page and auth endpoints are mounted, default `/samwaf_access`. Change it to something less guessable to hide the fingerprint. **This prefix is never forwarded to the backend even when the feature is off** — change it if your backend genuinely uses that path |
| Cookie prefix | Name prefix for session cookies, default `samwaf_ac`. These cookies are stripped before the request is forwarded, so the backend never sees them |
| Cookie Secure flag | **Auto**: Secure is set only for HTTPS requests or sites with forced HTTPS redirect; **Always on**: use when your whole deployment is HTTPS |
| Redirect signing key | Signs cross-domain redirect requests so the return address cannot be tampered with. Generated automatically on first save and never displayed — only "Configured / Not set" is shown |

::: warning
On a plain HTTP site, forcing Cookie Secure means the browser will not store the cookie and **sign-in will never complete**.
:::

Click **Rotate key** to replace the signing key. Rotating invalidates any sign-in redirect currently in flight (users simply get redirected once more); **existing sessions are unaffected**.

### 4.2 Lifetime tuning

| Field | Description |
| --- | --- |
| Per-site token lifetime | How long the signed-in state lasts on each business domain. It never outlives the remaining time on the central session |
| Redirect ticket lifetime | One-time ticket for the cross-domain hop. Just long enough for one redirect round trip; max 300 seconds |
| Idle timeout | Sign out automatically after this much inactivity. `0` disables it |
| Auth result cache | How long an auth result is cached. This is also the worst-case delay before [Kick](./AccessSession.md) takes effect. Capped at 60 seconds; raising it is not recommended |

### 4.3 Session binding

| Field | Description |
| --- | --- |
| Bind to sign-in IP | Sessions die the moment the IP changes. More secure, but mobile network switches and multi-egress links cause frequent sign-outs |
| Bind to device fingerprint | Binds to browser UA and language. Switching or upgrading browsers requires signing in again |

### 4.4 Bypass rules

For webhooks, monitoring and other **machine callers** that cannot sign in:

1. **Service token header** — the header name, for example `X-Service-Token`.
2. **Service tokens** — one plaintext token per line. Only the SHA256 is stored and it is never displayed.

Leaving the field empty **keeps existing tokens**; entering a single dash `-` **clears them all**.

### 4.5 Unauthenticated behavior

| Field | Description |
| --- | --- |
| Unauthenticated response | **Auto** (recommended): browser navigation redirects to the sign-in page, API/WebSocket get 401 JSON; **Always redirect**: force 302; **Always 401**: everything gets JSON, suitable for API-only sites |
| Pass identity to backend | Adds an `X-SamWaf-Access-User` header when forwarding, so the backend can identify the visitor. Any client-supplied header of the same name is deleted first, so it cannot be spoofed |

::: tip
WebSocket always gets 401 regardless of this setting, because it does not follow redirects.
:::

## 5 Per-site exceptions

Each site can override the behavior on the **Access Auth** tab of [Sites](./Host.md#_16-access-authentication-per-site): **Inherit global / Force on / Force off**, plus its own bypass paths, bypass IP group, two-step verification and unauthenticated response.

## 6 Notifications

Access Authentication events can be pushed to your [Notification Channels](./NotifyChannel.md). Two independent message types are available under [Notification Subscription](./NotifySubscription.md):

| Message type | Events |
| --- | --- |
| Access Sign-in | Sign-in OK |
| Access Alert | Locked out, ticket replay, bad return address |

The message body includes the event, account, source IP, **location**, site and time.

::: tip
Splitting them is deliberate: people who only want security alerts are not disturbed by every ordinary sign-in.
High-frequency events (denied requests, a single wrong password) **do not** trigger notifications, and the same "event + IP" only sends once per 5 minutes — so a scan cannot flood your inbox.
:::

## 7 If you lock yourself out

::: warning
A misconfiguration can lock down every site. Know the recovery paths before enabling.
:::

| Situation | Recovery |
| --- | --- |
| The admin panel is not proxied through the WAF (default) | The admin port `26666` **does not go through the WAF engine**, so this feature cannot lock it. Just open the admin panel and turn the master switch off |
| The admin panel is proxied through the WAF and misconfigured | Edit `conf/config.yml`, set `security.access_force_disable` to `true` and restart |
| Container deployments | Set the environment variable `SAMWAF_ACCESS_DISABLE=1` and restart |

## 8 Field reference

| Field | Description |
| --- | --- |
| Access authentication master switch | Master switch, maps to `access_enable`, off by default; applies immediately |
| Auth center origin | The domain dedicated to signing in, **required**; must be a configured, started site |
| Sign-in lifetime | How long one sign-in lasts, default 720 minutes |
| Global two-step verification | Whether accounts with an authenticator bound must enter a code |
| Failed sign-in lockout | Lock for M minutes after N failures, counted per IP and per account name |
| Global bypass paths | Path prefixes exempt on every site, one per line |
| Global bypass IP group | IP group let through on every site |
| Auth path prefix | Mount path of the sign-in page and auth endpoints, default `/samwaf_access` |
| Cookie prefix | Session cookie name prefix, default `samwaf_ac` |
| Cookie Secure flag | Auto / Always on |
| Redirect signing key | Tamper-proof signing key for cross-domain redirects, auto-generated, never displayed, rotatable |
| Per-site token lifetime | Lifetime of the signed-in state on each business domain |
| Redirect ticket lifetime | Lifetime of the one-time cross-domain ticket, max 300 seconds |
| Idle timeout | Auto sign-out after inactivity, 0 disables |
| Auth result cache | Auth result cache duration, capped at 60 seconds |
| Bind to sign-in IP | Whether a session dies when the IP changes |
| Bind to device fingerprint | Whether a session dies when the browser changes |
| Service token header | Header name used by machine callers |
| Service tokens | Plaintext tokens (one per line), stored as SHA256; empty keeps, `-` clears |
| Unauthenticated response | Auto / Always redirect / Always 401 |
| Pass identity to backend | Whether to add `X-SamWaf-Access-User` when forwarding |

## 9 FAQ

- **The master switch is on but sites still do not ask for sign-in.** Most likely no auth center origin is set. Without an auth center there is no sign-in entry point, so the engine chooses to **let requests through** and log a warning (blocking would 403 every site at once with nowhere to sign in). Pick an auth center origin on this page and save.

- **Redirected to the auth center but always get 403.** The auth center domain is not a site the WAF proxies, so requests never reach the engine. Confirm under [Sites](./Host.md) that the domain is configured and started.

- **Sign-in succeeds but immediately asks again.** Check whether a plain HTTP site has **Cookie Secure flag** set to Always on — browsers will not store a Secure cookie over HTTP, so the signed-in state never sticks. Switch back to Auto.

- **Certificate renewal started failing.** Make sure `/.well-known/acme-challenge/` is reachable. That path is always allowed and needs no bypass entry; if you set the **auth path prefix** to something overlapping it, the save is rejected.

- **How is this different from a site's [Site Password](./HttpAuthBase.md)?** Site Password is **per site** — accounts belong to the site and you sign in again on the next site. Access Authentication is **global** — sign in once, reach every site. Both can coexist; Access Authentication runs first.

- **Are access accounts the same as admin accounts?** Entirely separate. Admin accounts live under [Account Management](./Account.md); access accounts under [Access Accounts](./AccessAccount.md).
