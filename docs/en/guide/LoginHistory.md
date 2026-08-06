# Login History

## Overview

Login History answers the question "where was my admin account signed in from last time, and is this sign-in coming from the same place?"

It consists of two parts:

- **Sign-in notice**: every time you sign in and enter the system, a notification pops up in the bottom-right corner showing the IP and location of the current sign-in, compared against the account's previous sign-in. If the source has changed, the previous IP, location, and sign-in time are listed as well.
- **Login history list**: under **Account → Login History** you can review every sign-in record per account, including IP, location, client type, user agent, and whether the source changed.

<!-- Image: Sign-in notice in the bottom-right corner -->

## Prerequisites

- The **sign-in notice** is shown to every account that signs in to the admin console; no configuration is required.
- The **login history list** belongs to the audit domain and requires the **Super Admin** or **Audit Admin** role. Roles are configured in [Account Management](./Account.md).
- Location resolution relies on the built-in IP database. If it shows "Unknown", check [IP Database Management](./IPLocation.md).

## Steps

### 1. Read the Sign-in Notice

After a successful sign-in, the notification appears automatically in the bottom-right corner — no action needed:

- **Same source as last time**: a green notification titled "Sign-in Notice" showing the current IP, location, and sign-in time, with the message "Same source as your last sign-in." It closes automatically after about 6 seconds.
- **First sign-in for this account**: also a green notification, with the message "This is the first recorded sign-in for this account; the next sign-in will be compared against it." Accounts upgraded from an older version will see this on their first sign-in.
- **Source changed**: an orange notification titled "Sign-in Source Changed". In addition to the current details it lists **Previous IP**, **Previous Location**, and **Previous Sign-in Time**, with the message "This sign-in came from a different source than the last one. If this was not you, change your password immediately."

::: warning
The source-changed notification **does not close automatically** — you must click the close button in its top-right corner, so you will not miss the alert if you step away from the computer. A **View login history** button at the bottom of the notification jumps straight to the login history page.
:::

<!-- Image: Sign-in source changed notification -->

::: tip
The notification appears only once per sign-in; refreshing the page will not show it again.
:::

### 2. Query the Login History

Go to **Account → Login History**. Three filters are available at the top of the page:

1. **Account**: exact match on the account name.
2. **Sign-in IP**: exact match on the IP.
3. **Source Changed**: choose **All / Changed / Unchanged**.

Click **Search** after filling in the filters (pressing Enter in an input box works too). The list is sorted by sign-in time in descending order and supports pagination.

<!-- Image: Login history list -->

The **Source Changed** column shows one of three tags:

| Tag | Meaning |
|-----|---------|
| First sign-in (grey) | The first record for this account; there is no previous record to compare against. |
| Changed (orange) | The IP or location of this sign-in differs from the previous one. |
| Unchanged (green) | Same source as the previous sign-in. |

The **Previous IP** column only has a value for **Changed** records; otherwise it shows `-`.

### 3. Receive Source-Change Alerts

If you want to be notified even when you are away from the console, push source changes to DingTalk, Feishu, WeCom, email, and other channels:

1. Configure a receiving channel in [Notification Channels](./NotifyChannel.md).
2. Go to [Notification Subscriptions](./NotifySubscription.md) and, on the **Admin Sign-in Source Changed** message type row, select the channels you want.
3. From then on, every source-changed sign-in pushes an "Admin Sign-in Source Changed" alert whose body contains the current and previous IP, location, and time.

::: tip
**Admin Sign-in Source Changed** and **User Login** are two independent message types: the former fires only when the source changes, while the latter fires on every sign-in. If you only want the anomaly alerts without being disturbed by routine sign-ins, subscribe to the former only.
:::

## Field Reference

### Sign-in Notice

| Field | Description |
|-------|-------------|
| Current IP | Source IP of this sign-in. |
| Location | Location of the current sign-in IP. |
| Sign-in Time | Time of this sign-in. |
| Previous IP | Shown only when the source changed; the IP of the account's previous sign-in. |
| Previous Location | Shown only when the source changed; the location of the previous sign-in IP. |
| Previous Sign-in Time | Shown only when the source changed; the time of the previous sign-in. |

### Login History List

| Field | Description |
|-------|-------------|
| Account | The admin account this record belongs to. |
| Sign-in IP | Source IP of this sign-in. |
| Location | Location of the sign-in IP. |
| Source Changed | Whether the source differs from the previous sign-in: First sign-in / Changed / Unchanged. |
| Previous IP | Only populated for **Changed** records; shows the previous IP and location. |
| Client | The client type the sign-in came from. |
| User Agent | The browser or client User-Agent string. |
| Sign-in Time | Time of this sign-in. |

## FAQ

**Why does every sign-in report "source changed"?**

First check whether the IP itself keeps changing. Common causes:

- A dynamic public IP (dial-up home broadband) that changes on every reconnect.
- Access from different networks, for example switching between the office LAN and a phone hotspot.
- The same IP whose location text changed after an IP database update also counts as a change.

Compare the **Sign-in IP** and **Location** columns of two consecutive records in the login history list to see which one actually changed.

**The login history page will not open, or shows no data.**

The page belongs to the audit domain and is only accessible to **Super Admin** and **Audit Admin**. Check the current account's role in [Account Management](./Account.md).

**Location shows "Unknown".**

The IP database did not resolve the address. Private IPs simply have no public location. If a public IP also shows Unknown, check whether the IP database loaded correctly in [IP Database Management](./IPLocation.md).

**Does the login history grow forever?**

No. Only the most recent 200 sign-in records are kept per account; older records are pruned automatically.

**After clearing logs, will every account be treated as a "first sign-in"?**

No. The "previous sign-in" values used for comparison are stored separately on the account and survive log cleanup. Clearing logs only affects how many records remain visible in the login history list.

**Will the notice still appear after a forced password change?**

Yes. When a first sign-in or an expired password requires a password change, the sign-in notice still appears after the change is completed and you enter the system.
