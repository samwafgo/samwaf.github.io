# Notify Channel

## Overview

Notify channels define **where messages are sent**. SamWaf uses the channels configured here to push system alerts and notifications to you.

The notification feature works in three parts:

- **Notify Channel**: how messages are sent (the concrete delivery config for DingTalk, Feishu, Email, etc.).
- **Notify Subscription**: which event types are sent to which channels.
- **Notify Log**: the delivery result of every notification.

This page covers the first part. Supported channel types are: DingTalk, Feishu, WeChat Work, Email, ServerChan, and Custom Webhook.

If the platform you want to integrate is not one of the built-in types (for example Slack, Telegram, Bark, ntfy, Gotify, or your own alerting system), use **Custom Webhook** and define the request URL, method, headers and payload format yourself.

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

#### Custom Webhook

For platforms the built-in types do not cover. After selecting **Custom Webhook** as the channel type, configure the following:

**1) Pick a preset (optional)**

The **Preset** dropdown offers Generic JSON, Slack, Discord, Telegram Bot, Bark, ntfy and Gotify. Selecting one fills in the **Method**, **Content-Type**, **Custom headers** and **Body template** automatically. **You still enter the URL yourself** — the preset only provides a format example. Choosing "Custom (no fill)" leaves everything untouched.

::: tip
Picking a preset only fills the form. SamWaf never contacts these platforms on its own — whether and where anything is sent is entirely determined by the webhook URL you enter.
:::

**2) Enter the Webhook URL**

The address where the receiving platform accepts messages. Only `http` / `https` is allowed, and the target must be a **public address** — private addresses such as `127.0.0.1` or `192.168.x.x` are rejected on save.

**3) Choose the method and content type**

- **Method**: POST, PUT, PATCH, GET, DELETE. No request body is sent when GET is selected.
- **Content-Type**: application/json, application/x-www-form-urlencoded, text/plain, text/xml — or type any other value directly.

**4) Add custom headers (optional)**

Click **Add header** and enter the header name and value. A common use is authentication, such as `Authorization` / `Bearer xxxxxx`. Up to 20 headers.

::: warning
System-controlled headers such as `Host`, `Content-Length` and `Transfer-Encoding` cannot be overridden, and header values must not contain line breaks. Invalid entries are rejected on save with a message.
:::

**5) Write the body template**

The **Body template** defines what the outgoing payload looks like. Leave it blank to send the built-in default payload (a JSON object containing all variables when the content type is JSON; otherwise plain text with the title, a blank line, and the body).

The following variables are available. Click a variable tag above the input to insert it:

| Variable | Description |
|----------|-------------|
| `{{.Title}}` | Notification title |
| `{{.Content}}` | Notification body |
| `{{.Time}}` | Event time |
| `{{.MessageType}}` | Message type key (e.g. `rule_trigger`) |
| `{{.MessageTypeName}}` | Message type name (e.g. "Rule Triggered") |
| `{{.Severity}}` | Severity (info / warn / critical) |
| `{{.ServerName}}` | Local server name |

For example, a body template for Slack:

```json
{
  "text": "*{{.Title}}*\n{{.Content}}"
}
```

::: tip Body template vs. message template
The **Body template** here only defines the payload envelope — the field names the receiving platform expects. The **alert text itself** comes from the **Message Template** in [Notify Subscription](./NotifySubscription.md); its rendered output becomes the `{{.Title}}` and `{{.Content}}` used here.

So detail variables such as domain, attacker IP or rule info belong in the **subscription's message template**. Putting them in the body template fails validation with a "variable does not exist" message.
:::

When the content type is JSON, variable values are JSON-escaped automatically (quotes and line breaks in the body will not break the payload), and the rendered result is validated as JSON before saving, so unbalanced braces or quotes are reported immediately.

<!-- Image: Custom Webhook channel configuration form -->

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
| Channel Type | DingTalk / Feishu / WeChat Work / Email / ServerChan / Custom Webhook. Required. |
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

### Custom Webhook

| Field | Description |
|-------|-------------|
| Preset | Generic JSON / Slack / Discord / Telegram Bot / Bark / ntfy / Gotify. Selecting one fills in the method, headers and body template; you still enter the URL. "Custom (no fill)" leaves existing values untouched. |
| Webhook URL | Where the receiving platform accepts messages. Required. Only http / https, and the target must be a public address. |
| Method | POST / PUT / PATCH / GET / DELETE, default POST. No request body is sent with GET. |
| Content-Type | The request Content-Type, default application/json. Common values are offered in a dropdown, or type your own. |
| Custom headers | Header name and value pairs, up to 20. System-controlled headers such as Host and Content-Length cannot be overridden, and values must not contain line breaks. |
| Body template | The payload sent to the receiver. Supports variables such as `{{.Title}}` and `{{.Content}}`. Leave blank to send the built-in default payload. |

## FAQ

**What if the test fails?**

- For email channels, make sure the port matches the encryption mode (465 for SSL/TLS, 587 for STARTTLS) and that the password is the email **authorization code**, not the login password.
- If you get **connection refused**, the SMTP server address or port is unreachable. Verify the server IP and port are correct and the network is reachable.
- If the mail server uses a self-signed certificate and you get a **certificate verification error** (e.g. certificate signed by unknown authority), check **Skip certificate verification (self-signed)** in the channel configuration and retry.
- For DingTalk / Feishu, verify the webhook URL and secret are correct and that the bot's signing setting matches.
- For Custom Webhook, a **4xx / 5xx status code** means the request reached the platform but was rejected. The error message includes the platform's response, usually indicating the payload format or credentials do not match what it expects.
- Check the specific error message in [Notify Log](./NotifyLog.md).

**Why is my Custom Webhook URL rejected as "not allowed"?**

The webhook URL must use `http` / `https` and point to a **public address**. URLs pointing to `127.0.0.1`, `192.168.x.x`, `10.x.x.x` or redirecting to a private address are rejected.

**Why does saving report that a variable does not exist?**

The body template can only use these seven variables: `{{.Title}}`, `{{.Content}}`, `{{.Time}}`, `{{.MessageType}}`, `{{.MessageTypeName}}`, `{{.Severity}}`, `{{.ServerName}}`. Detail variables such as domain, attacker IP and rule info belong to the **message template** in [Notify Subscription](./NotifySubscription.md); they are rendered into `{{.Content}}`.

**Why am I not receiving notifications after configuring a channel?**

Configuring a channel alone is not enough. You must also subscribe the relevant message types to this channel in [Notify Subscription](./NotifySubscription.md).
