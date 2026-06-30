# Log File Write

## Overview

The Log File Write feature additionally outputs access logs as **standard-format text files** for analysis by third-party security tools such as CrowdSec, independent of the existing SQLite log storage.

The page has four parts: **Basic Settings** (toggle / path / format / custom template / output preview), **Log Rotation Settings**, **Log Preview** and the **Backup File List**.

<!-- Image: Log File Write page -->

## Steps

### 1. Basic Settings

1. Turn on the **Enable Log Write** toggle.
2. Enter the log file path in **Output Path** (e.g. `logs/access.log`).
3. Choose the **Log Format**: Nginx Combined, Apache Combined, or Custom Format.
4. If you choose "Custom Format", write the template in **Custom Template** using `${variable}` to reference fields. Expand **Available Variables** to see all variables; click a variable tag to copy it.
5. The **Output Preview** renders the current template's output in real time using sample values.
6. Click **Save** in the top-right to apply, or **Refresh** to reload the current configuration.

### 2. Log Rotation Settings

Configure the rotation policy and save:

- **Max File Size** (MB): rotate the file once it reaches this size.
- **Max Backups** (files): the maximum number of history files to keep.
- **Max Days** (days): the maximum number of days to keep history files.
- **Compress History**: when on, rotated history files are compressed.

### 3. Log Preview and Clear

- **Log Preview** shows the latest 100 lines of the current log file, with the current file name and size in the title; click **Refresh** to reload.
- Click **Clear** and confirm to empty the current log file.

### 4. Backup File List

- Lists rotated history log files with their size and modified time; click **Refresh** to reload.

## Field Reference

### Basic Settings

| Field | Description |
|-------|-------------|
| Enable Log Write | Whether to write access logs to a text file. |
| Output Path | The save path of the log file, e.g. `logs/access.log`. |
| Log Format | Nginx Combined / Apache Combined / Custom Format. |
| Custom Template | Filled in when Custom Format is selected, using `${variable}` to reference fields. |
| Available Variables | The list of fields usable in the template (variable / description / example); click to copy. |
| Output Preview | Renders the current template's output in real time using sample values. |

### Log Rotation Settings

| Field | Description |
|-------|-------------|
| Max File Size | The maximum size of a single log file (MB); rotated once exceeded. |
| Max Backups | The maximum number of history files to keep. |
| Max Days | The maximum number of days to keep history files. |
| Compress History | Whether to compress rotated history files. |

### Common Template Variables

| Variable | Description |
|----------|-------------|
| `${src_ip}` / `${src_port}` | Source IP / port |
| `${host}` | Accessed domain |
| `${url}` / `${raw_query}` | Request URL / raw query string |
| `${method}` / `${scheme}` | Request method / scheme |
| `${referer}` / `${user_agent}` | Referer / User-Agent |
| `${status_code}` / `${content_length}` | Response code / response content length |
| `${create_time}` / `${time_spent}` | Access time / time spent (ms) |
| `${country}` / `${province}` / `${city}` | Country / province / city |
| `${action}` / `${rule}` / `${risk_level}` | Defense result / hit rule / risk level |
| `${cookies}` / `${req_uuid}` / `${is_bot}` / `${guest_identification}` | Cookie / visit identifier / is bot / visitor identity |

> The complete variable list is shown in the page's "Available Variables" table.

## FAQ

- **Will it affect the existing logs?** No. This feature outputs an extra text file in addition to the SQLite logs; the two are independent.
- **Why use this feature?** It makes it easy to feed access logs in standard formats (Nginx/Apache, etc.) to third-party security tools such as CrowdSec for analysis and integration.
