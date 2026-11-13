# Security Operations Reports

## Overview

Security operations reports summarize all websites in the current instance by calendar day, week or month. They include request and block statistics, trends, TOP lists, operation audit summaries, and website and certificate snapshots. Reports are stored locally and can be previewed or downloaded as standalone HTML files for offline viewing and browser printing to PDF.

Open **System Settings → Security operations reports**. Only super administrators can manage reports. The Vue2 and Vue3 consoles provide the same operations.

::: warning Version requirements
The frontend entry is available in Vue2 / Vue3 `v1.3.335`. The report backend is not included in released backend versions through `v1.3.25-beta.10`. A backend with report support is required; updating only the frontend does not add backend report capabilities.
:::

## Defaults and Reporting Periods

The master switch and the daily, weekly and monthly switches are enabled by default. Reports are generated locally, and no notification subscription is created automatically.

| Type | Default generation time | Reporting period |
|------|-------------------------|------------------|
| Daily | Every day at 00:30 | Previous calendar day |
| Weekly | Every Monday at 08:00 | Previous calendar week, Monday through Sunday |
| Monthly | First day of each month at 09:00 | Previous calendar month |

Schedules and date ranges use the **server's local time zone**, which is shown on the page. The task list shows the final reporting range; the browser's time zone does not determine the period. The background scheduler checks due schedules every minute, and generation tasks may wait in a queue.

- **First enablement** starts from the current period and does not backfill periods that have already ended. For example, enabling daily reports for the first time on Wednesday allows Wednesday's report to be generated after the scheduled time on Thursday.
- Turning the master switch off and back on resets the starting point for automatic generation.
- After downtime, only the most recent completed eligible period is considered. The system does not backfill every missed period. Earlier periods can be generated manually.
- Turning off the master switch stops automatic generation. You can still save settings, generate reports manually, and view or download existing reports.

## Steps

### 1. Configure Reports

Open **Report settings**, adjust the options, and click **Save settings**.

| Setting | Default | Range or behavior |
|---------|---------|-------------------|
| Enable automatic reports | On | Controls scheduled generation |
| Daily / Weekly / Monthly | All on | Disable individual periods as needed |
| Generation times | Daily 00:30, Monday 08:00, first of month 09:00 | `HH:mm`, in the server time zone |
| Site scope | Entire instance | Includes all websites in the current instance; no per-site filter |
| Report language | Chinese | Chinese / English; controls the generated HTML language |
| TOP list size | 10 | Whole number from 5 to 50 |
| Retention | 30 days | Whole number from 1 to 365 |
| Storage quota | 500 MB | Whole number from 10 to 10240 |

Report language is separate from the console language. Changing the console language or report settings does not alter previously generated HTML.

### 2. Generate a Daily, Weekly or Monthly Report Manually

1. Open **Report tasks** and click **Generate manually**.
2. Select a report type. The previous period is selected by default; click **Previous period** to select it again.
3. Choose a **Date within period**. A daily report covers that date, a weekly report covers its calendar week, and a monthly report covers its calendar month.
4. Check the displayed **Selected period** and click **Generate manually**.
5. Once accepted, the task appears in the list. Wait for its status to update.

Only completed calendar periods are accepted. On November 13, for example, you can generate a daily report for November 12 or select any date in October to generate October's monthly report. You cannot generate November's monthly report before that month ends.

Repeated submissions for the same type and period reuse an existing queued, running, completed or partial task. Failed, expired or deleted periods can be queued again manually. Manual generation stores the report locally and does not trigger a periodic summary notification.

### 3. Review Tasks and Status

The list shows report type, ID, period, status, creation / completion times, file size and source. It refreshes every 5 seconds while the page is open. You can also click **Refresh**. Polling stops when you leave the page.

| Status | Meaning | Main actions |
|--------|---------|--------------|
| Queued | Waiting for generation | Wait or refresh |
| Running | Collecting data and generating HTML | Wait or refresh |
| Completed | A readable report is available | Preview, download, delete |
| Partial | Some data is missing or unavailable and marked in the report | Preview, download, delete; review coverage notes |
| Failed | No downloadable report was produced | Read task details, resolve the problem, then generate again or delete |
| Expired | The file was removed by retention or quota cleanup | Generate again manually or delete the record |

**Partial does not mean missing metrics are zero.** Read each section's data state and coverage notes.

### 4. Preview, Download and Print

1. Click **Preview** on a completed or partial task to view its HTML in an isolated frame.
2. Click **Download HTML** and open the saved file in a browser.
3. For a PDF, use **Print → Save as PDF** in the browser after opening the downloaded HTML. Check the print preview for long-table pagination.

The standalone HTML needs no online fonts or chart scripts. Report files are encrypted on the server. The management console verifies permissions and decrypts the file for download. The downloaded HTML opens directly offline; store it securely.

A report is a static result saved at generation time. Changing certificates, website settings, report language or the application version does not update historical HTML. To regenerate a completed period using current settings, download any copy you need to keep, delete the task, and generate it again. The result depends on the source data still retained at that time.

### 5. Delete Reports and Understand Automatic Cleanup

- After you click **Delete** and confirm, the server file is removed, the task disappears from both the list and its total count, and further downloads are unavailable. Scheduled generation does not recreate that deleted period.
- Queued and running tasks cannot be deleted.
- You can generate a deleted period again manually, but source statistics already removed cannot be restored.
- When retention or the total storage quota is exceeded, older report files are removed and their **Expired** records remain visible. Retention is measured from task creation time; the quota applies to report files stored on the server.
- Files you have already downloaded locally are unaffected by server cleanup.

::: tip An Expired record remains in the list
Automatic cleanup keeps Expired history. Delete the record if you also want it removed from the list. Expired records left by manual deletion in an early development build can also be deleted again.
:::

## Report Contents

| Section | What it shows |
|---------|---------------|
| Period summary and previous-period comparison | Requests, blocked and non-blocked requests, inbound / outbound traffic, average response time, distinct IPs and blocked IPs |
| Trend | Hourly for daily reports; daily for weekly / monthly reports. Missing intervals are not filled with zero |
| Action distribution | Totals grouped by recorded action |
| TOP lists | Blocked source IPs, rule matches, blocked paths and blocked regions |
| Operation audit | Totals by category, event and success / failure result, with readable Chinese or English labels |
| Website snapshot | Website enabled, protection and log-only states at generation time |
| Certificate snapshot | Certificate name / subject, domains, validity dates and state, so you can identify the certificate |
| Instance information and data notes | Generation time, versions, access-log mode and metric coverage notes |

Certificate names use the subject when present, then the serial number, then the certificate ID. Domains are displayed separately. States include valid, expiring soon, expired, not yet valid and unknown.

### Metric Definitions

- Reports collect existing statistical summaries, operation audit records and current website / certificate settings. They do not rebuild statistics by scanning individual access-log entries.
- Requests, traffic, trends and rankings come from statistical data. Operation audit totals come from saved audit records. Websites and certificates are **snapshots at generation time**, rather than historical settings for the reporting period.
- An IP appearing on multiple days or websites is counted once within the period. Do not add daily distinct-IP counts to obtain the period total.
- Average response time is weighted by request count, rather than calculated as the simple average of daily averages.
- Blocked counts use the actual Block action. The rule TOP list counts rule matches, including allow and verification actions, so it is not a list of block counts.
- Request / IP statistics and traffic bytes use different filtering rules and may differ from access-log entry counts. Read the report notes and see [Data Retention](./DataRetention.md) and [Visit Log](./VisitLog.md).
- Audit totals count saved records and are affected by audit write throttling. They do not represent every original operation attempt.
- Cleanup, hourly-statistics retention and unavailable data sources can limit coverage. Missing or unavailable data is not zero; regenerating a report cannot restore deleted source data.

## Configure Summary Notifications

Report generation and notification delivery are configured separately. Automatic reports stay local unless the corresponding subscription and channel are enabled.

1. Configure and enable a receiving channel in [Notify Channel](./NotifyChannel.md).
2. In [Notify Subscription](./NotifySubscription.md), find the **Daily Report / Weekly Report / Monthly Report** rows and add and enable the subscriptions you need.
3. Open a subscription's gear icon to customize its title, body, rate control or filters. Use the variables listed for that message type on the page.
4. Filter [Notify Log](./NotifyLog.md) by the report message type to review successful, failed or suppressed delivery.

Periodic notifications contain summary fields such as report ID, type, period, generation status, requests and blocked requests. They do not send the full HTML or a downloadable attachment. Super administrators download the complete report from the report page. Existing throttling, filters and quiet hours apply; successful local generation does not guarantee notification delivery.

## FAQ

**The menu is visible, but report settings cannot be loaded.**

Check frontend and backend compatibility first. Frontend `v1.3.335` includes the entry, while an older backend may not provide report endpoints. Also confirm that you are signed in as a super administrator. Other administrators and Open Platform API Keys cannot manage instance-wide reports.

**Why was yesterday's report not generated immediately after enablement?**

First enablement does not backfill completed periods. Generate an older period manually if needed. Automatic generation waits for the current period to end and the scheduled time to arrive. Check the master switch, the report-type switch, server time and time zone, and that SamWaf stays running.

**Why does an older daily report lack hourly trends, or show Partial?**

Hourly statistics and other sources have their own retention ranges. Historical data may have been cleaned up, or a data source may be temporarily unavailable. Follow the report's coverage notes rather than interpreting missing values as zero.

**The report was generated, but no notification arrived.**

Manual generation does not send periodic summaries. For scheduled generation, enable the corresponding subscription and channel, then check Notify Log for delivery results and suppression reasons. Domain, keyword and severity filters can also affect summary delivery.

**Why do I still see old content after changing the language or certificate information?**

An existing completed task for the same period is reused, and historical HTML is not redrawn. Save any file you need to keep, delete the task, and generate that period again manually.

## Update History

| Updated | Applicable version | Changes |
|---------|--------------------|---------|
| 2026-11-13 | Backend > v1.3.25-beta.10 (unreleased); Vue2 / Vue3 frontend v1.3.335 | Documented daily, weekly and monthly settings, generation, preview, download / printing, deletion and cleanup; added certificate / audit display, metric definitions and summary notifications |

`vX.Y.Z` means the feature is available starting with that version. `> vX.Y.Z` means it has been merged into the code but has not yet shipped. Check the backend and frontend versions separately.
