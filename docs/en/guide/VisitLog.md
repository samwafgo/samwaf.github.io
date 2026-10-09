# Visit Log

## Overview

The Visit Log page records every **raw access request** that passes through the WAF. Whether allowed, blocked or forbidden, each request is logged individually, so you can search single accesses by many conditions — time, website, source IP, rule, status code and more — and drill into the full access detail.

> Note: The Visit Log shows accesses **per request**. To view attacks aggregated **by source IP** with the rules they triggered, use the "Risk Log" instead.

::: tip Want to know what is blocking a given IP right now?
IPs in the list are clickable — one click opens **IP Lookup**, which checks the allow/block lists, IP groups, threat intelligence, every ban record and the CDN origin ranges in one go, and lets you allowlist or blocklist the IP on the spot. See [IP Lookup](./IPLookup.md).
:::

The page has three parts: a collapsible **Log Settings** area, a **Search/Filter** area, and the **access record list**. Above the list you can switch between the **Access Log** and **Security Events** views.

::: tip Logs are stored in tiers
- **Security events**: requests that hit a rule or were blocked, kept together with their full payload; retention follows "Delete History Log (days)".
- **Access log**: every recorded request also writes one narrow row (no payload), with its own retention set by "Access log retention days", 30 by default.

A security event writes a narrow row as well, so the Access Log view shows all recorded traffic while the Security Events
view shows the rule-matching subset of it. Payloads are kept only for security events (plus watchlist captures and
sampled requests), so the detail of an ordinary request states that no payload was retained.
:::

<!-- Image: Visit Log page with log settings, search area and record list -->

## Steps

### 1. Switch the View

**Access Log / Security Events** at the top left of the list are two different data views:

- **Access Log**: every recorded request (narrow rows), for overall traffic and the complete behaviour of one IP.
- **Security Events**: the subset that hit a rule or was blocked, carrying full payloads, for attack triage.

Switching re-runs the current query. Two things to note: the full-text **Request** (Header) filter exists only in the
**Security Events** view and is dropped automatically when you switch to the Access Log view, where the
**User-Agent** and **Referer** column filters take its place. When opened from the detail of an IP in the Risk Log,
the Access Log view is labelled **All Activity** and shows every request from that IP.

### 2. Query and Filter

Fill in the conditions in the top form as needed, click **Search** to run the query, and **Reset** to clear:

- Choose a **Website**, and enter **Rule Name**, **Visit Identifier**, **Access Status**, **Response Code**, **Source IP**, **Access Date** (time range), **Access Method**, **Log Archive Database**, etc.
- Some table columns (Identity, Visit Identifier, Header) support inline keyword filtering — type in the column header and press Enter to confirm.
- Click a column header to sort columns such as "Time Spent", "AI Score" and "Time".

### 3. View Access Details

- Click **Details** on a row to open the full access detail page for that record (request/response, time cost, region, etc.).
- Click **Search Source IP** to immediately re-query using that row's source IP as the condition.

### 4. Add a Source IP to the Block List

- Each IP in the **Source IP** column has an **Add to Block List** button; click and confirm to add that IP to the site's block list.

### 5. Export Logs (SQLite only)

- When the current log archive database is file-based (SQLite), an **Export** button appears. What it produces is no longer a copy of the whole log database but a fresh encrypted SQLite file built from **a chosen time range and chosen tiers**:
  - **Time range**: empty means everything.
  - **Content**: tick any of "Access Log / Security Events / Payloads / Legacy web_logs"; at least one is required.
- After confirming, the export runs in the background; collect the file from the download centre when it finishes. Historical data can be large, so export during off-peak hours. The Export button is hidden in MySQL / PostgreSQL mode.

### 6. Column Configuration

- Click **Column Config** to choose which columns to display, and **Reset Column Config** to restore the defaults. Column settings are saved in your local browser.

### 7. Log Settings (collapsible)

- Click the "Log Settings" title at the top to expand the options, then click **Save Config** to apply. You can set whether to record response payloads, record the raw request BODY, the log recording type, max payload lengths, history retention days, log-archive parameters, log persistence, batch insert, IP Tag storage location, the **access log mode**, **access log retention days**, the **global exclude-IP list for logging**, and more.

::: tip About "Access log mode"
It controls how narrow rows are written, which is a separate thing from "Log Recording Type" above:

- **Store everything** (default): every recorded request writes a narrow row, exactly as before the upgrade.
- **Sampled**: only a portion of narrow rows is kept, cutting log volume noticeably.
- **Security events only**: no narrow rows at all, only security events.

Moving away from "Store everything" costs you **CC threshold recommendations**, **AI training negative samples** and
the ability to **look back at the normal traffic of a suspicious IP** - the page shows the same warning when a
non-default mode is selected, and the CC threshold recommendation panel is greyed out in "Security events only" mode
with the reason stated. Consider changing the mode only for very busy sites or tight disks; ordinary deployments
should stay on the default.

"Access log retention days" covers narrow rows only (30 by default); security events and payloads still follow
"Delete History Log (days)".
:::

::: tip About "Global exclude-IP list for logging"
Skips logging by **source IP**, a different dimension from "Exclude URLs When Logging" in the website editor.
The per-site list lives in [Website Protection](./Host.md) as "Exclude IP When Logging", and the two lists are unioned.

- The syntax matches the block and allow lists: a single IP, CIDR (`10.0.0.0/8`), wildcard (`192.168.1.*`),
  range (`10.0.0.1-10.0.0.50`), or `group:CODE` referencing an IP group (changing the contents of the group takes
  effect immediately for every site naming it).
- Comma- or newline-separated, `#` starts a comment; a malformed pattern is rejected when saving and the offending line is named.
- Saving is enough - no restart needed.
- **Only plain requests are silenced**: security events from an excluded IP (rule hits, blocks) are still recorded.
  An office exit is often one NAT-shared address, and silencing it outright would make a real attack invisible.
- Excluded requests write no log row, are not counted in request statistics and never reach the Source & Path
  Analysis rollups, while their inbound and outbound bytes are still metered, so they remain visible on the traffic charts.

Typical use: list your office exit, monitoring probes and load-test machines.
:::

::: warning About "IP Tag storage location"
Switching from the main database to the stats database (or back) automatically merges the tags already accumulated in
the other database: counts for the same IP and tag are added up, the first-seen time keeps the earlier value and the
last-seen time the later one, and the merged rows are cleared from the source. The logs themselves are untouched.
With many tags the merge takes a while - the page shows that it is merging historical tags from the previous database
and refreshes itself when it finishes. It applies immediately on save, with no restart.
:::

::: tip About "Log Recording Type"
- **All**: every request is recorded (default).
- **Abnormal**: only non-allowed requests are recorded, which greatly reduces log volume. Note that requests which "matched a rule but were not blocked" count as security events and are still recorded even though they were allowed, including: custom-rule **allow** (`RF.Allow` / `RF.AllowAll`), custom-rule **log only** (`RF.Log`), and requests matched while the site has **Log Only Mode** enabled. This way you can still see which requests used a whitelist and what a rule under observation caught. Ordinary requests that match no rule are still not recorded in this mode.
:::

### 8. IP Extraction Issue

- Click **IP extraction issue?** to open a dialog and configure which HTTP header to extract the visitor's real IP from. Common headers like Cloudflare, X-Forwarded-For and X-Real-IP can be filled in with one click. If left empty, the connection IP is used; you can list multiple headers (comma-separated, the first non-empty one is used).

### 9. AI Training Mark (optional)

- In the Operation column, click **AI Mark** to manually correct a record's label: False Positive (Normal) / Confirm Attack (with optional attack category) / Ignore. The correction is used when exporting AI training data, and can be unmarked.

## Field Reference

### List Columns

| Field | Description |
|-------|-------------|
| Identity | The visitor identity recognized by the system; filterable inline. |
| Time Spent (ms) | Processing time of this request in milliseconds; sortable. |
| Risk Level | The risk level of this access. |
| Status | Defense result: Allow / Block / Forbid. |
| Log Only Mode | Whether the request is in "Log Only" mode (rule hits are logged, not blocked). |
| AI Score | The anomaly score from AI Intelligent Detection (0-1, higher is more suspicious). |
| Trigger Rule | The rule name hit by this access. |
| Time | When the access occurred; sortable. |
| Domain | The accessed website domain. |
| Request | The request method (GET/POST, etc.). |
| Source IP | The visitor's source IP, with an "Add to Block List" button next to it. |
| Country / Province / City | Geolocation of the source IP. |
| Visit Identifier | The unique request identifier (req_uuid); filterable inline. |
| Access URL | The URL of this request. |
| Header | The request header content; filterable inline. **Security Events view only** (payloads are stored separately, so access-log narrow rows do not carry this column). |
| User-Agent / Referer | Dedicated columns on the narrow row, filterable in both views; in the Access Log view they take the place of the full-text Request filter. |
| status | The response status code. |
| Operation | Search Source IP / Details / AI Mark. |

### Search/Filter Fields

| Field | Description |
|-------|-------------|
| Website | Filter by a specific website; searchable and clearable. |
| Rule Name | Fuzzy search by the hit rule name. |
| Visit Identifier | Exact lookup by the unique request identifier. |
| Access Status | Defense status: All / Block / Allow / Forbid. |
| Response Code | Search by HTTP response status code. |
| Source IP | Search by the visitor's source IP. |
| Access Date | Access time range (down to seconds). |
| Access Method | All / POST / GET / CONNECT / HEAD / OPTIONS / PRI. |
| Log Archive Database | "Auto" (the default) picks the partitions from the access date range; you can also lock a single partition. Each option shows the partition's time range and row count; a partition whose storage no longer exists is marked "file missing" and cannot be selected. |

## FAQ

- **The Source IP shows the proxy/CDN IP — what now?** Use **IP extraction issue?** to configure the real-IP header (e.g. Cloudflare's CF-Connecting-IP, the generic X-Forwarded-For, etc.).
- **Why is the Export button missing?** Export works by backing up the log database file, so it is only supported for file-based (SQLite) log archives. MySQL / PostgreSQL have no log file, so export is not available there.
- **What is the difference between Visit Log and Risk Log?** The Visit Log is per-request raw access records; the Risk Log aggregates attacks by source IP with their triggered rules, focusing on attack triage.
- **Why does a detail say no payload was retained?** Payloads are kept only for security events, watchlist captures and sampled requests; an ordinary request has a narrow row and nothing else. To retain payloads for a suspicious IP, add it to the watchlist on the [Risk Log](./AttackLog.md).
- **The Request filter disappeared after switching to the Access Log view.** That filter matches payload text and exists only in the Security Events view. In the Access Log view, use the User-Agent / Referer column filters instead.
- **I excluded an IP, so why does it still show up in traffic statistics?** Exclusion applies to logs and request counts; inbound and outbound bytes are metered by the engine outside the log path, so they still appear on the traffic charts. That is expected.
- **A partition shows "file missing" in the archive dropdown, or a query says some partitions were skipped.** The partition's record still exists but its archive file (an archive table on MySQL / PostgreSQL) is gone - usually because the file was deleted by hand. If the message says the file exists but contains no data, the file was replaced or emptied. All other partitions are queried as usual. Once you are sure you don't need it, delete the record under Partitions. History archive files are only ever read; queries never modify them.
- **How do I cut log volume?** Set the access log mode to "Sampled" first, or list your office exit and probe machines in the global exclude-IP list. Use "Security events only" only when you really need the savings, accepting the loss of CC threshold recommendations and the rest.
