# Access Audit

## 1 Overview

The security event stream for [Access Authentication](./AccessConfig.md): who did what, when, from which IP, against which site, and whether it succeeded.

Notice at the top of the page: **Security event stream for Access Authentication. Ticket replay and bad return address should never appear in normal operation - when they do, someone is crafting requests deliberately. Denied is high-frequency and throttled to one entry per IP+site per 5 minutes.**

<!-- Image: Access audit list page -->

## 2 Event types

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

## 3 Steps

The top-right corner filters by **Event**, **Account**, **Source IP** and **Site**; set your criteria and click **Search**.

In the list:

- The **Result** column shows **Success / Failure** tags
- High-risk events (Locked out, Ticket replay, Bad return address) are tagged red; sign-in failures are orange
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
| Event | Event type, see [2](#_2-event-types) |
| Result | Success / Failure |
| Account | The related access account (may be empty for unauthenticated events) |
| Site | The domain being accessed |
| Request URL | The full address being accessed |
| Source IP | The client IP that made the request |
| Location | Country and region resolved from the source IP |
| Detail | Event details, such as the failure reason |
| Create time | When the event occurred |

## 7 FAQ

- **I see a lot of "Denied" entries.** Someone is scanning or probing your protected sites — which means the feature is doing its job. If the source is stable, block it via [IP Blacklist](./IPBlack.md) or [Firewall IP Block](./FirewallIPBlock.md).

- **Is "Ticket replay" serious?** Check the source IP and account first. A real user hitting the browser back button can trigger it once; **repeated occurrences in a short window** should be treated as an attack.

- **What about "Bad return address"?** Someone is crafting the return parameter to redirect the post-sign-in hop off-site (open redirect). SamWaf already blocked it and fell back to the home page, so no action is strictly required — but recording and blocking the source IP is advisable.

- **Will the audit log eat a lot of space?** High-frequency events are throttled and only 90 days are kept by default. Lower `access_audit_retain_days` if storage is tight.

- **A record I expected is missing.** Check your time range and filters. Also note that "Denied" is throttled to 5 minutes, so repeated hits from the same IP on the same site leave only one entry.
