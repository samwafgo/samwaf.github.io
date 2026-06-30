# Parameter Settings

Parameter Settings centrally manage SamWaf's **own management console** security and access configuration. They map to the related items in `conf/config.yml` and can be edited and saved from the UI.

> Menu path: System Settings → Parameter Settings

<!-- Image: Parameter Settings page -->

## 1 Management IP Whitelist

Restrict the source IPs allowed to access the SamWaf console. CIDR is supported. Click **Save** to apply.

::: warning
A wrong whitelist can lock you out of the console. To recover, edit `security.ip_whitelist` in `conf/config.yml` (e.g. set it to `0.0.0.0/0,::/0`) and restart — see the [FAQ](../../faq/).
:::

## 2 Domain Whitelist

Restrict which domains can access the console. Click **Save** to apply.

## 3 Management SSL

Enable HTTPS access for the console.

- **Enable SSL**: the console supports HTTPS once enabled.
- **Force HTTPS**: the console only allows HTTPS access.
- **Certificate status**: shows whether a certificate is uploaded, plus its domain and expiry time.
- **Certificate / Private key**: paste the PEM certificate and key; or click **Select from certificate folder** to copy in one step, or **Upload certificate** to save.
- **Bind certificate-folder certificate**: once bound, it auto-syncs — when the certificate in the folder is updated, the console certificate follows. You can unbind at any time.
- **Restart Manager**: after changing SSL-related settings, click **Restart Manager** to apply.

<!-- Image: Management SSL configuration -->

## 4 Security Entry Path

Add a "security code" prefix path to the console to hide the admin entry. Once enabled, every access must include the prefix: `http(s)://host:port/{code}/...`.

::: warning
The security path applies to all requests of the entire HTTP server, so it affects **more than the admin UI** — the WebSocket (`/api/v1/ws`), the Open Platform API, and any `/api/v1/...` call must all use the prefixed URL.
:::

- Turn on **Enable** and enter a custom code; if the custom code is left empty when saving, the backend generates an 18-character random code.
- After saving, the page shows the full access URL, which you can **Copy URL**, **Open**, or **Regenerate**.

<!-- Image: Security entry path -->

## 5 Notification Title Prefix

Set a prefix for notification message titles, to distinguish the source among alerts from multiple SamWaf nodes. Click **Save** after editing.
