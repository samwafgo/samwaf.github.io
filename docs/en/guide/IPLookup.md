# IP Lookup

## Overview

A single IP can be governed by several places at once: the IP Blacklist, IP Allowlist, IP Groups, Threat Intelligence IP feeds, IP Failure Bans, CC bans, Firewall IP Blocking — and it may also fall inside a CDN origin range. Working out "why is this IP blocked?" (or "why isn't it?") by opening each page one by one is slow and easy to get wrong.

**IP Lookup** collapses that into a single query: enter an IP, and it checks every source above at once and gives you a verdict — **Will be allowed** or **Will be blocked** — along with exactly which rule, which site and which feed matched. If it turns out to be a false positive you can add it to the allowlist right there; if it is genuinely malicious you can block it right there too.

Matching is **CIDR-aware**: looking up `1.2.3.4` matches a `1.2.3.0/24` entry in your lists — it is not a plain text comparison.

<!-- Image: IP Lookup dialog with query results -->

## Where to Open It

The **IP Lookup** button is available at the top right of these pages:

| Page | Location |
| --- | --- |
| Protection Logs → Attack Log | Right side of the top info bar |
| Protection Logs → Visit Log | Right side of the top info bar |
| Website Protection → Threat Intelligence IP Subscription | Right side of the top info bar |
| Website Protection → CDN Origin IPs | Right side of the top info bar |
| System Settings → IP Failure Ban | Next to the Refresh button |

In addition, the IPs in the following places are **clickable** — one click opens the lookup and runs it automatically, no copy-and-paste needed:

- The **IP** column in the Attack Log list
- The **Source IP** column in the Visit Log list
- The **IP** column in the IP Failure Ban list
- Every IP / CIDR in the "View IPs" dialog of Threat Intelligence IP Subscription
- Every CIDR in the "View IPs" dialog of CDN Origin IPs

## Operation Steps

### Look Up an IP

1. Open **IP Lookup** from any of the entry points above.
2. Enter the IP and click **Search** (or just press Enter).
3. The query runs as 4 concurrent batches, and the progress of each is shown below the input: **Lists**, **Bans**, **Threat-intel IPs**, **CDN origin ranges**. Batches that finish first render first — you do not have to wait for all of them.
4. The top of the results area shows the IP, its location and the **verdict**; below it, every match is listed by source.

::: tip You can look up a range too
The input also accepts CIDRs (such as `1.2.3.0/24`) and ranges (such as `1.2.3.5-1.2.3.9`). In that case a representative IP inside the range is used, and the result states which IP was actually queried.
:::

### Allowlist a False Positive

1. When the verdict is **Will be blocked**, an **Add to allowlist** button appears below the match list.
2. Open it and choose the site it **applies to** (defaults to "Global Site", i.e. all sites).
3. The **reason** is pre-filled with the date and the sources that originally matched. You can edit it, but it cannot be empty.
4. Click **Confirm**. The lookup re-runs automatically so you can see the verdict change for yourself.

::: warning The allowlist only applies inside the WAF
If the IP is blocked at the **system firewall layer** (Firewall IP Blocking, or a threat-intel feed whose landing layer is "System firewall" or "Both"), an orange warning appears in the allowlist form.

The system firewall drops packets at the operating-system level, so the request never reaches the WAF and the IP allowlist **cannot take effect**. After allowlisting, the verdict will read "Allowed by the WAF, still blocked by the system firewall".

To allow it completely, unban it on the **Firewall IP Blocking** page, or change the threat-intel feed's **landing layer** to "WAF only".
:::

### Blocklist a Malicious IP

1. When the IP is in neither the blocklist nor the allowlist, an **Add to blocklist** button appears.
2. Choose the site it **applies to** and where to **block** it (WAF only / System firewall / Both — defaults to "WAF only").
3. Fill in the **reason** (also pre-filled).
4. Click **Confirm**. The lookup re-runs automatically.

<!-- Image: Add to allowlist / Add to blocklist form -->

## Verdicts

| Verdict | Meaning |
| --- | --- |
| Not on any list | The IP is currently not on any allow/block list, ban record or threat-intel feed |
| Will be allowed | Matched the allowlist, with no system-firewall-layer block |
| Will be blocked | Matched the blocklist / threat intelligence / one of the ban records |
| Allowed by the WAF, still blocked by the system firewall | Allowlisted, but the system firewall is still dropping packets — handle it separately |
| Matched, but does not allow or block on its own | For example only a CDN origin range matched, or the matched IP Group is not referenced by any allow/block list |

## Field Reference

Each match in the result list contains:

| Field | Description |
| --- | --- |
| Source | Where the match came from: IP allowlist, IP blocklist, IP group, Threat-intel IP, IP failure ban, CC ban, Firewall IP ban, CDN origin IP |
| Scope | Which site / IP group / feed channel / CDN provider the entry belongs to. Entries that apply everywhere show "Global Site" |
| Matched rule | The exact rule that matched (single IP, CIDR, wildcard or range). Cache-based bans have no rule text, so this is empty |
| Effect | Allow / Block / Info only |
| Details | Remarks, remaining ban time, the threat-intel landing layer, and so on |

## FAQ

**Which sources are covered?**

IP allowlist, IP blocklist, IP groups, threat-intel IPs, IP failure bans, CC bans, firewall IP bans and CDN origin ranges — eight in total.

**Why is the first lookup slightly slower, and later ones fast?**

Threat-intel feeds and CDN origin ranges can reach hundreds of thousands of entries. The first lookup builds an index once (typically a few hundred milliseconds); after that the index is reused until the corresponding feed syncs again.

**What does "These sources failed this time, so the result may be incomplete" mean?**

One of the sources could not be queried (for example a snapshot is being synced). In that case "not found" must not be read as "not on any list" — try again shortly.

**A match says "site no longer exists, this entry has no effect"?**

The site this entry was bound to has been deleted, so the entry does nothing. You can clean it up on the corresponding allow/block list page.

**I allowlisted the IP but still cannot reach the site.**

It is most likely blocked at the system firewall layer. See [The allowlist only applies inside the WAF](#allowlist-a-false-positive) above.
