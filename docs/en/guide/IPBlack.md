# IP Blacklist

## 1 IP Blacklist 
The protective wall will block access from IPs within the blacklist.
### 1.1 IP Blacklist
Support IP or CIDR

![IP Blacklist](/images/ipblack.png)

### 1.2 Batch Add Blacklist IP  
See: Website Management -> Batch Tasks  
[Batch Add Blacklist IP](./BatchTask.md)

## 2 Overview

The IP blacklist is a "block list": when an IP or CIDR range in the blacklist accesses a protected website, SamWaf blocks the request outright. It is commonly used to ban malicious sources, attacking IPs, and abusive crawler ranges.

The banner at the top of the page reads: **SamWaf will block access from IPs / ranges that are in the blacklist**.

## 3 Operation Steps

### 3.1 Add a Blacklist IP

1. Click the **Add Blocklist IP** button in the top-left corner to open the dialog.
2. Select a **Website** (required) — the protected site this blacklist entry applies to.
3. Choose the **Entry Type**:
   - **Single IP / CIDR** (default): enter the **IP** directly — see [3.2 Supported IP syntax](#_3-2-supported-ip-syntax).
   - **Reference IP Group**: pick an existing [IP Group](./IPGroup.md) from the **IP Group** dropdown; every IP in that group applies at once. Options are shown as "Group Name (entry count)", and the **Manage IP Groups** link next to it jumps to the IP Group page.
4. Optionally add notes in the **Remarks** field.
5. Click **Confirm** to save.

The list has a new **Type** column that distinguishes the two kinds of entry. For a row that references a group, the **IP** column shows "Group Name (entry count)" rather than a concrete IP.

<!-- Image: New Blacklist IP dialog -->

::: tip
When the same set of IPs has to be blocked on several sites, create an [IP Group](./IPGroup.md) first and have each site's blacklist reference it. Changing the group afterwards updates every referencing site at once — no per-site edits.
:::

### 3.2 Supported IP syntax

| Syntax | Example | Notes |
| --- | --- | --- |
| Single IP | `1.2.3.4`, `2001:db8::1` | IPv4 and IPv6 both supported |
| CIDR | `10.0.0.0/8`, `2001:db8::/32` | |
| IPv4 wildcard | `10.10.*.*`, `10.*.1.*` | Per octet; `*` may appear in any position |
| IPv6 wildcard | `2001:db8:*:*:*:*:*:*` | Per group; **all 8 groups must be spelled out and `::` shorthand cannot be mixed in** |
| Range | `1.2.3.4-1.2.3.99` | Inclusive on both ends; start and end must both be IPv4 or both IPv6 |

The same hint appears under the input box: **Supports single IP, CIDR, wildcard (IPv4 per octet e.g. 10.10.\*.\*; IPv6 must spell out all 8 groups and cannot use ::), and range (start-end)**.

::: warning
Wildcards and ranges covering an entire address family, such as `*.*.*.*` and `0.0.0.0-255.255.255.255`, are rejected on save. If a whole-family blacklist is required, explicitly enter `0.0.0.0/0` (IPv4) or `::/0` (IPv6) and complete the second confirmation described below.
:::

### 3.3 WAF application layer and system firewall

The blacklist page has removed the **Block Layer** selector. Entries now apply at the **WAF application layer** within the selected website scope. Manage single IPs, CIDRs, wildcards, ranges and IP group references here. For operating-system blocking, use [Firewall IP Block](./FirewallIPBlock.md), whose rules apply to all ports on the machine.

Existing WAF blacklist and system firewall records are preserved after upgrading. If you previously selected "Both", the two records remain independently managed on their respective pages: deleting the WAF entry does not delete the system block, and deleting the system block does not delete the WAF entry.

### 3.3.1 Explicit `/0` scope and second confirmation

When adding or editing a single blacklist entry with an explicit `0.0.0.0/0` or `::/0`, clicking the form's **Confirm** opens a second confirmation showing the website, rule and affected scope. **Cancel** or closing that confirmation does not save the addition or changes. Review the scope and click **Confirm scope and save** to continue saving.

- `0.0.0.0/0` covers **IPv4 only**; `::/0` covers **IPv6 only**. For dual-stack coverage, configure and confirm two separate rules.
- Selecting a specific website affects that address family's requests while protection is enabled for that site. Selecting **Global Site** requires global-site protection to be enabled and affects all sites with protection enabled.
- Only enabled blacklist entries participate in blocking. IP matching uses the client IP identified by the site's configuration: **NIC mode** uses the network peer IP; **Proxy mode** uses the IP identified through the configured real-IP source. Behind a CDN or reverse proxy, first check the site's IP mode, trusted proxies and the IPs shown in logs.

::: warning Allow rules and authentication
Enabled site IP allowlist entries, including single entries and IP group references, take precedence over the IP blacklist. Enabled global IP allowlist entries also take precedence when global-site protection is enabled. URL allowlists and callback-source allowances can also skip the blacklist, so an IP allowlist combined with a `/0` blacklist should not be treated as a strict "only these IPs can access" policy.

Allowlisted requests skip subsequent WAF checks; do not expect all protection checks to remain active for those requests. Website password access, unified access authentication and the application's own authentication still follow their respective configurations. WAF allowlists cannot override an OS firewall DROP; remove the system-layer block on its own page first.
:::

### 3.4 Edit / Delete

- In the **Operation** column of each row, click **Edit** to change the website, IP, or remarks of an entry.
- Click **Delete** to remove a single entry (a confirmation prompt appears).

### 3.5 Batch Delete and Clear All

- Tick the checkboxes in front of the rows, then click **Batch Delete** to remove all selected entries (the button is disabled when nothing is selected).
- Click **Clear All** to remove all blacklist entries under the current filter (a second confirmation appears).

### 3.6 Export Data

Click **Export Data** to export the blacklist as an Excel file (`ipblock.xlsx`) for backup or migration.

### 3.7 Search

The top-right area lets you filter by **Website** and **IP**; enter values and click **Search**.

## 4 Field Reference

| Field | Description |
| --- | --- |
| Website | The protected site this entry applies to. Required when adding/editing. |
| Entry Type | **Single IP / CIDR** (default) or **Reference IP Group**; decides whether you fill in the IP or pick a group. |
| IP | The IP to block. Supports a single IP, CIDR, wildcard and range (see [3.2](#_3-2-supported-ip-syntax)). Required when the entry type is Single IP / CIDR. |
| IP Group | The referenced [IP Group](./IPGroup.md). Required when the entry type is Reference IP Group; the entry follows the group content immediately whenever it changes. |
| Enabled | Enabled entries participate in WAF blacklist matching. Disabled entries remain saved but do not participate. |
| Remarks | Optional free-text notes. |
| Create Time | The creation time of the record (shown in the list, generated automatically). |

::: warning
Use broad ranges with caution. Before saving a `/0` entry, check its address family, website scope, enabled state and applicable allow rules as described in section 3.3.1.
:::
## 5 Feed Source

Switch to the **Feed Source** tab at the top to view, read-only, a per-channel summary of [Threat Intelligence IP Feeds](./ThreatIP.md) landed into the WAF application layer: name, channel code, landing layer, enabled status, **Landed (Active)** count, last status, and last sync time.

For performance, subscribed IPs are not written row-by-row into this page's blacklist; they are summarized per channel. Click **View IPs** on a channel to browse its specific IPs/CIDRs read-only, with substring filtering.

<!-- Image: IP Blacklist Feed Source tab -->

## Update History

| Date | Applicable Version | Description |
| --- | --- | --- |
| 2026-10-30 | Unreleased | Blacklist UI uses the WAF layer only; explicit `/0` additions/edits require scope confirmation; clarified allowlist precedence, IP identification mode and independent system-layer records. |
