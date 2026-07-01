# Notify Channel

## Overview

Notify channels define **where messages are sent**. SamWaf uses the channels configured here to push system alerts and notifications to you.

The notification feature works in three parts:

- **Notify Channel**: how messages are sent (the concrete delivery config for DingTalk, Feishu, Email, etc.).
- **Notify Subscription**: which event types are sent to which channels.
- **Notify Log**: the delivery result of every notification.

This page covers the first part. Supported channel types are: DingTalk, Feishu, WeChat Work, Email, and ServerChan.

<!-- Image: Notify channel list page -->

## Steps

### 1. Add a Channel

1. Click the **Add Channel** button at the top left.
2. Enter a **Channel Name** and select a **Channel Type**.
3. Fill in the configuration parameters for the selected type (the fields differ by type, see the per-type sections below).
4. Choose a **Status** (On / Off).
5. Optionally enter **Remarks**.
6. Click **Confirm** to save.

<!-- Image: Add notify channel form -->

### 2. Configuration by Channel Type

#### DingTalk / Feishu / WeChat Work

- **Webhook URL**: the group bot webhook URL (required).
- **Secret**: used for signature verification (required for DingTalk and Feishu; WeChat Work needs no secret).

> How to get a WeChat Work bot webhook: in a WeChat Work group chat, click "···" in the top right → "Add Group Bot" → "Create a new bot", then copy the generated webhook URL.

#### ServerChan

- **SendKey**: the SendKey obtained from the ServerChan console. Both the standard format (starting with SCT) and the sctp self-hosted format are supported.

> How to get a SendKey: visit the ServerChan website (https://sct.ftqq.com/) and log in by scanning the QR code with WeChat, copy your SendKey from the console, and configure the receiving platforms (WeChat, WeChat Work, DingTalk, etc.) on the "Message Channels" page.

#### Email

Fill in the SMTP parameters (see the Field Reference below). The page includes a "Common Email Configuration Reference" collapsible panel with SMTP server, port and encryption references for QQ, 163, 126, Gmail, Outlook, Aliyun and other mailboxes.

> Important: Use SSL/TLS for port 465 and STARTTLS for port 587. Port 25 must use STARTTLS if authentication is required, otherwise the server will reject it. Most mailboxes require enabling SMTP service first and generating an **authorization code** (not the login password).

When the encryption mode is set to **SSL/TLS** or **STARTTLS**, a **Cert Verify** option appears. If the mail server uses a **self-signed certificate** (common for self-hosted internal mail servers), you can check **Skip certificate verification (self-signed)** so that SamWaf no longer verifies the server's TLS certificate.

::: warning Security note
Checking "skip certificate verification" lowers transport security and exposes you to man-in-the-middle attacks. Use it **only on trusted internal networks**.
:::

<!-- Image: Email channel skip certificate verification option -->

### 3. Test a Channel

Click the **Test** button on a channel row, and SamWaf will attempt to send a test message through that channel. After the "Test successful" message, confirm on the corresponding platform that the notification was received.

### 4. Enable / Disable

Each channel row has a status switch you can toggle to enable or disable it directly.

### 5. Edit / Delete

- Click **Edit** to modify the channel configuration.
- Click **Delete** to remove the channel. After deletion, related subscriptions are also deleted.

## Field Reference

### Common Fields

| Field | Description |
|-------|-------------|
| Channel Name | The channel's display name. Required. |
| Channel Type | DingTalk / Feishu / WeChat Work / Email / ServerChan. Required. |
| Status | On / Off, controls whether the channel is active. |
| Remarks | Custom note. Optional. |

### DingTalk / Feishu / WeChat Work

| Field | Description |
|-------|-------------|
| Webhook URL | Group bot webhook URL. Required. |
| Secret | Signing secret. Optional; not needed for WeChat Work. |

### ServerChan

| Field | Description |
|-------|-------------|
| SendKey | SendKey from the ServerChan console. Supports SCT and sctp formats. |

### Email

| Field | Description |
|-------|-------------|
| SMTP Server | Mail server address, e.g. smtp.gmail.com. |
| SMTP Port | Server port, default 25; commonly 465 (SSL/TLS) or 587 (STARTTLS). |
| Username | Email account, usually the same as the from email. |
| Password | Email password or authorization code. |
| From Email | Sender email address. |
| From Name | Sender display name. Optional. |
| To Email(s) | Default recipient(s), separate multiple with commas; can be overridden per message type in a subscription, otherwise this default is used. |
| Encryption Mode | None / SSL/TLS / STARTTLS. |
| Cert Verify | Shown only when the encryption mode is SSL/TLS or STARTTLS. Checking "Skip certificate verification (self-signed)" disables TLS certificate verification of the mail server, for internal mail servers with self-signed certificates. This lowers security; use only on trusted networks. |

## FAQ

**What if the test fails?**

- For email channels, make sure the port matches the encryption mode (465 for SSL/TLS, 587 for STARTTLS) and that the password is the email **authorization code**, not the login password.
- If you get **connection refused**, the SMTP server address or port is unreachable. Verify the server IP and port are correct and the network is reachable.
- If the mail server uses a self-signed certificate and you get a **certificate verification error** (e.g. certificate signed by unknown authority), check **Skip certificate verification (self-signed)** in the channel configuration and retry.
- For DingTalk / Feishu, verify the webhook URL and secret are correct and that the bot's signing setting matches.
- Check the specific error message in [Notify Log](./NotifyLog.md).

**Why am I not receiving notifications after configuring a channel?**

Configuring a channel alone is not enough. You must also subscribe the relevant message types to this channel in [Notify Subscription](./NotifySubscription.md).
