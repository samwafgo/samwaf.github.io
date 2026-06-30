# Firewall IP Block

## Overview

Firewall IP Block provides OS-level IP blocking. It performs better than the application-layer blacklist and is suited to malicious IPs that should be completely blocked.

Unlike the application-layer blacklist, Firewall IP Block stops traffic at the operating system firewall, so a blocked IP is rejected before it ever reaches the WAF application.

The top of the page shows four statistics cards giving a live overview of the current block rules: Total, Active, Inactive, and Expired.

<!-- Image: Firewall IP Block list and statistics cards -->

## Use Cases

- Completely block malicious IPs at the system level, not just at the application layer.
- Import a batch of known malicious IPs or IP ranges.
- Work with the automatic blocking mechanism to block source IPs that trigger rules, temporarily or long term.

## Steps

### Add a single block

1. Click **Add Firewall IP Block** at the top-left of the page.
2. In the dialog, choose the **Website**, enter the **IP Address** and **Block Reason**, and select a **Block Type**.
3. To set an **Expire Time**, pick a specific time; leave it blank for a permanent block.
4. Optionally add a remark, then click **Confirm** to save.

<!-- Image: Add block dialog -->

### Batch add

1. Click the **Batch Add** button.
2. In the **IP List** text box, enter one IP address per line. Single IP and CIDR formats are supported.
3. Choose the **Website**, enter the **Block Reason**, select a **Block Type**, and add remarks.
4. Click **Confirm** to block all of them at once.

### Enable / Disable

- In the action column, an **Inactive** record can be re-enabled with **Enable**; an **Active** record can be turned off with **Disable**.

### Sync Rules

- Click **Sync Rules** to push the management-side block rules to the operating system firewall.

### Clear Expired

- Click **Clear Expired** to remove all block records that have already expired.

### Edit / Delete / Batch Delete

- In the action column, click **Edit** to modify a single rule or **Delete** to remove it.
- Select multiple records and click **Batch Delete** to remove them at once.

## Field Reference

| Field | Description |
| --- | --- |
| Website | The website this block rule belongs to. |
| IP Address | The IP to block. Supports single IP or CIDR format, e.g. `192.168.1.100` or `192.168.1.0/24`. |
| IP List | Used for batch add: one IP address per line, single IP or CIDR format. |
| Block Reason | The reason for the block, for later traceability. |
| Block Type | One of Manual, Auto, or Temporary. |
| Status | Active, Inactive, or Pending. |
| Expire Time | When the block expires. Blank (or 0) means a permanent block; records past their time are shown as expired. |
| Remarks | Custom notes. |

### Block Type

| Type | Description |
| --- | --- |
| Manual | A block added manually by an administrator. |
| Auto | A block created automatically by the system. |
| Temporary | A temporary block. |

### Status

| Status | Description |
| --- | --- |
| Active | The block rule is in effect at the system level. |
| Inactive | The block rule is disabled and no longer in effect. |
| Pending | The block rule has not taken effect yet. |

## FAQ

- **The IP is not blocked immediately after adding it?** Click **Sync Rules** to push the rules to the operating system firewall.
- **How do I make a block permanent?** Leave the expire time blank when adding or editing; the list shows it as **Permanent**.
- **How do I clean up expired records?** Click the **Clear Expired** button at the top.
