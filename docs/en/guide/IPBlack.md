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
3. Enter the **IP** (required). A single IP or a CIDR range is supported, e.g. `1.2.3.4`, `10.0.0.0/8`.
4. Optionally add notes in the **Remarks** field.
5. Click **Confirm** to save.

<!-- Image: New Blacklist IP dialog -->

### 3.2 Edit / Delete

- In the **Operation** column of each row, click **Edit** to change the website, IP, or remarks of an entry.
- Click **Delete** to remove a single entry (a confirmation prompt appears).

### 3.3 Batch Delete and Clear All

- Tick the checkboxes in front of the rows, then click **Batch Delete** to remove all selected entries (the button is disabled when nothing is selected).
- Click **Clear All** to remove all blacklist entries under the current filter (a second confirmation appears).

### 3.4 Export Data

Click **Export Data** to export the blacklist as an Excel file (`ipblock.xlsx`) for backup or migration.

### 3.5 Search

The top-right area lets you filter by **Website** and **IP**; enter values and click **Search**.

## 4 Field Reference

| Field | Description |
| --- | --- |
| Website | The protected site this entry applies to. Required when adding/editing. |
| IP | The IP or range to block. Supports a single IP and CIDR, e.g. `127.0.0.1`, `0.0.0.0/0`. Required when adding/editing. |
| Remarks | Optional free-text notes. |
| Create Time | The creation time of the record (shown in the list, generated automatically). |

::: warning
Use broad ranges like `0.0.0.0/0` with caution to avoid blocking legitimate visitors. If an IP whitelist is also configured, the whitelist takes precedence and allows the traffic through.
:::