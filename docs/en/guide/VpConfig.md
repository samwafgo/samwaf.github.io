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

### 3.1 Getting a certificate for the console

The console is different from a protected site: it is usually **not exposed to the internet**, so file validation (HTTP-01) is not an option — that method requires Let's Encrypt to reach your port 80 from the public internet.

**If you have a domain, use DNS validation (DNS-01).** Validation only touches DNS records, so it needs **no port 80 and no public exposure of the console**.

Supported DNS providers: Alibaba Cloud, Huawei Cloud, Tencent Cloud, Cloudflare, Baidu Cloud.

Steps:

1. Go to **SSL Certificates → Automatic certificate request → New**, choose **DNS validation** as the request method, and fill in the domain for the console plus the applicant email;
2. Once issued, come back to this page and use **Bind certificate-folder certificate** to select it;
3. Click **Restart Manager** to apply.

After binding you get **automatic renewal and automatic refresh**: the certificate in the folder renews 30 days before expiry and the console certificate follows. This is why binding is easier than pasting the certificate content — the latter has to be pasted again after every renewal.

::: tip The domain does not need to resolve publicly
DNS-01 validates that you control the DNS records for the domain, regardless of which IP it points to. Pointing the domain at an internal address such as `192.168.x.x` works fine and still gets a certificate issued.
:::

::: warning No domain at all
If you only have an IP address and not even an internal domain name, DNS-01 cannot be used. See the next section on local certificates.
:::



### 3.2 Local certificate (when you have no domain)

If you only have an IP address — or you have a domain but do not want to go through ACME — SamWaf can generate a long-lived CA on this machine and use it to sign the console certificate.

::: warning One thing to be clear about
A local certificate gives **exactly the same encryption strength as a public one** — TLS strength has nothing to do with who signed the certificate. The only difference is that browsers do not know this CA by default, so you import the root CA once on **the computer you browse from**. After that it is a normal green padlock.
:::

#### Steps

1. Turn on **Enable SSL** in the **Management SSL** card;
2. In **Local certificate**, enter **every address you actually use to reach the console**, comma separated. For example:

   ```
   192.168.1.10,waf.internal,localhost,127.0.0.1
   ```

3. Click **Generate local certificate**;
4. Click **Download root CA** to get `samwaf-local-ca.crt` and import it on the computers you browse from (next section);
5. Click **Restart Manager** to apply.

::: danger Do not leave any access address out
Modern browsers only look at the SAN list in the certificate; they **ignore** the CommonName. Every address you use to reach the console must appear in the field above, otherwise that address will fail with a certificate error. Common misses: entering only the domain while habitually browsing by IP, or entering only the internal IP after having reached it once over a public IP. Listing extra addresses does no harm; leaving one out does.
:::

#### Importing the root CA

**Windows** (the store location is the step people get wrong - follow all three):

1. Double-click `samwaf-local-ca.crt` → **Install Certificate** → store location **Local Machine** (Current User works if it is only for you).
2. **The key step**: choose "**Place all certificates in the following store**". Do **not** leave "Automatically select the certificate store based on the type of certificate" selected - that puts it under *Personal*, where it has no effect.
3. Click **Browse** → select "**Trusted Root Certification Authorities**" → OK → Next → Finish, and confirm the security warning with **Yes**.

**Restart the browser** afterwards: Chrome and Edge only read the system trust store at startup, so without a restart they keep showing "Not secure".

**macOS**: double-click to import into the **login** or **System** keychain in Keychain Access → find `SamWaf Local CA`, double-click → expand **Trust** → set "When using this certificate" to **Always Trust**. Restart the browser.

**Linux (Debian/Ubuntu)**:
```bash
sudo cp samwaf-local-ca.crt /usr/local/share/ca-certificates/samwaf-local-ca.crt
sudo update-ca-certificates
```

**Linux (RHEL/CentOS)**:
```bash
sudo cp samwaf-local-ca.crt /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust
```

**Firefox** keeps its own trust store and does not read the system one, so import separately: Settings → Privacy & Security → Certificates → View Certificates → **Authorities** tab → Import → tick "Trust this CA to identify websites".

#### Renewal

- The certificate is **reissued automatically** when fewer than **30 days** remain; the card always shows the days left;
- You can also click **Reissue / renew** at any time (use the same button after changing the access addresses);
- **The CA does not change, so computers that already imported the root CA never need to import it again.** This is precisely why a two-level "CA + server certificate" design is used instead of a single self-signed certificate.

::: tip Why not a 10-year validity
The CA itself lasts 10 years, but the server certificate **cannot exceed 825 days** — a hard limit Apple platforms impose on TLS certificates from any CA; beyond it Safari and iOS reject the certificate outright. Hence the long-lived CA plus a short-lived, auto-renewing certificate.
:::

#### Working out which root CA to delete

The **Local certificate** section shows the SHA-256 **fingerprint** of the current root CA.

This matters once you have rebuilt the root CA: the trust store then holds **several entries all named `SamWaf Local CA`**, and only the fingerprint tells them apart. The one whose fingerprint **matches the page** is in use (deleting it brings the "Not secure" warning back); any entry with a different fingerprint is left over from before the rebuild and is safe to delete.

#### Removing the root CA

**Windows**: press `Win+R` and run `certlm.msc` (use `certmgr.msc` if you installed it for the current user) → expand **Trusted Root Certification Authorities → Certificates** → find `SamWaf Local CA` → double-click to check the fingerprint → right-click and delete.

**macOS**: open **Keychain Access** → search for `SamWaf` in the System or login keychain → double-click to check the fingerprint → right-click and **Delete**.

**Linux**:
```bash
# Debian / Ubuntu
sudo rm /usr/local/share/ca-certificates/samwaf-local-ca.crt
sudo update-ca-certificates --fresh

# RHEL / CentOS
sudo rm /etc/pki/ca-trust/source/anchors/samwaf-local-ca.crt
sudo update-ca-trust
```

**Firefox**: Settings → Privacy & Security → Certificates → View Certificates → **Authorities** → select `SamWaf Local CA` → Delete or Distrust.

#### Rebuilding the root CA (the equivalent of revocation)

A self-managed CA has no revocation service (CRL/OCSP), so there is **no true revocation**. If the root CA private key may have leaked, or you simply want a different one, the answer is to switch to a new CA:

**Local certificate → expand Destructive actions → Rebuild root CA**.

::: danger This is destructive
The new root CA has no relationship to the old one. **Every computer that imported the old root CA will immediately mark the console as insecure** and must delete the old entry and import the new one using the steps above. A restart of the manager is required as well.
:::

#### Removing the local certificate

If you no longer want to use a local certificate (for example you switched to a public one), use **Local certificate → expand Destructive actions → Remove local certificate**. This deletes the local root CA and the console certificate it signed.

Two notes:

- If the console is **currently using** the local certificate, the request is refused - turn off SSL or switch to another certificate source first, otherwise the console would find no certificate to load after a restart;
- Only certificates issued by the local CA are touched. Manually uploaded certificates and certificates bound from the certificate folder **are never deleted by mistake**.

After removing it, remember to delete the root CA on the computers that imported it as well (same steps as above).


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
- **② Manual Trusted Proxies**: for cases the CDN central store can't cover (e.g. a self-hosted Nginx / internal load balancer behind the CDN). CIDR or IP, comma-separated, e.g. `10.0.0.0/8,192.168.0.0/16`. **Empty = no manual entry** (the referenced CDN vendor above still applies). You can also use the keyword `private`, which is equivalent to `10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.0/8,::1,fc00::/7` and may be mixed with specific ranges.

Leave the other one empty if you only need one of them.

::: warning
Manual ranges are stored in `conf/config.yml`. If this locks you out through the IP whitelist, edit that file and restart to recover.
:::

<!-- Image: Management trusted proxies (proxy-header switch + Reference CDN + manual CIDRs) -->

### 6.3 What to enter for common deployments

| Deployment | Proxy header | Manual trusted proxies |
|---|---|---|
| Console exposed directly, no proxy in front | empty (master switch off) | not needed |
| Docker / K8s (host port mapped into the container) | whatever the upstream actually sets | `private` |
| Self-hosted Nginx (same machine or same intranet) | `X-Forwarded-For` or `X-Real-IP` | the Nginx address, e.g. `10.0.0.5`; `private` works on an intranet |
| Behind a CDN (Cloudflare etc.) | that vendor's real IP header, e.g. `CF-Connecting-IP` | leave empty, use ① Reference CDN instead |
| A self-hosted Nginx behind a CDN | the header written by the hop closest to the console | the Nginx address (use ① and ② together) |

::: danger Do not enter `0.0.0.0/0`
Ranges that cover everything (`0.0.0.0/0`, `::/0`, and splitting the internet in two with `0.0.0.0/1` + `128.0.0.0/1`) **cannot tell which address in a proxy header is the client** - the range contains the real client as well, so there is no way to separate "this is a proxy hop" from "this is the client".

With such a configuration SamWaf does not honour the proxy header and identifies the client by the network-layer address instead (the gateway address in a container, so every visit looks like it comes from the same IP, which also costs the IP allowlist and the login failure lockout their ability to tell anyone apart). The page marks it in red and the startup log carries a warning.

**What to do instead**: enter the upstream proxy's own address, or simply `private` for container and intranet deployments.
:::

### 6.4 Check this request

With the master switch on, the card offers a **Check this request** button for verifying that the configuration behaves as intended. It shows how the current request was resolved:

- **Direct peer**: the address seen at the TCP layer, whether it counts as a trusted proxy, and which entry it matched (`cidr:10.0.0.0/8` / `private:...` / `ip:...` / `cdn:cloudflare`)
- **Per-hop verdict**: the raw value of each configured header and whether each address in it is a trusted proxy or not
- The **resolved** client IP and the **reason** behind it

Click it right after saving a change - quicker than digging through the log. It only echoes information about your own request, takes no parameters, and is visible to **system administrators** only.

## 7 CORS Allow Origins

Controls which origins may access the management API cross-origin (CORS), preventing arbitrary sites from making credentialed cross-origin requests.

- **Effect**: loopback / local origins (`127.0.0.1`, `localhost`) are always allowed, so local access and local development need no setup; only add **remotely-deployed** frontend origins here. **Empty = loopback only**.
- **Value**: origins, comma-separated, e.g. `https://waf.example.com,http://192.168.1.10:8080`.
- Same-origin access (frontend on the same host and port as the console) is not cross-origin and needs no setup.

::: warning
Stored in `conf/config.yml`. If a wrong CORS config locks out a remote frontend, edit the file and restart to recover.
:::

<!-- Image: CORS allow origins -->
