# Risk Log (Defense Log)

## Overview

The Risk Log (also called Defense Log / Attack Log) aggregates and summarizes accesses that triggered WAF protection rules, grouped by **source IP**. It helps you quickly spot attackers, view the set of rules they triggered, and drill down into the detailed access records.

The top of the page shows tabs grouped by **Triggered Rule** for quick switching between rules. You can also filter by rule and source IP.

![Defense Logs](/images/attacklog.png)

## Steps

### 1. Query and Filter

1. Use the **Triggered Rule** tabs or dropdown at the top to select the rule to view (choose "All Rules" to see everything).
2. Enter a source IP in the **IP** field for an exact lookup.
3. Click **Search** to filter, or **Reset** to clear conditions.
4. The list is sorted by first/latest access time by default; click a column header to sort.

### 2. View Access Details for an IP

- Click **Details** on a row to open the "Access IP Details" for that IP, listing the specific access/defense log records for that source IP, so you can analyze request content one by one.

### 3. Add an IP to the Block List

- Each IP in the **IP** column has an **Add to Block List** button; click and confirm to add that IP to the block list.

### 4. Delete Rule Tags

- Select a rule tag and click **Delete** to remove it. You will be asked how to delete:
  - **Tag Only**: deletes only the tag statistics; raw logs are not affected.
  - **Also Delete Logs**: deletes the tag and all related attack logs (slow for large datasets and not recoverable — use with caution).
- Click **Batch Delete** to select multiple rule tags at once; both delete modes above are supported.

## Field Reference

| Field | Description |
|-------|-------------|
| IP | The source IP that triggered the rule; an "Add to Block List" button sits next to it. |
| Blocked Count | Number of requests from this IP that were blocked by the WAF. |
| Allowed Count | Number of requests from this IP that were allowed. |
| First Access Time | The first time this IP appeared. |
| Latest Access Time | The most recent time this IP appeared. |
| Triggered Rule Set | The set of all rule tags this IP has hit. |
| Operation | Click "Details" to drill into the access details for this IP. |

> The "Triggered Rule" tags at the top come from the rule-hit tag set recorded by the system; AI Intelligent Detection hits also appear among the rule tags in the form `AI Detection:<category>`.

## FAQ

- **Why aggregate by IP instead of per request?** The Risk Log focuses on "who is attacking and which rules were triggered", and aggregating by IP makes triage faster; to see per-request content, click "Details" to enter the access details.
- **Does deleting a tag delete the logs?** It depends on the mode you choose. "Tag Only" leaves the raw logs untouched; only "Also Delete Logs" removes the related attack logs, and that is not recoverable.
