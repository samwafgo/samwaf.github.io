 
# Website Configuration

## 1 Deployment Architecture:
Please layout the SamWaf firewall according to the architecture below.

### 1.1 Deployed on the Same Server (Common)
::: important
Important: Deploying on the same server may encounter situations where ports 80 and 443 are already in use. Please perform operations when the machine or website business is not busy. [Modify and view common issues](../faq/readme.md#_1-端口80-被占用情况)

:::

```mermaid
---
title: Deployed on the Same Server
---
flowchart TB
    A[Client Browser]
	B(SamWaf)
	C(Web Server)
	A --> B  
	B --> A
	subgraph Server1
    B --> C
    C --> B
    end
```

### 1.2 Deployed on Different Servers
This deployment method is suitable for servers with abundant resources, allowing SamWaf to be deployed separately, and the domain name should be resolved to the server where SamWaf is located. Other website servers can then be connected, exposing only the server where SamWaf is located.

```mermaid
---
title: Deployed on Different Servers
---
flowchart TB
    A[Client Browser]
	B(SamWaf)
	C(Web Server)
	A --> B  
	subgraph Server1
    B 
    end  
	B --> C
	subgraph Server2 
    C
    end
	C --> B
	B --> A 
```

## 2 Adding Websites Protected by the Firewall:

Key configuration; set it up once for future use.

### 2.1 Add Website
![Add a website protected by SamWaf firewall](/images/add_host.png)
- Website:
    - Enter the website domain name correctly, avoiding prefixes like https, http, or suffixes like /.
    
	For example: www.baidu.com, pan.baidu.com
	
- Port:
    - Enter the port of the website that needs protection.
	http is 80 and https is 443. (If you have already installed Baota, Nginx, IIS, etc., you need to manually change the port to a non-80 or non-443 port.) [Modify and view common issues](../faq/readme.md#_1-端口80-被占用情况) 
- Encryption Certificate:
    1. If it's https, you need to select an encryption certificate. The 80 port does not require one.
	You need to click "Add New Certificate" to add a new certificate.
	
	![Add SSL Certificate](/images/add_ssl.png)
	```
	Typical filename: *.key Content format: -----BEGIN RSA PRIVATE KEY----- ... Copy and paste all the contents here.
	```
	- Certificate String
	```
	Typical filename: *.crt Content format: -----BEGIN CERTIFICATE----- ... Copy and paste all the contents here.
	```
	
	2. Select the corresponding certificate from the certificate folder.

     ![Select Certificate](/images/add_host_select_ssl.png)
	
- Startup Status:
	Automatic startup: After adding, it normally provides services; manual startup: after adding, it will not occupy ports and will not provide services.

- Strict Source Port:
    The strict source port is enabled by default. If disabled, it is suitable for outer Nginx or CDN situations.
	
- Backend System Type and Backend Application Type:
     Not necessary; you can select the actual type or keep the default (adaptations may be made for different backend access later).

- Backend Domain:
     Defaults to the same as the primary domain (requires http/https protocol prefix). Exception: If the frontend domain and backend domain configured in samwaf differ, you must enable the "Pass Backend Domain" option to ensure proper access.
	  
- Backend IP:
     If SamWaf and the website are on the same server, fill in 127.0.0.1. If on different servers, please fill in the actual IP.	
- Backend Port:
     Situation 1: If SamWaf and the website are on the same server, then the port needs to be changed to something like 81 or other ports. Situation 2: If they are on different servers, you can keep the original port.
	
## 3 Load Balancing:
Load balancing supports: Weighted Round Robin (WRR), IP Hash.
 
- Weighted Round Robin (WRR): Distributes requests to different servers in order based on the weights of the backend servers. Servers with higher weights are polled more frequently (higher probability).

- IP Hash: Uses the source IP address of the request to find the corresponding server from a hash table, ensuring that the same IP always accesses the same server.

### 3.1 Load Balancing Configuration
Click on the protected website to enable "Load Balancing."

![Load Balancing List](/images/loadbalanceindex.png).

### 3.2 Add Backend Load
![Load Configuration](/images/loadbalance_edit.png).

- IP: Enter the backend IP that can be accessed.
- Port: Enter the backend port that can be accessed.
- Weight: Enter the weight; for the Weighted Round Robin (WRR) mode, this increases the chance of customer access to that server.

## 4 Website Password Access  
Supported since v1.3.9-beta.11 , Add or edit the last tab for website password access.  
Website password access is disabled by default and can be enabled manually.
### 4.1 Website Password Access List

![Website Password Access List](/images/password_visit.png)

Here, you can view, add, edit, or delete.

The effect is as follows:

![Website Password Access Effect](/images/password_visit2.png)

## 5. Other Configurations  

### 5.1 Exclude URLs When Logging  

Enter one URL per line.

### 5.2 Access Timeout Settings  

Supported since v1.3.9-beta.13, Default is 60 seconds. Unit: seconds. If set to 0, there is no limit.  

![Access Timeout Settings](/images/response_timeout.png)   

Here is the translation:

## 6. Export and Import  
### 6.1 Export  
The export function allows you to export all host information. If this is your first time, it can be used as the template for initialization imports.

### 6.2 Import  
There are two options for importing host information:
- Import new host codes (for new data)
- Import retained host codes (for old data)  
![Import Parameters](/images/import_host.png)

PS: SamWaf is lightweight. For migrating old data, we recommend shutting down the service and directly copying all the data from the directories to the new server.
  
## 7. Bind Multiple Domains Simultaneously

Multiple domains can be supported, one per line. Wildcard domains are also supported.

![Bind Multiple Domains Simultaneously](/images/bind_more_domain.png) 

## 8. Health Check
The system performs health checks every 5 seconds. Invalid connections will be removed when load balancing is configured.

### 8.1 Custom Configuration
![Custom Configuration](/images/healthy_config.png)

- Enable Health Check (manually configurable)
- Detection Methods: GET/HEAD (confirm backend supports HEAD)
- Check Path: Default root directory /
- Expected Status Code: 200 (customizable HTTP response codes)
- Response Timeout: 5 seconds
- Consecutive Failure Threshold: 3
- Consecutive Success Threshold: 3

### 8.2 Health Status Display
![Status Display](/images/healthy_loadbalance.png)

## 9 Website List Page

After opening the "Website Configuration" page, you can see the list of all protected websites and a set of management actions.

### 9.1 Toolbar Buttons

| Button | Description |
| --- | --- |
| New Protection | Opens the add-website form to add a protected site |
| Export Data | Exports all website information to Excel (can be used as an import template, see Section 6) |
| Import Data | Imports website information from Excel, supporting two strategies: "import new host codes" / "import retained host codes" (see Section 6) |
| Batch Protection Switch | Changes the protection status of all sites at once; choose `Protected` or `Unprotected` (a second confirmation appears) |
| Batch Copy Configuration | Copies selected configuration modules from a source site to multiple target sites (see 9.4) |

The top-right area supports filtering by **Website** and clicking **Search**; the website, main port, backend IP, backend port, and remarks columns also support in-column input filtering.

<!-- Image: Website list -->

### 9.2 List Display

Each row shows: Website (with nickname, SSL tag, bound multi-domains/multi-ports), Main Port, Stats, Status, Backend IP, Backend Port, Remarks, Create Time, and Operation.

The **Stats** column shows in real time: PV, UV, Blocked (today's attacks), Inbound/Outbound traffic, QPS, and Connections.

The **Status** column contains several switches and tags:

| Item | Description |
| --- | --- |
| Health Status | Backend health (shows normal/abnormal when health check is enabled) |
| Guard Status | Protection toggle, `Protected` / `Unprotected`; a confirmation appears when toggled |
| Start Status | Startup toggle, `Auto Start` / `Manual Start`; a confirmation appears when toggled |
| Static Service | Shows an "On" tag if the static website feature is enabled |
| Strict Source Port | Shows a tag if strict source port is disabled |

### 9.3 Row Actions

The **Operation** column of each row provides: **Copy** (quickly create a new site based on this one; SSL and bindings are cleared), **Edit**, **Delete** (after deletion the site info and rules are cleared and cannot be recovered), and **SSL Auto Apply**.

> Note: The global website can only have its guard status configured — it cannot be copied, edited, deleted, or issued certificates.

### 9.4 Batch Copy Configuration

After clicking **Batch Copy Configuration**:

1. Select the **Source Site** (an already configured site).
2. Tick the **Copy Modules**; currently supported: Cache Configuration, Response compression.
3. In the **Target Sites** list, tick one or more sites (Select All is available); the source site is automatically excluded.
4. Click **One-Click Copy**. The dialog shows the copy progress and reports success on completion.

<!-- Image: Batch copy config dialog -->

## 10 Built-in Engine Protection

In the "Engine Protection" tab of the add/edit website form, you can toggle the built-in detections per site:

| Detection | Description |
| --- | --- |
| Bot Detection | Detects whether search engines are spoofed |
| SQL Injection Detection | Detects SQL injection |
| XSS Detection | Detects XSS attacks |
| Scanner Detection | Detects scanning tools |
| RCE Detection | Remote code execution detection |
| Sensitive Word Detection | Sensitive word detection |
| Directory Traversal Detection | Directory traversal detection |
| OWASP Set Detection | OWASP rule set detection |
| AI Detection (Beta) | Detects anomalous requests with a machine-learning model; requires uploading a model package and enabling the global AI switch first. Use observation mode to verify false positives before switching to blocking. |

### 10.1 Log-only Mode

When "Log-only Mode" is enabled, SamWaf records attack logs but does not block attack requests — useful for observing false positives early after going live.

### 10.2 IP Extraction Mode

Selects how the client IP is extracted from a request; this setting applies to all features such as CC protection, CAPTCHA, and IP whitelist:

- **NIC Mode**: gets the client IP directly from the network connection (for direct-connection scenarios).
- **Proxy Mode**: gets the real IP from HTTP headers (X-Forwarded-For, etc.) (for scenarios using CDN, Nginx, and other proxies).

## 11 Cookie Security

Configured on the **Cookie Security** tab of the website edit page. When enabled, SamWaf hardens the `Set-Cookie` headers returned by the backend on the response path — **add-if-missing only, never overriding values the application already set** — and preserves all original cookie content (Path / Domain / Max-Age / Expires, etc.). Over HTTP, Secure is not auto-added to avoid breaking cookies.

<!-- Image: "Cookie Security" tab on the website edit page -->

### 11.1 Steps

1. Edit the website and switch to the **Cookie Security** tab.
2. Turn on **Enable cookie security** (click **Recommended** to fill in suggested values in one click).
3. Set HttpOnly / Secure / SameSite / Excluded cookie names as needed.
4. Save the website configuration to apply.

### 11.2 Field Reference

| Field | Description |
| --- | --- |
| Enable cookie security | Off / On. Set-Cookie is processed only when on. |
| HttpOnly | Leave as-is / Add if missing. Appends HttpOnly when absent to prevent scripts from reading the cookie (mitigates XSS session theft). |
| Secure | Leave as-is / Force add / Auto-add on HTTPS only. Adding Secure over HTTP breaks the cookie, so "Auto-add on HTTPS only" appends it just when the current request is HTTPS. |
| SameSite | Leave as-is / Lax / Strict / None. Choosing None also adds Secure (browsers require Secure for SameSite=None). |
| Excluded cookie names | Matched cookies are left untouched (comma-separated). Useful for third-party / SSO cookies that need cross-site behavior, e.g. `_ga,sso_token`. |

> Recommended policy: On + HttpOnly "Add if missing" + Secure "Auto-add on HTTPS only" + SameSite=Lax.

## 12 CSRF Protection

Configured on the **CSRF Protection** tab of the website edit page. When enabled, SamWaf validates the `Origin` / `Referer` of **state-changing requests** (POST / PUT / DELETE / PATCH, etc.) against this site; if the source is not this site, the request is treated as Cross-Site Request Forgery (CSRF) and blocked. This runs entirely on the WAF side and is transparent — no backend changes are required, and safe methods like GET / HEAD are never checked.

`Origin` is used first (more reliable); when a request has no `Origin`, `Referer` is used instead. This site's domain and any domains listed under "Bind Multiple Domains" are automatically trusted.

::: tip Prerequisite
CSRF protection is part of the request inspection chain and only takes effect when the website's **protection is enabled** (protection shown as on in the website list). If "Log-only mode" is on for the website, matches are only logged and not actually blocked.
:::

<!-- Image: "CSRF Protection" tab on the website edit page -->

### 12.1 Steps

1. Edit the website and switch to the **CSRF Protection** tab.
2. Turn on **Enable CSRF protection** (click **Recommended** to fill in suggested values in one click).
3. Check the protected methods, fill in extra allowed origins, and set the no-origin-header behavior and excluded paths as needed.
4. Save the website configuration to apply.

> You can also toggle **CSRF Protection** and **Cookie Security** on/off directly from the overview on the **Protection** tab, then click **Configure** to jump to the corresponding tab for details.

### 12.2 Field Reference

| Field | Description |
| --- | --- |
| Enable CSRF protection | Off / On. Origin validation runs only when on. |
| Protected Methods | Only the checked methods (POST / PUT / DELETE / PATCH) are origin-validated; safe methods (GET / HEAD / OPTIONS) are skipped. |
| Extra Allowed Origins | This site's domain and bound domains are allowed automatically; add extra trusted origins here. One per line, supports `host`, `scheme://host`, or wildcard `*.example.com`. |
| When No Origin/Referer | How to handle requests with neither Origin nor Referer: Allow (default) / Block. Native apps, curl, and server-to-server calls often have no such headers, so Allow avoids false blocks; switch to Block for stricter policy. |
| Excluded Path Prefixes | Paths matching a prefix skip CSRF checks, one per line. Good for webhooks, callbacks, and token-authenticated APIs that have no browser origin headers, e.g. `/api/webhook`. |

> Recommended policy: On + protect POST/PUT/DELETE/PATCH + Allow when no origin header, and configure excluded paths for API / webhook endpoints.

## 13 Web Page Anti-Tampering

Configured on the "Web Page Anti-Tampering" tab of the website edit page. Once enabled, SamWaf learns a "correct page" baseline (content hash + body) for the static URLs you specify, then compares the hash of every response for those URLs. If a page is tampered with (origin compromised, files modified), SamWaf serves the learned correct copy back to the visitor, raises an alert, and logs an attack record.

It uses **reverse-proxy response baseline comparison**, so SamWaf does not need to be on the same machine as the site files — a remote backend is protected too; and there is no extra origin fetch, since the proxy already forwards to the backend and anti-tampering just compares the hash once on the way back. Both egress paths are covered: reverse proxy, and SamWaf's own static serving (static site service / path-routing static files).

::: tip Prerequisite
Web page anti-tampering is part of the response handling chain and only takes effect when the website's **defense is enabled**. If the website has "Log-only mode" on, a hit is only logged and not actually replaced. Pages whose baseline body exceeds the "Baseline Size Cap" are neither learned nor protected.
:::

::: warning Only for byte-stable static assets
A byte-for-byte hash baseline only suits assets that return identical content every time: truly static `.html` / `.js` / `.css` / images, etc. If the page body embeds content that **changes on every request** (real-time timestamps, CSRF tokens, random numbers, etc.), it will be misjudged as tampered — do not protect such dynamic pages (or use "Alert only" first to observe).
:::

<!-- Image: "Web Page Anti-Tampering" tab on the website edit page -->

### 13.1 Steps

1. Edit the website and switch to the "Web Page Anti-Tampering" tab.
2. Turn "Enable Web Page Anti-Tampering" on (click "Recommended" to fill in suggested values: On + Serve correct copy + 1MB cap).
3. **Save the website first** (protected URL rules are stored per website and require the website to exist).
4. Back on the "Web Page Anti-Tampering" tab, under "Protected URLs" click "Add Protected URL" and enter an exact path (e.g. `/index.html`, `/app.js`, `/logo.png`).
5. After saving, the **baseline is learned automatically on the first visit** to that URL, and the status changes from "Pending" to "Learned".

> You can also toggle "Web Page Anti-Tampering" on/off directly in the overview on the "Defense" tab, and click "Configure" to jump to this tab.

### 13.2 Extract Protected URLs from a Page in Bulk

When adding URLs one by one is tedious, use "Extract from Page" to discover them automatically:

1. Above "Protected URLs" click "Extract from Page".
2. Pick the "Domain" (the dropdown lists the site's primary domain plus its bound extra domains), then enter a page path (default `/`).
3. Click "Extract" — SamWaf fetches this page via the website's configured backend and parses the **same-site** js / css / html / images referenced by the page, listed with type tags.
4. All candidates are selected by default; adjust as needed, tick "Ignore URL Params" if desired, and click "Add Selected" to create rules in bulk (existing ones are skipped automatically).

::: tip Fetches this site only, no external address
Extraction only fetches via the website's configured backend (the same backend it normally proxies to); it never visits any external address you type, and only lists same-site resources — third-party CDN references on the page are dropped automatically.
:::

### 13.3 Relearning and Bulk Actions

- **Relearn**: after you **legitimately update a page**, its content changes and would be flagged as tampered; click "Relearn" on that row — SamWaf immediately re-fetches the URL from the backend and rebuilds the baseline on the spot (for a website with no backend configured, it falls back to "relearn on next visit").
- **Relearn Selected / Relearn All**: relearn multiple selected rows in bulk, or relearn all protected URLs of the site at once (handy after a release).
- **Delete Selected**: delete multiple selected rows at once.
- **View Baseline**: inspect the current baseline's content type / size / hash / learned time; text can be expanded and images previewed, and you can "Download Baseline" to verify.
- The protected URL list supports **sorting and filtering** by each column (URL, rule name, enabled, baseline status, etc.).

### 13.4 Field Reference

**Site-level configuration**

| Field | Description |
| --- | --- |
| Enable Web Page Anti-Tampering | Off / On. Only when on are protected URLs learned and compared. |
| On Detection | Serve correct copy (recommended) / Alert only (monitor). "Serve correct copy" returns the baseline correct copy to the visitor on mismatch and alerts + logs an attack; "Alert only" merely alerts and still serves the backend page — good for observing early after go-live. |
| Baseline Size Cap (KB) | Pages larger than this are neither learned nor protected; default 1024 (1MB). Key static pages are usually tens of KB. |

**Protected URL rules**

| Field | Description |
| --- | --- |
| Protected URL | Exact path match, e.g. `/index.html`, `/app.js`; wildcards `/*`, directories and query params are not supported. |
| Rule Name / Remarks | Optional name and note for easy identification. |
| Enabled | Disable / enable this rule. |
| Ignore URL Params | On (default): match by path and compare regardless of cache-busting params like `?v=timestamp` (recommended for static assets); Off: requests with a query are passed through without comparison (for pages whose content varies by params). |
| Baseline Status | Pending / Learned / Over Limit. |
| Size / Hits | Baseline body size / cumulative tamper hit count. |

> Recommended policy: On + On Detection "Serve correct copy" + 1MB cap; only add truly byte-stable static assets as protected URLs.

::: warning Does not scan server files
This feature protects against "the content of a protected page being changed"; it does not scan the server file system or detect newly added files (such as an uploaded webshell) — that is the domain of host-based file anti-tampering.
:::

## 14 File Upload Inspection

Configured on the "Upload Inspection" tab of the website edit page. Once enabled, SamWaf inspects `multipart/form-data` file uploads and blocks dangerous files. Four inspection dimensions can be toggled independently: **dangerous extension blacklist**, **webshell content signatures**, **declared-type vs real-content mismatch**, and **per-file size limit**.

Only file-upload requests are inspected (zero overhead otherwise); only file fields (those with a filename) are processed, while ordinary form fields are covered by SQL injection / XSS detection. After reading the upload content the request is passed intact to the backend, so legitimate files are unaffected.

::: tip Prerequisite
Upload inspection requires the site's **Defense to be on**. Under "Log-only mode" a hit is logged but not actually blocked. It is **off by default**, and blocks when enabled — existing sites are unaffected.
:::

<!-- Image: "Upload Inspection" tab on the website edit page -->

### 14.1 Steps

1. Edit the website and switch to the "Upload Inspection" tab.
2. Set "Enable Upload Inspection" to on (click "Recommended" to fill in: all four dimensions on + built-in default blacklist + 10MB cap + block over-limit).
3. Adjust the dimension toggles, extension blacklist, size limit, and inspect/exclude paths as needed.
4. Save the website.

> You can also toggle "Upload Inspection" directly in the overview table on the "Defense" tab, and click "Details" to jump to this tab. When enabling from the overview while all four dimensions are currently off, the recommended policy (all four on) is applied automatically, so you never end up with "the master switch on but nothing inspected".

### 14.2 Field Reference

| Field | Description |
| --- | --- |
| Enable Upload Inspection | Off / On. Uploads are inspected only when on. |
| Extension Blacklist | On / Off. Uploads whose extension hits the blacklist are blocked. **All** extension segments of the filename are checked (defeats double-extension `shell.php.jpg`) and null-byte bypass is handled. |
| Dangerous Extension Blacklist | Comma-separated, e.g. `php,jsp,asp,exe`; empty = built-in default blacklist (php/jsp/asp/exe/sh/bat and other executable/script suffixes). Shown only when "Extension Blacklist" is on. |
| Webshell Content Signatures | On / Off. Scans the file head for webshell signatures (PHP/JSP/ASP script markers combined with dangerous calls such as `eval`/`system`/`Runtime.exec`) and blocks on hit. A lone `eval` in minified JS won't false-positive. |
| Real Type Check | On / Off. Sniffs the real file type: blocks when a file claims to be an image but the content is actually a script / HTML (renamed extension + spoofed Content-Type). |
| Per-file Size Limit | On / Off. Blocks a single file exceeding the size limit. |
| Size Limit (KB) | Per-file size limit, also the inspectable buffer cap for the request body. Default 10240 (10MB). |
| Over-limit Action | Block (recommended) / Pass without inspection. What to do when the upload body exceeds the inspectable limit. Default "Block" prevents padding a malicious file over the limit to bypass content inspection; sites with legitimate large uploads can raise the limit or choose "Pass without inspection". |
| Inspect Paths Only | One path prefix per line; empty = inspect all uploads. When non-empty, only uploads matching these prefixes are inspected. |
| Excluded Paths | One path prefix per line; matches skip inspection. **Takes priority over "Inspect Paths Only"**. Good for trusted internal upload endpoints. |

> Recommended policy: all four dimensions on + built-in default blacklist + 10MB cap + block over-limit.

::: warning Inspection scope
Only `multipart/form-data` uploads are inspected; non-standard uploads such as base64 embedded in JSON are out of scope. Webshell content only scans the head of each file (first 64KB), which is sufficient for one-liner shells / signatures identifiable at the head.
:::
