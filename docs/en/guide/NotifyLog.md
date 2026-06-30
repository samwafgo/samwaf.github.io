# Notify Log

## Overview

The notify log records the sending history of every notification, for troubleshooting and statistical analysis.

It is the "result record" among the three parts of the notification feature: [Notify Channel](./NotifyChannel.md) configures how messages are sent, [Notify Subscription](./NotifySubscription.md) configures which events go where, and the notify log shows the actual delivery results (success or failure, including the failure reason).

<!-- Image: Notify log list page -->

## Steps

### 1. Search and Filter

The top of the page provides filter conditions:

- **Message Type**: filter by Rule Trigger, Operation Notice, User Login, Attack Info, Weekly Report, SSL Certificate Expire, System Error, or IP Ban.
- **Send Status**: Success / Failed.
- **Start Time / End Time**: filter by send-time range.

Set the conditions and click **Search**; click **Reset** to clear the filters.

### 2. View Detail

Click **View Detail** on a log entry to open a dialog showing the full information of that notification, including channel name, channel type, message type, message title, message content, recipients (email channels only), send status, error message (when sending failed), and send time.

<!-- Image: Notify log detail dialog -->

### 3. Delete a Log

Click **Delete** on a log entry and confirm to remove that record.

## Field Reference

### List Fields

| Field | Description |
|-------|-------------|
| Channel Name | The name of the channel used to send the notification. |
| Channel Type | The channel type, e.g. DingTalk / Feishu / Email. |
| Message Type | The event type the notification corresponds to. |
| Message Title | The title of the notification. |
| Send Status | Success / Failed. |
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
| Send Status | Success / Failed. |
| Error Message | Shown only when sending failed; records the failure reason. |
| Send Time | The time the notification was sent. |

## FAQ

**How do I troubleshoot a failed notification?**

Filter records with "Send Status" = Failed, click **View Detail** to read the "Error Message" field, and check the corresponding channel's configuration accordingly (such as email SMTP parameters, webhook URL, secret, etc.). You can edit it in [Notify Channel](./NotifyChannel.md) and verify with the **Test** button.
