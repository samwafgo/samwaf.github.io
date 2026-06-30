# Data Retention Policy

## Overview

The Data Retention Policy lets you configure how long various statistics / log data are kept. SamWaf automatically cleans up historical data **every day at 04:30** according to the policies set here, preventing the database from growing without limit and consuming disk space.

As the banner at the top of the page states, policies are **preset by the system** — you can only edit the **Retain Days / Retain Rows** and the **Enabled status**. You cannot add or delete policy entries (the target table, database, time field, etc. are built in and read-only).

Cleanup works on two dimensions simultaneously:

- **By time**: data older than "Retain Days" is deleted.
- **By rows**: records exceeding the "Retain Rows" limit are deleted (generally keeping the most recent records).

Either value can be set to `0` independently to disable that dimension.

<!-- Image: Data retention policy list page -->

## Steps

1. Open the **Data Retention Policy** page; the list shows all preset cleanup policies.
2. Click **Edit** on the right to open the policy edit dialog.
3. Adjust **Retain Days** and **Retain Rows** as needed, and use the **Enabled** switch to decide whether the policy is active.
4. Optionally add a note in **Remarks**.
5. Click **Confirm** to save. The system applies the new policy on the next scheduled run (daily at 04:30).

> Note: The "Target Table" and "Database" fields in the dialog are read-only and only show which database and table the policy applies to. "Last Clean Time" and "Last Clean Rows" are read-only statistics reflecting the most recent automatic cleanup.

<!-- Image: Policy edit dialog -->

## Field Reference

| Field | Description |
|-------|-------------|
| Target Table | The database table the policy applies to (preset, read-only). |
| Database | The database the table belongs to (e.g. the stats database, read-only). |
| Retain Days | Number of days data is kept; data older than this is cleaned up. `0` means no day-based limit. |
| Retain Rows | Maximum number of rows kept; records beyond this limit are cleaned up. `0` means no row-based limit. |
| Time Field | The time column used to determine data age (preset, read-only). |
| Enabled | Whether the cleanup policy is active. When off, the table is not cleaned automatically. |
| Last Clean Time | Time of the most recent automatic cleanup; shows "Never" if it has not run yet (read-only). |
| Last Clean Rows | Number of records deleted in the most recent cleanup (read-only). |
| Remarks | Optional description. |

## FAQ

- **When does cleanup run?** Every day at 04:30, automatically via a scheduled task — no manual trigger needed.
- **What happens if both Retain Days and Retain Rows are set?** Both dimensions apply; data matching either condition is cleaned up. Set a dimension to `0` to disable it.
- **Why can't I add / delete policies?** Policy entries are preset by the system based on built-in data tables. Users may only adjust retention parameters and the enabled status, keeping the cleanup logic safe and controllable.
