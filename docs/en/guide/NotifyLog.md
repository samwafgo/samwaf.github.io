# Notify Log

## Overview

The notify log records the sending history of every notification, for troubleshooting and statistical analysis.

It is the "result record" among the three parts of the notification feature: [Notify Channel](./NotifyChannel.md) configures how messages are sent, [Notify Subscription](./NotifySubscription.md) configures which events go where, and the notify log shows the actual delivery results (success or failure, including the failure reason).

<!-- Image: Notify log list page -->

## Steps

### 1. Search and Filter

The top of the page provides filter conditions:

- **Message Type**: filter by Rule Trigger, Operation Notice, User Login, Attack Info, Weekly Report, SSL Certificate Expire, System Error, IP Ban, Access Sign-in, Access Alert, or Admin Sign-in Source Changed.
- **Send Status**: Success / Failed / Suppressed.
- **Start Time / End Time**: filter by send-time range.

Set the conditions and click **Search**; click **Reset** to clear the filters.

### 2. Review Suppressed Notifications

"Suppressed" means the notification was **not sent**, usually because it matched the rate control or filter conditions configured in [Notify Subscription](./NotifySubscription.md). The **Suppress Reason** column states exactly what blocked it:

| Suppress Reason | Meaning |
|-----------------|---------|
| In cooldown | The rate-control cooldown had not finished. |
| Hourly limit reached | The subscription's "Max Per Hour" was hit. |
| Quiet hours | The event fell inside quiet hours and its severity was not high enough to bypass. |
| Filter not matched | Domain / IP / keyword / minimum severity did not match. |

The `xN` badge after the reason means N similar notifications were collapsed within the same suppression window.

::: tip
Suppression records are written in a merged fashion: no matter how many notifications are suppressed within one window, only a single log entry is created and its count is accumulated. Heavy suppression will not flood the log.
:::

<!-- Image: Suppressed records in notify log -->

### 3. View Detail

Click **View Detail** on a log entry to open a dialog showing the full information of that notification, including channel name, channel type, message type, message title, message content, recipients (email channels only), send status, error message (when sending failed), and send time.

Suppressed records additionally show **Suppress Reason** and **Suppressed Count**; records that used a custom template show **Template Source**.

<!-- Image: Notify log detail dialog -->

### 4. Delete a Log

Click **Delete** on a log entry and confirm to remove that record.

## Field Reference

### List Fields

| Field | Description |
|-------|-------------|
| Channel Name | The name of the channel used to send the notification. |
| Channel Type | The channel type, e.g. DingTalk / Feishu / Email. |
| Message Type | The event type the notification corresponds to. |
| Message Title | The title of the notification. |
| Send Status | Success / Failed / Suppressed. |
| Suppress Reason | Shown for suppressed records only; explains what blocked the notification. The trailing `xN` is the accumulated count within that suppression window. |
| Send Time | The time the notification was sent. |

### Detail Fields

| Field | Description |
|-------|-------------|
| Channel Name | The channel name used. |
| Channel Type | The channel type used. |
| Message Type | The event type the notification corresponds to. |
| Message Title | The notification title. |
| Message Content | The notification body content. |
| Recipients | Shown for email channels only; the actual recipients. |
| Send Status | Success / Failed / Suppressed. |
| Suppress Reason | Shown when suppressed; the reason the notification was not sent. |
| Suppressed Count | Shown when suppressed; how many notifications were collapsed within the same window. |
| Template Source | Built-in default / Custom template / Template failed, fell back. |
| Error Message | Shown only when sending failed; records the failure reason. |
| Send Time | The time the notification was sent. |

## FAQ

**How do I troubleshoot a failed notification?**

Filter records with "Send Status" = Failed, click **View Detail** to read the "Error Message" field, and check the corresponding channel's configuration accordingly (such as email SMTP parameters, webhook URL, secret, etc.). You can edit it in [Notify Channel](./NotifyChannel.md) and verify with the **Test** button.

**There are no failed records, but I really did not receive the notification?**

Filter "Send Status" by **Suppressed**. When a notification is blocked by rate control or filters it does not produce a "Failed" record — it is recorded as "Suppressed", with the reason in the "Suppress Reason" column. Adjust it via the gear icon on the matching cell in [Notify Subscription](./NotifySubscription.md).

**What does "Template failed, fell back" mean in Template Source?**

It means the subscription has a custom template but rendering failed (for example a malformed variable), so the system sent the notification using the built-in format instead — the notification itself was not lost. Go to the **Message Template** tab in [Notify Subscription](./NotifySubscription.md) and use **Refresh Preview** to check the template syntax.
