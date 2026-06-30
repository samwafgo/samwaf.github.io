# Visit Log

## Overview

The Visit Log page records every **raw access request** that passes through the WAF. Whether allowed, blocked or forbidden, each request is logged individually, so you can search single accesses by many conditions — time, website, source IP, rule, status code and more — and drill into the full access detail.

> Note: The Visit Log shows accesses **per request**. To view attacks aggregated **by source IP** with the rules they triggered, use the "Risk Log" instead.

The page has three parts: a collapsible **Log Settings** area, a **Search/Filter** area, and the **access record list**.

<!-- Image: Visit Log page with log settings, search area and record list -->

## Steps

### 1. Query and Filter

Fill in the conditions in the top form as needed, click **Search** to run the query, and **Reset** to clear:

- Choose a **Website**, and enter **Rule Name**, **Visit Identifier**, **Access Status**, **Response Code**, **Source IP**, **Access Date** (time range), **Access Method**, **Log Archive Database**, etc.
- Some table columns (Identity, Visit Identifier, Header) support inline keyword filtering — type in the column header and press Enter to confirm.
- Click a column header to sort columns such as "Time Spent", "AI Score" and "Time".

### 2. View Access Details

- Click **Details** on a row to open the full access detail page for that record (request/response, time cost, region, etc.).
- Click **Search Source IP** to immediately re-query using that row's source IP as the condition.

### 3. Add a Source IP to the Block List

- Each IP in the **Source IP** column has an **Add to Block List** button; click and confirm to add that IP to the site's block list.

### 4. Export Logs (SQLite only)

- When the current log archive database is file-based (SQLite), an **Export** button appears to export the currently selected log file. Historical files may be large, so export during off-peak hours. The Export button is hidden in MySQL mode.

### 5. Column Configuration

- Click **Column Config** to choose which columns to display, and **Reset Column Config** to restore the defaults. Column settings are saved in your local browser.

### 6. Log Settings (collapsible)

- Click the "Log Settings" title at the top to expand the options, then click **Save Config** to apply. You can set whether to record response payloads, record the raw request BODY, the log recording type, max payload lengths, history retention days, log-archive parameters, log persistence, batch insert, IP Tag storage location, and more.

### 7. IP Extraction Issue

- Click **IP extraction issue?** to open a dialog and configure which HTTP header to extract the visitor's real IP from. Common headers like Cloudflare, X-Forwarded-For and X-Real-IP can be filled in with one click. If left empty, the connection IP is used; you can list multiple headers (comma-separated, the first non-empty one is used).

### 8. AI Training Mark (optional)

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
| Header | The request header content; filterable inline. |
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
| Log Archive Database | The log archive database (shard) to search; the count is shown in parentheses. |

## FAQ

- **The Source IP shows the proxy/CDN IP — what now?** Use **IP extraction issue?** to configure the real-IP header (e.g. Cloudflare's CF-Connecting-IP, the generic X-Forwarded-For, etc.).
- **Why is the Export button missing?** Export is only supported for file-based (SQLite) log archives; it is not available in MySQL mode.
- **What is the difference between Visit Log and Risk Log?** The Visit Log is per-request raw access records; the Risk Log aggregates attacks by source IP with their triggered rules, focusing on attack triage.
