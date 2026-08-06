# Notify Subscription

## Overview

Notify subscriptions define **which event types are sent to which channels**. They link the channels configured in [Notify Channel](./NotifyChannel.md) with the system's various message types, enabling flexible notification strategies.

The page is presented as a matrix table: rows are **message types**, columns are **channel types** (DingTalk, Feishu, Email, ServerChan, WeChat Work, Custom Webhook), and each cell represents "whether this message type is sent through the corresponding channel".

Supported message types include: User Login, Rule Trigger, IP Ban, Attack Info, SSL Certificate Expire, Weekly Report, System Error, Operation Notice, Access Sign-in, Access Alert, and Admin Sign-in Source Changed.

<!-- Image: Notify subscription matrix table -->

## Steps

### 1. Add a Single Subscription

1. In the matrix, find the cell at the intersection of the "message type" row and the "channel" column you want to configure.
2. The cell lists the concrete channels configured under that type. When not subscribed, a channel button with a "+" is shown; click it to add a subscription.
3. For email channels, a recipient configuration dialog pops up on add (see below); for other channels the subscription is created immediately.

> If a channel is disabled, its button cannot be clicked and no subscription can be added.

### 2. Configure Email Recipients

Email channels support specifying recipients per subscription:

1. Add an email subscription, or click **Edit** on an existing email subscription.
2. In the "Configure Email Recipients" dialog, fill in the **Recipients** (separate multiple emails with commas).
3. **Optional**: leave it blank to use the default recipients configured for that channel in Notify Channel.
4. Click **Confirm** to save.

<!-- Image: Configure email recipients dialog -->

### 3. Enable / Disable a Single Subscription

A subscribed cell contains a switch you can toggle to enable or disable that subscription directly.

### 4. Delete a Single Subscription

Click the close icon next to a subscription item and confirm to delete it.

### 5. Batch Operations

Each channel column header has a "···" dropdown menu for batch operations across all message types under that channel type:

- **Batch Add**: add subscriptions for all channels of that channel type across all message types at once.
- **Batch Enable**: enable all subscriptions under that channel type.
- **Batch Disable**: disable all subscriptions under that channel type (requires confirmation).
- **Batch Delete**: delete all subscriptions under that channel type (requires confirmation, cannot be undone).

<!-- Image: Channel header batch operation menu -->

### 6. Per-Subscription Settings

Every subscribed cell has a **gear icon**. Click it to open the "Subscription Settings" drawer, where you can configure rate control, message format and filters for that single "message type × channel" pair.

The drawer has four tabs: **Rate Control**, **Message Template**, **Filters**, and **Test & Preview**.

Below the cell, a line of small grey text shows the non-default settings currently in effect (for example `Escalating Cooldown · 20/h limit · Custom Template`). Cells that were never configured individually show nothing there, so you can tell at a glance which cells have been customized.

<!-- Image: Subscription settings drawer - Rate Control -->

#### Rate Control

Solves the problem of the same kind of event firing repeatedly in a short period and flooding your channel. Four modes are available:

| Mode | Behavior |
|------|----------|
| Inherit Global Default | Follows the global default configuration; changing the global setting takes effect here (default). |
| Send Immediately | Every event is sent right away. Best for low-volume but important alerts. |
| Aggregate | Similar events within a time window are merged into a single message. |
| Escalating Cooldown | The first event is sent immediately, then the cooldown escalates step by step. Best for ongoing attacks. |

::: tip
Different channels can use different modes. For example, set Feishu to "Escalating Cooldown" to receive only key alerts while keeping Email on "Send Immediately" for a full record — the two do not affect each other.
:::

The visible options depend on the selected mode:

- **Aggregate**: set "Aggregate Window (s)" and "Max Merged Details".
- **Escalating Cooldown**: set "Cooldown Steps (s)" (comma separated, up to 5 levels, the last one is the cap, e.g. `60,300,900`) and "Cooldown Reset (s)" (after this long without new events the cooldown level resets, restoring sensitivity).
- **Max Per Hour**: available in any non-inherit mode; 0 means unlimited. Anything over the limit is logged as suppressed, never silently lost.
- **Dedup Dimensions**: available in Aggregate and Cooldown modes. Throttling distinguishes events by the selected fields: Message Type / Domain / IP / Attack Type / Rule Text.
- **Quiet Hours**: format `HH:MM-HH:MM`, supports crossing midnight (e.g. `23:00-07:00`); leave blank to disable. When enabled you can also pick a "Bypass Severity" — alerts at or above that severity are still sent during quiet hours.

::: warning About dedup dimensions
"Rule Text" changes with the attack payload. If you deduplicate by it alone, an attacker varying the payload makes every event look new and rate control stops working. Keep stable dimensions such as "Domain" and "Attack Type".
:::

#### Message Template

Customizes the title and body of the notification.

1. Fill in **Title Template** / **Body Template**. Leave them blank to use the built-in format.
2. The "Available Variables" area lists the variables available for the current message type (in the form `{{.Domain}}`). Click a variable to insert it into the body.
3. Click **Refresh Preview** to render the result with sample data. This sends nothing.
4. Click **Reset to Default** to clear the templates and go back to the built-in format.
5. Click **Apply to all channels of this type** to push the current template to every channel of this message type at once (templates only — rate control configured per channel is not overwritten).

<!-- Image: Subscription settings drawer - Message template and preview -->

::: tip
Template syntax errors are rejected when saving. If a previously saved template fails to render at send time, the system automatically falls back to the built-in format so the notification is never lost; the fallback is recorded in the "Template Source" field of [Notify Log](./NotifyLog.md).
:::

#### Filters

Only lets matching events go through this subscription. Leaving everything blank means no filtering.

- **Only These Domains**: supports `*.example.com` wildcards, one per line.
- **Exclude These IPs**: supports CIDR such as `10.0.0.0/8`; matching events are not sent.
- **Keywords**: the event is sent only if the rule info / attack type / URL matches any keyword. Case insensitive.
- **Minimum Severity**: All / Info / Warning / Critical. Events below that severity are not sent.

#### Test & Preview

For troubleshooting "why didn't I get a notification".

- **Dry Run**: simulates without sending, and reports whether an event right now would go out or what would block it, along with the remaining cooldown seconds, how many were sent this hour, and how many have been suppressed.
- **Test Send**: really sends one notification using sample data and the template currently being edited, bypassing rate control and filters. The title is prefixed with "【测试】".

<!-- Image: Subscription settings drawer - Dry run result -->

### 7. Batch Rate Control Settings

The "···" dropdown in each channel column header has a new **Batch Settings** item, which applies one rate-control configuration to every message type under that channel type at once. You must tick **Apply Rate Control** in the dialog for it to take effect, which prevents overwriting other settings by accident.

### 8. Global Defaults

The **Global Defaults** button in the top right of the page sets the default rate-control parameters for all subscriptions. Whenever a subscription's mode is "Inherit Global Default", or an individual field is left blank, these values are used.

| Setting | Default |
|---------|---------|
| Throttle Mode | Aggregate |
| Aggregate Window (s) | 10 |
| Max Merged Details | 10 |
| Cooldown Steps (s) | 60,300,900 |
| Cooldown Reset (s) | 1800 |
| Max Per Hour | 0 (unlimited) |
| Dedup Dimensions | Message Type, Domain, Attack Type |

There is also a **Notification Debug Log** switch: when enabled, every rate-control decision is written to the debug log, which helps with tricky troubleshooting. Turn it off once you are done.

<!-- Image: Global defaults dialog -->

## Field Reference

| Field | Description |
|-------|-------------|
| Message Type | The system event type to subscribe to (see the list below). |
| Channel | The notify channel that receives this message type, sourced from Notify Channel configuration. |
| Recipients | Email channels only; recipients specified for this subscription, separated by commas; leave blank to use the channel default. |
| Status | The enabled / disabled state of the subscription. |

### Rate Control Fields

| Field | Description |
|-------|-------------|
| Throttle Mode | Inherit Global Default / Send Immediately / Aggregate / Escalating Cooldown. |
| Aggregate Window (s) | In Aggregate mode, how long similar events are collected before being merged into one message. 0 inherits the global default. |
| Max Merged Details | How many detail entries a merged notification shows at most; the rest is summarized as "and N more records". |
| Cooldown Steps (s) | Cooldown durations per level in Cooldown mode. Comma separated, up to 5 levels, the last one is the cap. |
| Cooldown Reset (s) | After this long without new events, the cooldown level resets and sensitivity is restored. |
| Max Per Hour | Maximum notifications this subscription sends per hour. 0 means unlimited. |
| Dedup Dimensions | Which fields throttling uses to tell events apart: Message Type / Domain / IP / Attack Type / Rule Text. |
| Quiet Hours | Format `HH:MM-HH:MM`, supports crossing midnight. Leave blank to disable. |
| Bypass Severity | Alerts at or above this severity are still sent during quiet hours: No Bypass / Warning / Critical. |

### Message Template Fields

| Field | Description |
|-------|-------------|
| Title Template | Custom notification title. Leave blank to use the built-in format. |
| Body Template | Custom notification body. Leave blank to use the built-in format. |
| Available Variables | The variables available for the current message type; click one to insert it into the body. |

Available variables differ per message type; the "Available Variables" area lists all of them with sample values. Variables shared by every type:

| Variable | Description |
|----------|-------------|
| `{{.Time}}` | Event time |
| `{{.ServerName}}` | Local instance name |
| `{{.MessageTypeName}}` | Message type name |
| `{{.Severity}}` | Severity level |

### Filter Fields

| Field | Description |
|-------|-------------|
| Only These Domains | Supports `*.example.com` wildcards. Blank means no restriction. |
| Exclude These IPs | Supports CIDR; matching events are not sent. |
| Keywords | The event is sent only when the rule info / attack type / URL matches any keyword. |
| Minimum Severity | Events below this severity are not sent. |

### Message Types

| Type | Description |
|------|-------------|
| User Login | Management console user login event. |
| Rule Trigger | A protection rule was triggered. |
| IP Ban | An IP ban event. |
| Attack Info | Information about a detected attack. |
| SSL Certificate Expire | An SSL certificate is about to expire or has expired. |
| Weekly Report | Periodic statistics report. |
| System Error | A system runtime error. |
| Operation Notice | Notifications related to management operations. |
| Access Sign-in | A successful sign-in through unified access authentication. |
| Access Alert | A security anomaly detected by unified access authentication. |
| Admin Sign-in Source Changed | An admin account signed in from an IP or location different from its previous sign-in. See [Login History](./LoginHistory.md). |

## FAQ

**Why are there no clickable channels in a cell?**

A cell only lists channels of the corresponding type that are **already configured in Notify Channel**. If it is empty, add a channel of that type in [Notify Channel](./NotifyChannel.md) first.

**What if I don't receive notifications after subscribing?**

Work through these steps:

1. Make sure the corresponding channel is enabled and the subscription itself is enabled.
2. Open the gear icon on that cell → **Test & Preview** → click **Dry Run**. It tells you directly whether an event right now would be sent, or what would block it (cooldown / hourly limit / quiet hours / filter not matched).
3. Go to [Notify Log](./NotifyLog.md), filter "Send Status" by **Suppressed**, and check the suppression reason and the number of suppressed messages.
4. If the configuration looks fine, use **Test Send** to run the real delivery path — it bypasses rate control and filters and exposes channel-level errors directly.

**What if I get too many notifications?**

Open the gear icon on that cell → **Rate Control**, switch to "Aggregate" or "Escalating Cooldown", and set "Max Per Hour" if needed. To change every subscription at once, edit **Global Defaults** in the top right of the page.

Note: do not select only "Rule Text" as the dedup dimension — payload variations make every event look new and rate control stops working.

**My custom template has no effect and I still receive the default format?**

Check the "Template Source" field of that record in [Notify Log](./NotifyLog.md). If it shows "Template failed, fell back", the template errored while rendering and the system automatically fell back to the built-in format. Go back to the **Message Template** tab and use **Refresh Preview** to check the template syntax.

**I changed the global defaults, why is one cell unaffected?**

That cell has its own configuration. Subscription-level settings take priority over the global defaults; set its "Throttle Mode" back to "Inherit Global Default" and clear the individual fields. Also note the global configuration is cached for about 30 seconds.
