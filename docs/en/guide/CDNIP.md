# CDN Origin IP

## Overview

CDN Origin IP is a central store SamWaf maintains for each CDN vendor's origin (回源) IP ranges. It keeps every vendor's origin ranges in one place, and both the site side (set **Real-IP Source = CDN preset** in the host configuration) and the management side automatically reference the latest values from this central store — no manual syncing required.

> CDN origin IP ranges are managed here centrally; sites (Real-IP Source = CDN preset) and the management side both reference the latest values. Built-in vendors do not auto-fetch by default — enable auto-fetch here when a site/management references one (enabling triggers one fetch). Authenticated vendors (EdgeOne/Aliyun) need credentials first.

Built-in vendors **do not fetch from the internet by default**. Only when a vendor is referenced by a site or the management side should you enable that vendor's **Auto Fetch** on this page; enabling it triggers one immediate fetch.

<!-- Image: CDN Origin IP list page -->

### Vendor types (Tier)

Each vendor falls into one of three types by how its origin ranges are obtained, shown as a tag in the list:

| Type tag | Description | Built-in vendors |
| --- | --- | --- |
| Public List | Official public origin ranges, fetched anonymously. | Cloudflare, Fastly, AWS CloudFront |
| Auth API | No anonymous public list; requires credentials first, fetched via an authenticated API. | Tencent EdgeOne, Aliyun CDN/DCDN |
| Header Only | No public origin ranges; only the real-IP header is trusted / entered manually, never auto-fetched. | Akamai |

Built-in vendors and their real-IP headers:

| Vendor | Real-IP Header | Type |
| --- | --- | --- |
| Cloudflare | `CF-Connecting-IP` | Public List |
| Fastly | `Fastly-Client-IP` | Public List |
| AWS CloudFront | `CloudFront-Viewer-Address` | Public List |
| Tencent EdgeOne | `EO-Client-IP` | Auth API |
| Aliyun CDN/DCDN | `Ali-Cdn-Real-Ip` | Auth API |
| Akamai | `True-Client-IP` | Header Only |

## Steps

### 1. Enable Auto Fetch for a public-list vendor

For Cloudflare / Fastly / AWS CloudFront (the Public List type), ranges can be fetched anonymously:

1. Find the vendor row in the list.
2. Turn on the **Auto Fetch** switch for that row.
3. Turning it on immediately triggers one fetch; the page shows "Fetch triggered, refresh later to see the count".
4. Refresh the list shortly after — a value appearing under **Downloaded** means the fetch succeeded, and the **Last Fetch** and **Status** columns update accordingly.

<!-- Image: Enable the Auto Fetch switch -->

### 2. Set credentials for an authenticated vendor (EdgeOne / Aliyun), then fetch

Tencent EdgeOne and Aliyun CDN/DCDN are the Auth API type and require credentials before fetching:

1. Click **Set Credential** on the vendor row (it shows **Edit Credential** if already configured).
2. In the dialog, fill in:
   - **SecretId/AccessKeyId**: the vendor's access key ID.
   - **SecretKey/AccessKeySecret**: the vendor's access key.
   - **Extra Params (JSON)**: extra locating parameters per vendor (see below).
3. Click **Confirm** to save. You can then click **Fetch Now** on that row to trigger a fetch.

**Extra Params examples:**

- Tencent EdgeOne — needs `zone_id`; `region` is optional:

  ```json
  {"zone_id":"zone-xxxx","region":""}
  ```

  EdgeOne fetches origin IP ranges via Tencent Cloud's `DescribeOriginACL` API, so `zone_id` is required.

- Aliyun CDN/DCDN — needs `domain` to query origin VIPs; `region` e.g. `cn-hangzhou`:

  ```json
  {"domain":"cdn.example.com","region":"cn-hangzhou"}
  ```

  Aliyun queries the L2 origin-node VIPs by domain via the `DescribeL2VipsByDomain` API, so `domain` is required.

> **Credential security:** Credentials are stored encrypted, never returned after saving, and cannot be exported via SQL query. **Leave SecretId/SecretKey empty to keep unchanged** — when editing, if you only want to change the extra params, leave those two boxes blank. To remove credentials entirely, click **Clear Credential** in the dialog.

<!-- Image: Set Credential dialog -->

### 3. View the fetched origin IPs

When a vendor's **Downloaded** count is greater than 0, a **View IPs** action appears on that row:

1. Click **View IPs** to open a read-only browsing dialog.
2. Inside, search by IP / CIDR keyword; results are paginated.

<!-- Image: View IPs dialog -->

## Field reference

### List columns

| Column | Description |
| --- | --- |
| Vendor | CDN vendor display name. |
| Real-IP Header | The request header this vendor uses to pass the real client IP. |
| Type | Vendor tier tag: Public List / Auth API / Header Only. |
| Auto Fetch | Switch. When on, the vendor's ranges refresh automatically on schedule; Header Only vendors have no switch and show "-". |
| Downloaded | Number of origin-range entries currently in the central store for this vendor; **View IPs** is hidden when 0. |
| In Use | Whether the vendor is referenced by a site/management side — shows "In Use" if so, otherwise "-". |
| Last Fetch | Time of the most recent successful fetch. |
| Status | Result status of the most recent fetch. |
| Operation | Fetch Now / View IPs / Set Credential (or Edit Credential). |

### Credential dialog fields

| Field | Description |
| --- | --- |
| SecretId/AccessKeyId | Vendor access key ID. Empty = keep unchanged. |
| SecretKey/AccessKeySecret | Vendor access key. Empty = keep unchanged. |
| Extra Params (JSON) | Locating parameters: EdgeOne fills `zone_id`; Aliyun fills `domain` (may include `region`). |
| Clear Credential | Permanently deletes the vendor's saved credentials (appears only when credentials are configured). |

## FAQ

**Q: A vendor is already referenced by a site, but Downloaded is still 0. Why?**

Built-in vendors do not auto-fetch by default. Even when referenced by a site, you must enable that vendor's **Auto Fetch** on this page (or click **Fetch Now**) before its ranges are actually retrieved. Enabling Auto Fetch triggers one immediate fetch.

**Q: I clicked Fetch Now on an authenticated vendor (EdgeOne / Aliyun) but got no data.**

These vendors have no anonymous public list. You must first fill in the correct SecretId/SecretKey and extra params under **Set Credential** (EdgeOne's `zone_id`, Aliyun's `domain`) before the authenticated API can return origin IP ranges.

**Q: Why does Akamai have no Auto Fetch switch?**

Akamai is the Header Only type — there is no fetchable public origin range. SamWaf only trusts its real-IP header `True-Client-IP` or manual entry, so no auto-fetch is offered.

**Q: Can I view credentials after saving?**

No. Credentials are stored encrypted, never shown again after saving, and cannot be exported via SQL query. When editing, if you only change the extra params, leave SecretId/SecretKey empty to keep the original values unchanged.
