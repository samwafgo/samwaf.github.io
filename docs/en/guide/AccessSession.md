# Active Sessions

## 1 Overview

Lists the visitors currently signed in through [Access Authentication](./AccessConfig.md), and lets you force a single session — or all of them — offline.

Notice at the top of the page: **The visitors currently online. Kicking a session revokes it on every site at once, normally with immediate effect. Only active sessions are listed by default — clear the status filter to see historical ones.**

<!-- Image: Active sessions list page -->

## 2 Sessions and per-site tokens

One sign-in creates one **central session**; each time the visitor enters a business site, a sub-token is issued on that site. The **Sites entered** column lists the domains those sub-tokens belong to.

As a result:

- **Kicking one session signs that visitor out of every site at once** (sub-tokens are revoked along with the central session)
- Deleting a single site only revokes the token on that site; the visitor's sessions elsewhere are unaffected

## 3 Steps

### 3.1 Review who is online

The page shows only **Active** sessions by default. The **Sites entered** column lists the actual domains, collapsing to "`a.com` and N sites" beyond two — hover to see the full list. **Location** is resolved from the sign-in IP and frozen at sign-in time.

To review historical sessions, **clear** the **Status** filter in the top-right (or choose "Revoked") and click **Search**. Revoked sessions are kept for a while for traceability and later removed by a cleanup task.

### 3.2 Kick

Click **Kick** in the **Operation** column of a row and confirm. Only active sessions offer this action; revoked rows show `-`.

::: tip
The admin panel and the WAF engine run in the same process and share a cache, so kicking **normally takes effect immediately** — the kicked browser lands back on the sign-in page on its very next request.
Only in one situation — new and old processes coexisting during a graceful upgrade while using the in-memory cache — can there be a delay of up to the [auth result cache](./AccessConfig.md#_4-2-lifetime-tuning) duration (60 seconds max).
:::

### 3.3 Kick all

**Kick all** in the top-left forces every visitor to sign in again. It is an emergency measure for suspected credential leaks or misconfiguration, and asks for confirmation.

### 3.4 Filtering

The top-right supports fuzzy filtering by **Account** and **Sign-in IP**, plus filtering by **Status** (Active / Revoked).

## 4 Field reference

| Field | Description |
| --- | --- |
| Account | The access account this session belongs to |
| Scope | **All sites**: one sign-in reaches every site; **Single domain**: serves only the bound domain |
| Bound domain | The domain bound when the scope is single-domain |
| Sign-in IP | Source IP at sign-in |
| Location | Country and region resolved from the sign-in IP, frozen at sign-in time |
| Sites entered | Domains this session has entered and where the token is still valid |
| Signed in | Session creation time |
| Last active | Time of the most recent request |
| Expires | When the session naturally expires |
| Status | Active / Revoked; hover a revoked row to see the reason |
| User agent | The User-Agent recorded at sign-in |

## 5 FAQ

- **Why can I not see revoked sessions?** The page defaults to Active only. Clear the **Status** filter in the top-right and search again.

- **I kicked a session but the visitor is still in.** Normally it dies within one request. If access persists past a minute, check whether you kicked a different session of the same account — one account can hold several sessions. Use **Kick** on the [Access Accounts](./AccessAccount.md) page to drop all of them at once.

- **Do visitors get signed out when SamWaf restarts?** No. Sessions live in the database, so the signed-in state survives a restart.

- **How do I sign one account out everywhere right now?** On the [Access Accounts](./AccessAccount.md) page use **Kick** for that account — or disable it, or reset its password. All three revoke every session it holds.

- **Location is empty.** The source IP has no match in the IP database (for example a private address such as `127.0.0.1`). The database is managed on the [IP Location](./IPLocation.md) page.
