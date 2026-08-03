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

## 6 Management Trusted Proxies

When the SamWaf console runs behind a reverse proxy (e.g. Nginx) or a CDN, this tells SamWaf which direct sources are trusted proxies so it can identify the real client IP correctly. **The admin IP whitelist / login lockout / token IP binding are all judged by the identified IP.**

There is a master switch **Admin behind proxy/CDN** at the top:

- **Off**: always judge by the direct network-layer IP (keep off when the console is NOT behind a proxy/CDN — safest). The fields below are hidden.
- **On**: identify the real client IP from proxy headers and reveal the config below. The switch reflects whether the proxy header has a value — non-empty means on.

Once on, you configure "which header to read" and "which sources to trust":

### 6.1 Management Proxy Header

Comma-separated request headers by priority, e.g. `X-Forwarded-For,X-Real-IP,CF-Connecting-IP`. **Empty = don't parse proxy headers, use the network-layer IP.** Quick-fill tags below the input append common headers (Cloudflare/Fastly/AWS CloudFront/EdgeOne/Aliyun/Akamai real-IP headers); you can still edit manually.

> This is the `gwaf_manage_proxy_header` parameter from Settings; changes here take effect immediately. It differs from the visitor IP header (`gwaf_proxy_header`), which applies to business sites.

### 6.2 Trusted sources (① Reference CDN ∪ ② Manual CIDRs, combined)

Only when the management request's direct source is a trusted proxy does SamWaf trust the real client IP from the header above; otherwise it falls back to the network-layer IP, preventing spoofing. **Trusted proxy = ① referenced CDN origin ranges ∪ ② manual CIDRs**, combined (a hit in either is trusted):

- **① Reference CDN**: if the console is also behind a CDN, selecting a vendor auto-trusts its origin ranges (reads the latest central value, auto-updated, no manual entry). Ranges are managed on the [CDN Origin IPs](./CDNIP.md) page; once selected, the vendor's central-store downloaded count is shown here.
- **② Manual Trusted Proxies**: for cases the CDN central store can't cover (e.g. a self-hosted Nginx / internal load balancer behind the CDN). CIDR or IP, comma-separated, e.g. `10.0.0.0/8,192.168.0.0/16`. **Empty = no manual entry** (the referenced CDN vendor above still applies).

When using only one, leave the other empty.

::: warning
The manual CIDRs are stored in `conf/config.yml`. If this locks you out via the IP whitelist, edit the file and restart to recover.
:::

<!-- Image: Management trusted proxies (proxy-header switch + Reference CDN + manual CIDRs) -->

## 7 CORS Allow Origins

Controls which origins may access the management API cross-origin (CORS), preventing arbitrary sites from making credentialed cross-origin requests.

- **Effect**: loopback / local origins (`127.0.0.1`, `localhost`) are always allowed, so local access and local development need no setup; only add **remotely-deployed** frontend origins here. **Empty = loopback only**.
- **Value**: origins, comma-separated, e.g. `https://waf.example.com,http://192.168.1.10:8080`.
- Same-origin access (frontend on the same host and port as the console) is not cross-origin and needs no setup.

::: warning
Stored in `conf/config.yml`. If a wrong CORS config locks out a remote frontend, edit the file and restart to recover.
:::

<!-- Image: CORS allow origins -->
