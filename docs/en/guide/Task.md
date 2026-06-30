# Task Management

## Overview

Task management lets you view and manage the system's built-in scheduled tasks (such as SSL certificate auto renewal, cleaning up expired firewall IP block rules, deleting historical data, etc.). Each task has a configurable execution interval and specific time, supports manual execution, and lets you view its run log.

<!-- Image: Task management list -->

## Steps

### 1. View the Task List

After opening the page you will see the built-in task list, including Task Name, Interval Unit, Value, Specific Time, Task Method, and Day of Week.

### 2. Edit a Task

Click "Edit" on a row to adjust the schedule:

- Choose the "Interval Unit": Second / Minute / Hour / Day / Weekly.
- "Value" is the interval count (e.g. Interval Unit = Hour and Value = 2 means run every 2 hours).
- "Specific Time" sets the execution time, e.g. `14:30`, or multiple times separated by semicolons `08:00;20:00`.
- When the Interval Unit is "Weekly", a "Day of Week" option appears to specify which weekday to run.

> Note: The "Task Method" cannot be changed when editing (it is the built-in task identifier).

Click "Confirm" to save.

### 3. Manual Execute

Click "Manual Execute" on a row to run the task once immediately, without waiting for the scheduled time.

### 4. View / Clear Logs

Click "View Log" to open the log dialog:

- View the content and file path of the task's log.
- Click "Refresh" to refresh manually; turn on "Auto Refresh" to refresh every 5 seconds automatically.
- Click "Clear Log" to clear the current task's log.

<!-- Image: Task log dialog -->

## Field Reference

| Field | Description |
| --- | --- |
| Task Name | The name of the task |
| Interval Unit | Execution interval unit: Second / Minute / Hour / Day / Weekly |
| Value | The interval count, combined with the Interval Unit to define the frequency |
| Specific Time | The execution time, e.g. `14:30`; multiple times separated by semicolons, e.g. `08:00;20:00` |
| Task Method | The built-in task identifier (read-only when editing), mapping to a specific built-in task such as SSL certificate auto renewal or cleaning expired firewall IP block rules |
| Day of Week | Only effective when the Interval Unit is "Weekly"; specifies a day from Sunday to Saturday |

### Built-in Tasks (Task Method Reference)

| Name | Description |
| --- | --- |
| Clear Runtime QPS | Clear runtime QPS statistics |
| Clear Host QPS | Clear per-host QPS statistics |
| Database Sharding Check | Database sharding check |
| Statistics | Statistics counting |
| Delay Info Extract | Process delayed statistics info |
| Load Configuration | Load configuration info |
| Refresh WeChat Access Token | Refresh WeChat Access Token |
| Delete History Info | Delete historical info |
| Delete History Download Files | Delete historical download files |
| SSL Certificate Auto Renewal | Automatically renew SSL certificates |
| SSL Certificate Auto Load | Automatically load SSL certificates |
| Batch Task | Run batch tasks |
| SSL Certificate Expiry Check | Check SSL certificate expiration |
| Notification | Send notifications |
| Health Check | Backend health check |
| Clear CC Cache Records | Clear CC protection cache records |
| Clear Web Cache | Clear web cache |
| GC Garbage Collection | Trigger GC garbage collection |
| System Statistics Push | Push system statistics data |
| Database Monitor | Database monitoring |
| Clean Expired Firewall IP Block Rules | Clean up expired firewall IP block rules |
