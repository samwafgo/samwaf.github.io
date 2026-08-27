---
title: Run Diagnostic
icon: dashboard
---

# Run Diagnostic

## Overview

When SamWaf shows high CPU or memory usage, **Run Diagnostic** lets you inspect resource usage from the perspective of the SamWaf **process itself** (as opposed to whole-machine monitoring), and export a diagnostic package in one click to send to the developers for analysis. The always-on part (a lightweight sample every 10 seconds) has no noticeable overhead; all deep captures are triggered manually.

## Prerequisites

- Visible to the **system administrator** role only, and requires a console login (Open Platform API keys cannot access this feature).

## How to Use

Go to **System → Run Diagnostic**. The page contains five tabs:

<!-- Image: Run Diagnostic page overview (five tabs) -->

### 1. Machine

Same as the original System Monitor: whole-machine CPU, memory and disk usage. Use it to first determine whether the machine itself is under pressure or SamWaf is the one consuming resources.

### 2. SamWaf Process

Click **Refresh** to capture a snapshot of the current process:

| Card | Content |
|------|---------|
| Process | PID, uptime, process CPU, resident memory (RSS), virtual memory, threads, file handles, estimated C-side memory |
| Go Runtime | goroutines, GOMAXPROCS/CPU, heap live objects, heap in use, heap idle, stack in use, total requested from OS, GC count, total GC pause, last GC |
| Database Size | file sizes of the core / log / stats databases |

::: tip C-side Memory (est.)
The difference between RSS and the memory Go requested from the OS, mostly SQLite caches and other C-side overhead. A large value usually correlates with database size and write pressure rather than a Go memory leak.
:::

### 3. Components

Live gauges of SamWaf internals: database write queue lengths, internal channel occupancy, cache entry counts, online WebSocket connections, and WAF engine objects (hosts, certificates, ports and so on).

When a database write queue backs up, the value is highlighted in yellow (>500) or red (>5000), with a banner reminding you that memory may grow accordingly and log-database writes may be slow.

<!-- Image: Components tab (queue backlog highlight) -->

### 4. Trend

Sampled every 10 seconds, keeping the last hour (memory only, cleared on restart). The line chart contains four series - process CPU%, RSS (MB), goroutines and log queue - answering "when and how did the usage climb".

<!-- Image: Trend tab line chart -->

### 5. Diagnostic Package

- **CPU Profiling (optional)**: records the CPU time distribution for 30 seconds, down to the code line. It asks for confirmation, shows progress while sampling, and can be started **once every 5 minutes**. The result is automatically included in packages downloaded afterwards.
- **Generate & Download**: one click downloads a zip containing version info, the live snapshot, the 1-hour trend, goroutine stacks and the heap profile (plus the finished CPU profile if any). Send it to the developers to locate the resource issue.

::: tip Privacy
The package contains **no** passwords, tokens, certificate keys or any business request data - only runtime metrics and program call-stack information. It is safe to share.
:::

<!-- Image: Diagnostic Package tab (CPU profiling and download) -->

## Field Reference

| Field | Description |
|-------|-------------|
| Process CPU | CPU usage of the SamWaf process (can exceed 100% on multi-core machines) |
| Resident Memory (RSS) | Physical memory actually held by the process |
| Go Total Requested | Total memory the Go runtime requested from the OS |
| C-side Memory (est.) | RSS minus Go total requested; mostly SQLite and other C-side usage |
| Heap Live / In Use / Idle | Breakdown of the Go heap |
| Goroutines | Current goroutine count; continuous growth usually indicates a leak or blockage |
| DB Write Queues | Entries waiting to be written to the databases; sustained backlog means writes cannot keep up |

## FAQ

**Q: Does opening this page affect production performance?**

No. The only always-on part is a lightweight sample every 10 seconds (microsecond scale); snapshots and trends are collected on click and return within milliseconds. Only the manually triggered 30-second CPU profiling adds slight overhead, with a clear notice and confirmation beforehand.

**Q: Machine CPU is high but the "SamWaf Process" tab shows low CPU?**

The usage comes from other processes on the server, not SamWaf. Investigate at the machine level.

**Q: When is the best time to download a diagnostic package?**

While the problem is happening. The trend only keeps the last hour and is cleared on restart. For CPU issues, start a CPU profiling run first, wait ~30 seconds for it to finish, then download the package.
