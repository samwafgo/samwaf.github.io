# Website Access Diagnostic

## Overview

When a site is misconfigured (domain/port does not match real visits, the origin's HTTPS certificate is untrusted, or the origin is unreachable), the page usually shows nothing but "cannot be opened". **Website Access Diagnostic** simulates every step of a real visit from the **SamWaf server's perspective**, shows the request/response messages and connection details of each step, and gives actionable advice when something fails.

::: warning Diagnostics vs. real visits
Diagnostics are **independent probes from the server** and take a different path than a real browser visit. "Server can reach it" does not mean "users can reach it" — DNS, CDN, NAT, port mapping and firewalls all sit in between. Each step's evidence is reported separately; judge by combining them.
:::

## Prerequisites

- Only **Super Admin** and **Security Admin** accounts can run diagnostics, via console login. System Admin, Audit Admin and OpenPlatform API Keys cannot call it.
- Only **saved websites** can be diagnosed; unsaved editor drafts are not involved.

## Steps

Open **Website Protection → Websites** and click the **Website Access Diagnostic** button in the toolbar:

1. **Select website**: pick a saved website (the dropdown supports typing to search).
2. **Fill in the actual visit URL**: the full address users really visit (scheme and port included; path and query are allowed). Ordinary sites derive the default from the main listener. For `*` or `*.example.com`, enter a concrete hostname or IP URL, such as `http://actual-domain:7822/`. The page shows an example using the site's scheme and port, but never sends that example automatically. Results show whether this address matches the selected wildcard website; conclusions apply only to that concrete address.
3. **Method and headers**: GET / HEAD only; up to 20 custom request headers (transport headers such as Host cannot be overridden). The **Follow system proxy** switch is on by default: when the server has HTTP_PROXY/HTTPS_PROXY environment variables set the probe goes through the proxy, otherwise it dials directly; turn it off to always dial directly.
4. Click **Start Diagnostic**. The four phases run in order; expand any phase for details.

### Phases

| Phase | What it checks |
|-------|----------------|
| Config & Match | Replays the visit URL against the current routing table: whether it matches the selected website and by which kind (exact / alias / wildcard subdomain / any-port / catch-all), and whether scheme/port match the site's listens; saved-vs-runtime config drift is reported here |
| Local WAF Ingress | Sends one real request to the site's own listener (it goes through auth, protection and cache normally and produces an access log), to observe ingress behavior |
| Origin | Probes each saved origin independently (fixed-IP direct dial with domain fallback, identical to the production proxy); 5 per batch by default, results shown batch by batch |
| Visit URL Probe | Accesses the filled URL from the SamWaf server (follows system proxy settings by default; can be turned off to force direct dialing) to verify connectivity, TLS and response from the server's perspective |

Each check includes: overview (logical URL / actual socket address / HTTP Host / TLS SNI listed separately), request message, response message, connection & certificate info, and advice. Advice can jump to the matching section of the website editor.

### System proxy scope

**Follow system proxy** affects only the fourth phase, **Visit URL Probe**. Local WAF ingress and origin probes always connect directly. Proxy settings come from the **SamWaf service process environment** (`HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`), independently of the administrator's browser proxy. Addresses matched by `NO_PROXY` still use direct connections. Restart SamWaf after changing the service process proxy environment.

For a wildcard website such as `*:7822`, enter `http://your-domain:7822/` or `http://server-ip:7822/`. For `*.example.com`, enter an actual subdomain in use. Replace the examples with your real address and omit wildcards. A run checks only that specific address; it does not test every matching subdomain.

## Reading the Results

- **Addresses are separated**: logical URL, actual socket address, HTTP Host and TLS SNI are four different concepts and are shown separately; the actual attempts of "fixed origin IP with domain fallback" are traceable.
- **TLS failures**: only the reason (expired certificate, hostname mismatch, untrusted chain, etc.) and guidance are shown; the diagnostic never skips verification or changes any configuration.
- **30x responses**: redirects are never followed; the response headers and Location are shown as-is.
- **Not verified**: when the site enables "Skip HTTPS certificate verification", the certificate verification result is shown as "Not Verified" and labeled accordingly.
- **Privacy**: query values, request header values, cookies/tokens, etc. are redacted before the data is returned; diagnostics never write any configuration, health state or polling data.

## FAQ

**Q: The origin phase passed, but users still cannot open the site?**

The origin phase only proves the "SamWaf → origin" segment. Between users and SamWaf there are DNS, CDN origin-pull, NAT/port mapping and firewalls. Combine the **Local WAF Ingress** and **Visit URL Probe** phases, and confirm the actual visit address from the user side.

**Q: Does diagnostics produce access logs or trigger protection rules?**

**Local WAF Ingress** and **Visit URL Probe** are real requests: they produce access logs and counters under the normal rules (a 403 from a CC rule is shown as-is). The **Origin** phase dials origins directly without passing the WAF protection.

**Q: Why does it say "configuration changed, please re-diagnose"?**

If the website configuration is saved (modified) between phases, or the runtime config no longer matches the saved config, continuing would produce misleading results, so the run stops and asks you to restart from **Config & Match**.

**Q: How many origins can be diagnosed at once?**

The origin phase probes 5 per batch by default (for load-balanced backends); remaining batches continue on **Next Batch**. Within a batch at most 2 run in parallel, and each phase has a 10-second budget.

## Update History

| Date | Version | Description |
| --- | --- | --- |
| 2026-10-26 | >v1.3.25-beta.8 | Added "Website Access Diagnostic": staged simulation of config matching, local ingress, origin and visit-URL probing, with per-stage request/response/connection/certificate evidence and actionable advice. |
| 2026-10-27 | >v1.3.25-beta.8 | Visit-URL probe gained a "Follow system proxy" switch (on by default); wildcard sites (`*` / `*.domain`) require a concrete hostname or IP URL and show the match kind; config matching now reports how the route matched. |
