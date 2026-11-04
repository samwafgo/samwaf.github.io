# Security Audit

## 1 Overview

SamWaf's **unified security audit stream**: all kinds of security events collected into one table — who did what, when, from which IP, against which site, and whether it succeeded. All security logs will eventually land here.

It currently covers these **categories** (filterable at the top of the page):

- **Access authentication**: `access`, sign-in, kick, ticket and unauthenticated-block events from [Access Authentication](./AccessConfig.md).
- **Website password**: `httpauth`, per-site password sign-in, lockout, kick, session expiration and unauthenticated-block events.
- **Config change**: `config`, sensitive configuration operations, e.g. SSL certificate export to disk (see [SSL Certificate Management](./SSL.md)).
- **App management**: `app`, adding, editing, deleting, starting, stopping and restarting apps, plus file uploads, upgrades, rollbacks, log cleanup and denied operations in [App Management](./Application.md).

::: tip Menu location
This page is under **System Settings → Security Audit**.
:::

The page notice explains which events are covered and how to filter them. App auditing includes **adding apps and file operations**. It also explains that Success for an asynchronous command only means successful submission; check the app status and logs for its actual running state.

<!-- Image: Security audit list page -->

## 2 Event types

Filter by **Category** first, then by the specific **Event**. Existing access authentication, website password and configuration events remain available. App management events are listed in [2.3](#_2-3-app-management).

### 2.1 Access authentication

| Event | Meaning | Attention |
| --- | --- | --- |
| Sign-in OK | An account passed authentication | Routine |
| Wrong password | Incorrect password at sign-in | Routine |
| Wrong code | Incorrect two-step verification code | Routine |
| Locked out | Too many failures; the account or source IP is locked | **Important** |
| Signed out | The visitor signed out themselves | Routine |
| Kicked | An administrator forced the session offline from [Active Sessions](./AccessSession.md) | Routine |
| Ticket issued | The auth center issued a cross-site ticket | Routine |
| Ticket redeemed | A business site redeemed a ticket successfully | Routine |
| Ticket replay | A ticket was reused, forged or already expired | **Important** |
| Bad return address | The post-sign-in return address failed validation; likely an open-redirect attempt | **Important** |
| Denied | An unauthenticated request was blocked (high-frequency, throttled) | Routine |
| IP group bypass | Let through by a bypass IP group | Routine |
| Service token bypass | Let through by a valid service token | Routine |

::: warning
**Ticket replay** and **Bad return address** should not occur in normal use. Tickets are redeemed immediately after issuance, and return addresses are always signed by the WAF itself — seeing these events essentially means someone is crafting requests deliberately.
:::

### 2.2 Config change

Records of sensitive configuration operations. This category is reserved for more sensitive operations in the future; it currently contains:

| Event | Meaning | Attention |
| --- | --- | --- |
| SSL cert exported | Writing a certificate/key to a server file via "Certificate Export" in [SSL Certificate Management](./SSL.md) (both success and denial are recorded) | **Important** |

::: tip
Config-change events record the **operator, target path and result**, so you can trace "who exported which certificate, where and when". For safety they contain **no** certificate or private-key material.
:::

### 2.3 App management

Select **App management** (`app`) to view these events:

| Event | Event identifier | Meaning |
| --- | --- | --- |
| Add app | `app_add` | Add an app configuration |
| Edit app | `app_edit` | Edit an existing app configuration |
| Delete app | `app_del` | Submit an app deletion command |
| Start app | `app_start` | Submit a start command |
| Stop app | `app_stop` | Submit a stop command |
| Restart app | `app_restart` | Submit a restart command |
| Upload app file | `app_upload` | Upload an app file |
| Upgrade app | `app_upgrade` | Upload a file and perform an upgrade |
| Roll back app | `app_rollback` | Roll back an app file |
| Clear app logs | `app_clear_logs` | Clear app runtime logs |
| App operation denied | `app_op_denied` | Reject an operation when the app operation credential check fails |

App events record the management **operator account, source IP, API path and result**. The existing **Detail** (`Message`) field summarizes the app code (`app`, corresponding to the app's `code`), app name (`name`), safe filename (`file`, basename only, without directories) and stage (`stage`). Information not yet available may be empty; a rejection during the operation credential check primarily records the stage and reason. App auditing does not add separate app code, name or file filters.

::: tip Asynchronous commands and recorded data
**Result 1 is shown as Success; result 0 is shown as Failure.** For asynchronous commands such as delete, start, stop and restart, Success only means the command was submitted (`stage=submitted`). It does not confirm healthy operation or final completion. Check the running status, recent error and logs in [App Management](./Application.md).

App auditing keeps operation summaries and does not store the **app operation credential, environment variable values or full commands**.
:::

## 3 Steps

The top-right corner filters by **Category** (Access auth / Website password / Config change / App management), **Event**, **Account**, **Source IP** and **Site**; set your criteria and click **Search**.

To find app operations, select **App management**, then choose a specific event above or enter the operator account and source IP. Read app information in the **Detail** column. App events usually have no associated site, so clear the Site filter when looking for them.

In the list:

- The **Result** column shows **Success / Failure** tags for `1 / 0`; asynchronous commands only report the submission result
- High-risk events (Locked out, Ticket replay, Bad return address) are tagged red; sign-in failures and denied app operations are orange
- **Location** is resolved from the source IP

## 4 Throttling and retention

**Denied** is the only high-frequency event in this table — a single directory scan produces thousands of unauthenticated requests. To keep genuinely valuable records from being drowned out, it is throttled to **one entry per IP + site per 5 minutes**.

Retention is controlled by `access_audit_retain_days` under the `access` category in system config, **default 90 days**; a scheduled task removes older entries. Adjust it in [System Config](./SystemConfig.md).

## 5 Notifications

Some events can be pushed to your [Notification Channels](./NotifyChannel.md); subscribe under [Notification Subscription](./NotifySubscription.md):

| Message type | Events |
| --- | --- |
| Access Sign-in | Sign-in OK |
| Access Alert | Locked out, ticket replay, bad return address |

::: tip
Only the events above trigger notifications. **Denied requests and single wrong passwords do not** — otherwise one scan would flood your inbox. The same "event + IP" also sends at most once per 5 minutes.
The audit table records everything; notifications only carry what is worth interrupting you for.
:::

## 6 Field reference

| Field | Description |
| --- | --- |
| Category | Access auth / Website password / Config change / App management |
| Event | Event type, see [2](#_2-event-types) |
| Result | `1` means Success; `0` means Failure. Asynchronous app commands only report submission results |
| Account | The related access account, or the management operator account for app operations (may be empty for unauthenticated events) |
| Site | The domain being accessed; usually empty for app events |
| Request URL | The business request address or the management API path for an app operation |
| Source IP | The client IP that made the request |
| Location | Country and region resolved from the source IP |
| Detail | Event details, such as the failure reason; app events include available summaries of the app code, name, safe filename and stage, see [2.3](#_2-3-app-management) |
| Create time | When the event occurred |

## 7 FAQ

- **I see a lot of "Denied" entries.** Someone is scanning or probing your protected sites — which means the feature is doing its job. If the source is stable, block it via [IP Blacklist](./IPBlack.md) or [Firewall IP Block](./FirewallIPBlock.md).

- **Is "Ticket replay" serious?** Check the source IP and account first. A real user hitting the browser back button can trigger it once; **repeated occurrences in a short window** should be treated as an attack.

- **What about "Bad return address"?** Someone is crafting the return parameter to redirect the post-sign-in hop off-site (open redirect). SamWaf already blocked it and fell back to the home page, so no action is strictly required — but recording and blocking the source IP is advisable.

- **Will the audit log eat a lot of space?** High-frequency events are throttled and only 90 days are kept by default. Lower `access_audit_retain_days` if storage is tight.

- **A record I expected is missing.** Check your filters. For app events, select App management and clear any Site condition that does not apply. Also note that "Denied" is throttled to 5 minutes, so repeated hits from the same IP on the same site leave only one entry.

## 8 Update history

| Applicable version | Changes |
| --- | --- |
| >v1.3.25-beta.9 (unreleased) | Added the App management category (`app`) and 11 event filters; documented operator and app summaries, asynchronous command submission results and the scope of sensitive data excluded from records. |
