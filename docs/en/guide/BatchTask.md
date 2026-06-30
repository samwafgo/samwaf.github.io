# Batch Tasks

## Overview

Batch tasks automatically run batch operations, executed sequentially at 5 AM every day, and can also be triggered manually. They import data from a local file or a remote URL into the system in bulk. Currently supported types are adding IP whitelist, IP blacklist, and sensitive words.

![Batch Task Interface](/images/batchtask_1.png)

## Steps

### 1. Create a Batch Task

Click the "New" button at the top left to open the dialog.

![Batch Task Add](/images/batchtask_2.png)

### 2. Fill in the Task Information

Fill in the Task Name, Website, Task Type, Extra Config, Source Type, Source Value, Execution Method, Trigger Type, and Remarks.

- When you select a different Task Type, the Extra Config field is auto-filled with the corresponding default JSON template (only the Sensitive Words type needs extra config; IP types can use `{}`).
- When the Source Type is "Local Path", enter a local file path on the server; when it is "Remote URL", enter an accessible http(s) address.

Click "Confirm" to save.

### 3. Manual Trigger

Click "Manual Trigger" on a row and confirm to run the batch task immediately, without waiting for the daily schedule.

### 4. Edit and Delete

- Click "Edit" to modify an existing batch task.
- Click "Delete" and confirm to remove the task.

## Field Reference

| Field | Description |
| --- | --- |
| Task Name | A custom name for the task (required) |
| Website | The website the task applies to, selected from the dropdown (required) |
| Task Type | Add IP Whitelist / Add IP Blacklist / Add Sensitive Words (required) |
| Extra Config | Extra configuration in JSON format. The Sensitive Words type supports `check_direction` (detection direction: in / out / all) and `action` (action after detection: deny / replace); IP types need no config (`{}`) |
| Source Type | Local Path / Remote URL (required) |
| Source Value | A local file path for Local Path, or an http(s) address for Remote URL (required) |
| Execution Method | Append (add on top of existing data) / Overwrite (clear existing data then write) (required) |
| Trigger Type | Scheduled Task (runs on the daily schedule) / Manual Task (manual trigger only) (required) |
| Remarks | Optional additional notes |

## FAQ

- **The extra config cannot be saved?** Extra Config must be valid JSON; check that brackets and quotes are complete.
- **When do scheduled tasks run?** Batch tasks with Trigger Type "Scheduled Task" run sequentially at 5 AM every day; use "Manual Trigger" to run immediately.
