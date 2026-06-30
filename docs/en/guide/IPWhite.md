# IP Whitelist

## 1 IP Whitelist 
The protective wall will ignore IPs within the whitelist.
### 1.1 IP Whitelist
Support IP or CIDR

![IP Whitelist](/images/ipwhite.png)

### 1.2 Batch Add Whitelist IP  
See: Website Management -> Batch Tasks  
[Batch Add Whitelist IP](./BatchTask.md)

## 2 Overview

The IP whitelist is an "allow list": when an IP or CIDR range in the whitelist accesses a protected website, SamWaf skips all protection checks for it and lets the request through. It is commonly used for internal ops IPs, monitoring/health-check IPs, payment callback sources, and other traffic that should bypass inspection.

The banner at the top of the page reads: **SamWaf will ignore IPs / ranges that are in the whitelist**.

## 3 Operation Steps

### 3.1 Add a Whitelist IP

1. Click the **Add Allowlist IP** button in the top-left corner to open the dialog.
2. Select a **Website** (required) — the protected site this whitelist entry applies to.
3. Enter the **IP** (required). A single IP or a CIDR range is supported, e.g. `127.0.0.1`, `192.168.1.0/24`.
4. Optionally add notes in the **Remarks** field.
5. Click **Confirm** to save.

<!-- Image: New Whitelist IP dialog -->

### 3.2 Edit / Delete

- In the **Operation** column of each row, click **Edit** to change the website, IP, or remarks of an entry.
- Click **Delete** to remove a single entry (a confirmation prompt appears).

### 3.3 Batch Delete and Clear All

- Tick the checkboxes in front of the rows, then click **Batch Delete** to remove all selected entries (the button is disabled when nothing is selected).
- Click **Clear All** to remove all whitelist entries under the current filter (a second confirmation appears).

### 3.4 Search

The top-right area lets you filter by **Website** and **IP**; enter values and click **Search**.

## 4 Field Reference

| Field | Description |
| --- | --- |
| Website | The protected site this entry applies to. Required when adding/editing. |
| IP | The IP or range to allow. Supports a single IP and CIDR, e.g. `127.0.0.1`, `0.0.0.0/0`. Required when adding/editing. |
| Remarks | Optional free-text notes. |
| Create Time | The creation time of the record (shown in the list, generated automatically). |

::: tip
The "Website" column in the list shows the corresponding site name. To allow an IP across all sites, select the global website when adding the entry.
:::