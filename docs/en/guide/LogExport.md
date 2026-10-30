# Log Export

## Overview

Click **Export Logs** on the [Visit Log](./VisitLog.md) page to export access logs and security events from SQLite, MySQL or PostgreSQL for a selected time range. Choose JSONL, CSV or encrypted SQLite. Exports run in the background; progress, cancellation, deletion and downloads are available in the same dialog.

The export contains structured metadata from `access_log` and `security_event` only. **It excludes request/response payloads in `event_payload` and the legacy `web_logs` table.** Payloads visible in a security event's detail are not included in the export. Both tables can describe the same request, so adding their row counts does not give a count of distinct requests.

## Prerequisites

- Sign in with an active **super administrator (superAdmin)** account. Other roles and OpenAPI Keys cannot create or manage export tasks or request download tickets. Each creator can access only their own tasks.
- Enable the master switch in the running instance's `conf/config.yml`, then restart SamWaf:

```yaml
export_download: true
```

When disabled, existing tasks can still be viewed, cancelled or deleted, but new exports, tickets and downloads are blocked. The export entry remains visible. Opening it shows permission, API availability and switch status; the dialog explains how to enable the switch when it is off.

## Steps

### 1. Choose Tables and a Time Range

1. Open **Protection Logs → Visit Log** (`/waf/wafvisitlog`) and click **Export Logs**.
2. Select **Access Log (access_log)** and/or **Security Events (security_event)**. Both are selected by default; at least one is required.
3. The dialog initially fills in the **last 4 hours**. Choose **Exact time**, **Whole days**, or **All existing logs**. Whole days accepts the same start and end date and includes both dates in your browser’s time zone: from midnight on the first date to midnight after the last date, exclusive. Start with a shorter period when the dataset is large.
4. Select a format and create the task.

The interval includes its start and excludes its end (`start ≤ log time < end`), with second precision. All mode includes data only up to task creation. The export uses the choices in its own dialog; the Visit Log page's website, IP, URL, current page and archive filters do not automatically restrict it.

<!-- Image: Log Export dialog showing tables, time range and format -->

### 2. Choose a Format

| Format | Recommended use | Notes |
| --- | --- | --- |
| JSONL (default) | Large datasets, streaming scripts and data processing pipelines | One JSON object per line. Preserve 64-bit integer precision rather than converting integers to floating point. |
| CSV | Spreadsheet filtering, summaries and manual analysis | UTF-8 BOM and a header. Each part holds up to 100,000 records or about 128MiB, whichever threshold is reached first. NULL and empty strings both use empty cells. Formula-like text is prefixed with an apostrophe; long identifiers and timestamps are written as text. |
| Encrypted SQLite | Offline SQL queries with table structure | The package contains `logs.encrypted.db`. Opening it requires a compatible encrypted SQLite driver and **this instance's log database key**. No key is included. Ordinary SQLite tools cannot open it directly. This is not a one-click import or restore backup. |

JSONL rotates parts at about 256MiB. JSONL and CSV use separate directories for each table. Rotation happens between records, so a large individual record may exceed the byte threshold. Encrypted SQLite stores the selected tables in one database file and does not use those text-file rotation thresholds.

::: warning Store exports appropriately
The download is a ZIP. JSONL/CSV records are plaintext after extraction. With encrypted SQLite, only the database file is encrypted; the manifest and README remain readable. Store and transfer the files according to your log data access policy.
:::

### 3. Follow the Task

The task list shows creation time, task ID, tables and format, time range, status, phase, completed sources, written rows/bytes and expiry. Click an ID or the detail action to inspect a task.

| Status | Meaning and action |
| --- | --- |
| queued / running / packaging | Waiting, reading or packaging. Can be cancelled. Closing the dialog does not stop the task. |
| cancelling / cancelled | Cancellation is in progress or complete. Delete after cancellation finishes. |
| ready | Complete and downloadable. A zero-row export also produces valid files and a manifest. |
| partial | Some sources failed. Available data can be downloaded, but check the failed sources in the manifest before treating it as complete. |
| failed | Check the source, disk space, budgets or time limit, resolve the cause and create a new task. |
| expired | The artifact has expired. Create a new export to download it. |
| deleted | The artifact was deleted; the task record may remain temporarily. |

The admin WebSocket sends a completion notification (`LOG_EXPORT_READY`); clicking it opens the corresponding task. If a notification is missed, reopen the dialog and refresh the task list to check its actual status.

Deleting an active task may start cancellation first; delete again after cancellation completes. Wait for an active download to finish before deleting its file. Cancelling or deleting an export does not delete source logs.

### 4. Download the Package

For an unexpired `ready` or `partial` task, click download. The admin console first requests a **single-use download ticket valid for 60 seconds**, then downloads the whole ZIP. The ticket is tied to the task, account and source IP. The URL is not a permanent sharing link. If a download is interrupted, the link expires, or another copy is needed, click download again to get a new ticket.

`Range` requests, resumable transfers and parallel chunk downloads are not supported. A Range request returns `EXPORT_RANGE_UNSUPPORTED`; obtain a new ticket and download the whole package.

Artifacts are retained for **24 hours by default**; use the expiry shown on the task. After expiry, tickets and downloads are refused and the background cleanup reclaims the file. Task records may remain longer. Artifact deletion and cleanup do not replace source log retention settings.

## ZIP Layout and Integrity Checks

Example JSONL package (CSV uses `.csv`; large exports may have more parts):

```text
manifest.json
README.txt
access_log/part-000001.jsonl
security_event/part-000001.jsonl
```

A SQLite package contains `manifest.json`, `README.txt` and `logs.encrypted.db`.

The manifest records versions, task ID, format, selected tables, requested/actual time bounds, timezone, source driver and statuses, field definitions, table counts, and each data file's `name`, `rows`, `bytes` and `sha256`. The manifest and README are not themselves entries in the data-file checksum list.

After extracting, compute SHA256 for each data file and compare it with the matching entry in `manifest.json` → `files`. For example, in a terminal that provides sha256sum:

```bash
sha256sum "access_log/part-000001.jsonl"
```

The hexadecimal digest must match `sha256` exactly. File bytes and record counts should match as well. CSV headers are not data rows, and fields may contain embedded newlines, so counting text lines is not a reliable CSV record count. Per-table `counts` reports read, deduplicated, conflicting and written rows. Deduplication uses `req_uuid` within each table, with the first source read taking precedence. Rows may still overlap between the two tables.

::: tip Source snapshots and partial results
Each source uses a read-only snapshot, but snapshots for different sources are established at different times. This is **not a database backup captured at one global instant**. The manifest's `consistency` and `sources[].snapshot_time` describe this behavior.

When a source fails but others succeed, the task is marked `partial` and the manifest identifies failed sources. Missing historical tables or columns may also be reported in source statuses and `missing_columns`. Review these before analysis; fix sources and export again when a complete result is required.
:::

## Resource Budgets

Operators can set budgets under `log_export` in `conf/config.yml` and restart SamWaf. Defaults apply when omitted; invalid or out-of-range values use the defaults.

| Setting | Default | Allowed range |
| --- | --- | --- |
| queue_limit | 2 queued slots, plus 1 running task | 0–10 |
| timeout_minutes | 30 minutes | 1–120 |
| max_uncompressed_gib | 10GiB uncompressed output budget | 1–1024 |
| temp_quota_gib | 20GiB temporary-file budget per task | 1–2048 |
| min_free_gib | Keep 2GiB of free disk space | 1–1024 |
| retention_hours | Keep artifacts for 24 hours | 1–168 |
| sqlite_wal_max_gib | 2GiB source WAL pressure limit | 1–1024 |

For large datasets, first narrow the time range, then review disk space and budgets. A full queue returns `EXPORT_BUSY`. Create a new task if the executor restarts and interrupts an export.

## Legacy API Migration and FAQ

The old `GET /api/v1/waflog/attack/export` and `GET /api/v1/waflog/attack/download` endpoints return `EXPORT_API_CHANGED` with migration guidance. Update the admin console. Existing programs using a backend login Token should follow this sequence:

1. `GET /api/v1/waflog/exports/capabilities` to check `allowed/enabled/formats`.
2. `POST /api/v1/waflog/exports` with a unique `request_id`, `format`, `tables` and `range_mode`. For custom ranges, provide RFC3339 `start_time/end_time` with timezone offsets.
3. Poll `GET /api/v1/waflog/exports/:id` until `ready` or `partial`.
4. `POST /api/v1/waflog/exports/:id/download-ticket` to request a ticket.
5. Download with `GET /api/v1/waflog/exports/:id/download?ticket=...&X-Request-Time=...&X-Request-Id=...`. The Unix-second timestamp and random request ID go in the query string; generate a new request ID for each request.

Regular management APIs use X-Token and replay-protection headers. Check their business `code` as well as HTTP status; HTTP200 alone does not indicate success. The new download route uses a short-lived ticket. Migration does not grant export access to OpenAPI Keys.

- **Why is the button missing?** Check that the account is a super administrator and both frontend and backend are current. A disabled master switch is explained in the dialog.
- **Does zero rows mean failure?** No. Check the time range, timezone and retained data. An empty result still includes table structures or empty data files and a manifest.
- **Where are the full request/response payloads?** This feature is restricted to the two metadata tables; payload and legacy log tables are excluded.
- **Why did the URL stop working?** Tickets are single-use, valid for 60 seconds and tied to the source IP. Return to the task and click download again.
- **What if a hash does not match?** Download again and inspect the proxy/transfer path. Do not use an unchecked file for integrity-sensitive analysis.

## Update History

| Date | Applies to | Description |
| --- | --- | --- |
| 2026-10-29 | >v1.3.25-beta.8 | Unreleased: background exports across three log database engines, JSONL/CSV/encrypted SQLite, task management, short-lived download tickets and manifest checks. |
