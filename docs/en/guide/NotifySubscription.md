# Notify Subscription

## Overview

Notify subscriptions define **which event types are sent to which channels**. They link the channels configured in [Notify Channel](./NotifyChannel.md) with the system's various message types, enabling flexible notification strategies.

The page is presented as a matrix table: rows are **message types**, columns are **channel types** (DingTalk, Feishu, Email, ServerChan, WeChat Work), and each cell represents "whether this message type is sent through the corresponding channel".

Supported message types include: User Login, Rule Trigger, IP Ban, Attack Info, SSL Certificate Expire, Weekly Report, System Error, and Operation Notice.

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

## Field Reference

| Field | Description |
|-------|-------------|
| Message Type | The system event type to subscribe to (see the list below). |
| Channel | The notify channel that receives this message type, sourced from Notify Channel configuration. |
| Recipients | Email channels only; recipients specified for this subscription, separated by commas; leave blank to use the channel default. |
| Status | The enabled / disabled state of the subscription. |

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

## FAQ

**Why are there no clickable channels in a cell?**

A cell only lists channels of the corresponding type that are **already configured in Notify Channel**. If it is empty, add a channel of that type in [Notify Channel](./NotifyChannel.md) first.

**What if I don't receive notifications after subscribing?**

Make sure the corresponding channel is enabled, the subscription itself is enabled, and check the delivery result and error message in [Notify Log](./NotifyLog.md).
