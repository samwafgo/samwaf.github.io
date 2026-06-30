# Runtime Info

## Overview

The Runtime Info (Runtime Parameters) page presents SamWaf's current runtime status and system environment as a "name / value" list. It is handy for troubleshooting, confirming the version, and observing operational metrics such as queues and QPS.

The content is generated in real time by the backend and loads automatically when you open the page — no manual action is required.

<!-- Image: Runtime info list page -->

## Steps

1. Open the **System Settings → Runtime Parameters** page.
2. The page automatically loads and shows the current runtime info list.
3. Re-open or refresh the page to get the latest data.

## Field Reference

| Name | Description |
|------|-------------|
| Last log processing time | The most recent time the engine dequeued and processed a log entry; useful for spotting log-processing backlog. |
| Goroutine count | Number of goroutines in the current process, reflecting concurrency load. |
| OS type | The operating system the program runs on (e.g. windows / linux). |
| Architecture | The CPU architecture the program runs on (e.g. amd64 / arm64). |
| Compiler version | The Go version used to build the program. |
| Win7 kernel | Whether running in Win7-compatible kernel mode (Yes / No). |
| Uptime | How long SamWaf has been running since startup (days / hours / minutes / seconds). |
| Software version | The current SamWaf version name. |
| Software version code | The internal build number of the current version. |
| Current QPS | The real-time number of requests processed per second. |
| Current queue size | Pending counts of the internal queues (main data / log data / stats data / message queue). |
| Current log queue QPS | The real-time processing rate of the log queue. |
| Current web port list | The business web ports currently in use. |
| Current tunnel port list | The tunnel ports currently in use. |

> Note: All metrics above are real-time, read-only information for viewing and diagnostics only. This page does not allow editing.

## FAQ

- **How often is the data updated?** It is generated in real time by the backend each time you open or refresh the page, reflecting the current moment.
- **Is a consistently large queue size normal?** Queue size represents pending tasks; brief spikes are normal. If it stays high for a long time, there may be a disk / database write bottleneck — check it together with "Last log processing time".
- **Where do I change runtime config such as database / cache?** Runtime configuration (e.g. database driver, cache type) must be edited in `conf/config.yml` and takes effect after restarting SamWaf. This page is for viewing runtime status only.
