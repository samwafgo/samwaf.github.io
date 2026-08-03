# Threat Intelligence IP Subscription

## Overview

Threat Intelligence IP Subscription lets you subscribe to multiple threat-intel IP feeds. It performs a **daily full pull with automatic incremental landing** into the WAF app layer and/or the system firewall (ipset). It is optimized for tens of thousands of entries.

Two banners appear at the top of the page:

- Blue banner: `Subscribe to threat-intel IP feeds; daily full pull with incremental landing (WAF app layer / system firewall ipset). Optimized for tens of thousands of entries.`
- Yellow banner: explains what each operation (Enable / Disable / Sync / Delete) does — see [Operation Semantics](#operation-semantics) below.

<!-- Image: Threat Intelligence IP Subscription list page with the two top banners -->

::: tip
For performance, subscribed IPs are **not** written into the IP Blacklist list row-by-row. To browse the actual landed IPs, use this feature's "Subscription Source" summary view (see [View Landed IPs](#view-landed-ips)), or the "Subscription Source" tab on the **Firewall IP Block / IP Blacklist** pages.
:::

## Operation Steps

### Add a Feed Channel

1. Click **Add Feed Channel** in the top-left corner.
2. (Optional) Pick a built-in feed from the **Common Feeds** dropdown to auto-fill name, URL, and parser (still editable) — see [Quick-fill with Common Feeds](#quick-fill-with-common-feeds).
3. Enter the **Channel Code** (`code`; lowercase/digits/underscore, ≤13; used as the ipset name; not editable after creation).
4. Enter the **Name** and **Fetch URL** (the download URL of the IP list).
5. Choose the **Parser** (Generic / IP-CIDR / ipsum). When `ipsum` is selected, an extra **Hit Threshold** field appears.
6. Choose the **Landing Layer** (WAF App Layer / System Firewall / Both). Default is "WAF App Layer".
7. Set the **Interval (hours)** (default 24), confirm the **Enable** switch, and optionally add **Remarks**.
8. Click **Confirm** to save.

<!-- Image: Add Feed Channel dialog -->

### Quick-fill with Common Feeds

Selecting a built-in feed from the **Common Feeds** dropdown at the top of the Add dialog auto-fills that feed's name, URL, parser, and threshold (all still editable).

The 9 built-in feeds:

| Code | Name | Fetch URL | Parser | Notes |
| --- | --- | --- | --- | --- |
| `ustc` | USTC | `https://blackip.ustc.edu.cn/list.php?txt` | IP-CIDR | China general malicious IP |
| `ipsum` | stamparm ipsum | `https://raw.githubusercontent.com/stamparm/ipsum/master/ipsum.txt` | ipsum | Multi-source aggregate, default threshold 3 |
| `firehol1` | FireHOL Level1 | `https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset` | IP-CIDR | Low-false-positive aggregate, includes Spamhaus/DShield |
| `blocklistde` | blocklist.de | `https://lists.blocklist.de/lists/all.txt` | IP-CIDR | Attacker IPs, full list |
| `ciarmy` | CINS Army | `https://cinsscore.com/list/ci-badguys.txt` | IP-CIDR | Active malicious IPs |
| `greensnow` | GreenSnow | `https://blocklist.greensnow.co/greensnow.txt` | IP-CIDR | Brute-force / scanning |
| `et_comp` | ET Compromised | `https://rules.emergingthreats.net/blockrules/compromised-ips.txt` | IP-CIDR | Compromised hosts |
| `spamhaus` | Spamhaus DROP | `https://www.spamhaus.org/drop/drop.txt` | Generic | Hijacked netblocks, low false positive |
| `feodo` | Feodo Tracker | `https://feodotracker.abuse.ch/downloads/ipblocklist.txt` | IP-CIDR | Botnet C2 |

::: warning
Some feeds are overseas (github / abuse.ch / spamhaus, etc.) and may be slow to reach from certain regions or require your own network. Feed content and availability are the source's responsibility — evaluate before enabling. Landing defaults to "WAF app layer only"; switch to "Both" or "System" for system-firewall blocking.
:::

### Sync Now

Click **Sync Now** in the row's operation column to re-fetch the channel's latest IPs online. After triggering, the UI shows "Sync triggered, refresh later to see status". Diffing and landing large lists take seconds to tens of seconds and run asynchronously in the background — refresh the list later to check "Last Status" and "Count".

### View Landed IPs

Subscribed IPs do not appear row-by-row in the blacklist. To see the actual landed entries, use the "Subscription Source" summary view:

- The view summarizes each channel's "Landed (Active)" count. A disabled channel that still has a snapshot shows the snapshot count as `(snapshot N, re-lands on enable)`.
- Click **View IPs** on a channel to browse its actual IP / CIDR entries read-only with pagination, filterable by an IP/CIDR substring.

<!-- Image: Subscription Source summary view and View IPs dialog -->

## Operation Semantics

The four operations in the row's operation column (and the yellow banner) behave as follows. **All landing runs asynchronously in the background — the notification center (top-right) reports completion.**

| Operation | Behavior |
| --- | --- |
| Enable | Re-lands the channel's IPs from its snapshot (rebuilds the firewall ipset if it lands to the system layer) and includes them in WAF blocking. |
| Disable | Immediately removes the channel's set from the system firewall and drops it from the WAF union; the snapshot is kept, so re-enabling re-lands in seconds. |
| Sync (Sync Now) | Re-fetches the channel's latest IPs online → diffs the changes → updates the snapshot and landing (large lists take seconds to tens of seconds). |
| Delete | Removes the channel and its snapshot and tears down the firewall landing. |

## Field Reference

| Field | Description |
| --- | --- |
| Name | Display name of the channel (required). |
| Channel Code | `code`; lowercase/digits/underscore, ≤13; used as the ipset name (required; not editable when editing an existing channel). |
| Fetch URL | Download URL of the threat-intel IP list (required). |
| Parser | Generic (one IP/CIDR per line) / IP/CIDR (USTC etc.) / ipsum (IP + hit count) — see table below. |
| Hit Threshold | Appears only when the parser is ipsum; only IPs with hit count ≥ threshold are kept (all kept when threshold ≤ 0). |
| Landing Layer | WAF App Layer / System Firewall / Both — determines which layer the IPs take effect on. |
| Interval (hours) | Interval of the automatic full pull; default 24 hours. |
| Enable | Whether the channel is enabled. |
| Remarks | Optional free-text notes. |

### Parsers

| Parser | Description |
| --- | --- |
| Generic (one IP/CIDR per line) | Fallback parser: ignores blank lines and `#` comments, takes the first field of each line for IP/CIDR validation (tolerates trailing comments). |
| IP/CIDR (USTC etc.) | One entry per line (single IP or CIDR, IPv4/IPv6 mixed), no comment header. |
| ipsum (IP + hit count) | Handles the `IP<whitespace>hit-count` format, filtered by the Hit Threshold. |

### List Columns

| Column | Description |
| --- | --- |
| Name | Channel name. |
| Channel Code | The ipset name. |
| Parser | Parser used by the channel. |
| Landing Layer | WAF App Layer / System Firewall / Both. |
| Enable | Enabled / Disabled. |
| Count | Number of entries taken in the last sync. |
| Last Status | Result status of the last sync/landing. |
| Last Sync | Time of the most recent sync. |

## FAQ

- **Why does a disabled channel show a landed count of 0?** Disabling immediately drops the channel from the system firewall and the WAF union, so the landed count goes to zero — this is expected. The snapshot is kept, and the "Subscription Source" view shows `(snapshot N, re-lands on enable)`; re-enabling re-lands it in seconds.
- **I clicked Sync Now but the count didn't change.** Landing runs asynchronously in the background; diffing and writing large lists take seconds to tens of seconds. Refresh the list later to check "Last Status" and "Count" — the notification center (top-right) also reports completion.
- **An overseas feed fails or is very slow.** Feeds such as github / abuse.ch / spamhaus are overseas and may be slow to reach from certain regions or require your own network; content and availability are the source's responsibility.
- **How do I make subscribed IPs block at the system layer?** When adding or editing a channel, set **Landing Layer** to "System Firewall" or "Both" (system-layer landing depends on the OS firewall environment — see the prerequisites of [Firewall IP Block](/en/guide/FirewallIPBlock.html)).
- **Where can I browse the actual subscribed IPs?** Subscribed IPs are not written into the IP Blacklist row-by-row; use **View IPs** in this feature's "Subscription Source" summary view, or the "Subscription Source" tab on the Firewall IP Block / IP Blacklist pages.
