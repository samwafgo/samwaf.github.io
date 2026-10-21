# IP Ban

## Overview

"IP Ban" merges the former **Rule Ban** and **IP Failure Ban** pages into a single entry, managing every client-IP ban by source:

- **Rule Ban**: when a protection rule hits `RF.Ban(minutes)`, the IP is temporarily banned on the current host.
- **Failure Counting**: statistics of failure status codes returned by the origin, used by the rule condition `MF.GetIPFailureCount(minutes)`; records that crossed the threshold are listed here.
- **CC Ban**: bans produced by CC protection, reusing the original CC ban list and actions.

Each source keeps its own detection and storage semantics — nothing changes under the hood; the list is only a unified entry point.

## Ban List

1. Go to **Website Protection → IP Ban**. The "Ban List" tab is shown by default.
2. Switch the **Source** between **Rule Ban / Failure Counting / CC Ban**; each source shows its own list and loads on demand.
3. Each record supports **Details** (visit logs of the IP) and **Remove**:
   - Rule Ban: removes the ban on the host of the current row;
   - Failure Counting: clears the IP's failure records, **also clears the IP's CC ban, but never rule bans** (the confirm dialog states this again);
   - CC Ban: reuses the original CC ban removal flow.

The **IP Policy Lookup** button in the page header queries all sources at once, and rule bans can be removed right from the lookup result (across all hosts of the IP).

## Configuration

The "Configuration" tab has three blocks, each saved independently:

- **Rule Ban**: ban action — `Blocking Page` (default) or `Drop Connection`; applies only to subsequent requests after a rule ban. CC ban handling is unchanged. A copyable rule example is included.
- **Failure Counting**: enable switch, failure status codes (multiple values and regular expressions supported), and data retention time (minutes). Retention is only the upper bound of the statistics window — it is **not** the `RF.Ban(minutes)` duration.
- **CC Ban**: CC trigger conditions, thresholds, scope and ban duration are still configured in **CC Protection**; this block is a shortcut link.

## Rule Examples

Ban for 10 minutes on the current host:

```
rule Rexample "Ban 10 minutes on hit" salience 10 {
    when
        MF.URL.Contains("/wp-admin") == true
    then
        RF.Ban(10);
}
```

Combined with failure counting — more than 10 failures within 5 minutes:

```
rule Rexample2 "More than 10 failures in 5 minutes, ban 10 minutes" salience 10 {
    when
        MF.GetIPFailureCount(5) > 10
    then
        RF.Ban(10);
}
```

Notes:

- `RF.Ban(minutes)` takes effect as soon as it is written in the `then` block of an **enabled** rule — no separate switch. The current request is blocked and the ban is written.
- An existing ban is **never extended** (remaining time only counts down); to re-ban, remove the ban and let the rule hit again.
- A ban applies only to the **host that triggered the rule**; other hosts are unaffected.
- In "Log Only" mode a host only records the hit without writing a ban.
- Allowlisted IPs are unaffected by rule bans.

::: tip
The legacy "Rule Ban" and "IP Failure Ban" menus are merged into this page; the old URLs redirect to the corresponding source.
:::

## Update History

| Date | Version | Description |
| --- | --- | --- |
| 2026-10-21 | >v1.3.25-beta.8 | Added the unified "IP Ban" entry merging Rule Ban and IP Failure Ban; ban list switches between rule/failure/CC sources; added the RF.Ban(minutes) rule action and ban action configuration; IP Policy Lookup supports the rule ban source and removal. |
