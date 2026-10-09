# Source & Path Analysis

## Overview

Source & Path Analysis rolls up access logs **per day** and presents the traffic from two complementary angles:

- **Behaviour - who is hitting you**: per source (IP), showing requests, blocks, backend 4xx, how many distinct paths it touched, and how many User-Agents it used.
- **Target - what is being hit**: per path template, showing requests, blocks, how many distinct sources hit it, and which rule it triggered most.

Both tables come from the same daily rollup with a different grouping dimension, so the two angles always agree with each other.

::: tip How this differs from the access log
This page is a **daily** rollup with no timestamps. It answers "who was most active yesterday, which endpoint got probed the most".
For the content of one individual request, or times down to the second, use the [Access Log](./VisitLog.md).
:::

The rollups are accumulated as logs are written and **never scan the raw log tables**, so this page still has complete
data even when the access log mode on the access log page is set to "Sampled" or "Security events only".

<!-- Image: Source & Path Analysis page with the query bar, thresholds, four summary cards and two tables -->

## Prerequisites

- Rollups only accumulate from traffic **after this feature is in place**; historical logs are not backfilled. The page is empty right after upgrading and gives a complete picture of yesterday once a full day has passed.
- Plain requests silenced by an "exclude IP when logging" list write no log row and therefore never reach these rollups (see the log settings section of the [Access Log](./VisitLog.md)).

## Steps

### 1. Choose the scope

The query bar at the top holds, in order:

1. **Date** - which day to look at, today by default.
2. **Site** - leave empty for all sites, or pick one.
3. **Top** - how many rows each table returns: 20 / 50 / 100.
4. Click **Search** to refresh.

### 2. Adjust the thresholds (optional)

The second card holds two verdict thresholds; changing either recalculates the page immediately:

- **Distinct paths >= N flags a directory scan** - a source that touched more than N distinct paths in one day gets the "Directory scan" tag.
- **User agents >= N flags UA rotation** - a source that used more than N User-Agents gets the "UA rotation" tag.

**Save as default** stores the current two numbers so they are used next time you open the page.

::: warning Thresholds only affect what you see
These two numbers change the tags and filtering on this page only. They **never change how the WAF blocks traffic**
and never create a ban. To actually block, use the block action in the table, or configure a rule in the relevant protection settings.
:::

### 3. Read the summary cards

| Card | Meaning |
|------|---------|
| Sources | Distinct IPs seen that day. |
| Path templates | Distinct paths after normalization. |
| Likely directory scan | Number of sources whose distinct-path count reached the threshold. **Click to filter** the tables below to just those sources. |
| Likely UA rotation | Number of sources whose User-Agent count reached the threshold. **Click to filter.** |

Clicking the selected card again clears the filter.

### 4. Behaviour: who is hitting you

The table is sorted by distinct paths descending, so scanners surface first. Numbers past a threshold are
highlighted, and the Verdict column shows one of "Directory scan", "UA rotation" or "Has blocks".

- Click a **Source** to open the source detail drawer.
- The action column offers **Block** and **Allowlist** for that IP on the spot.

### 5. Target: what is being hit

Grouped by path template. Paths are **normalized** before being rolled up - numeric segments, UUIDs and hex strings
become placeholders, so `/user/1001` and `/user/1002` collapse into one row.

Each site is capped at 5000 templates per day, and everything beyond that lands in a single `{overflow}` row,
tagged "template cap reached". Seeing it usually means the site is being scanned with a flood of random paths.

### 6. Drill down

Clicking a source or path opens a drawer with that object's detail for the day:

- **Source detail**: the paths it touched, the User-Agents it used, the sites it hit, plus actions (Block / Allowlist / Raw logs).
- **Path detail**: who hit it, and which rules were triggered.

### 7. Block or allowlist

**Block** and **Allowlist** open the shared IP disposal dialog. You **must pick a site** - SamWaf's block and
allow lists apply per site, and an IP aggregated across sites needs you to say which site it belongs under.
The "Sites it hit" table in the source drawer is there to make that choice.

## Field Reference

### Query conditions

| Field | Description |
|-------|-------------|
| Date | Which day's rollup to show; daily granularity. |
| Site | Filter by site; empty means all sites. |
| Top | Maximum rows per table (20 / 50 / 100). |
| Distinct paths >= | Threshold for the "Directory scan" verdict; can be saved as the default. |
| User agents >= | Threshold for the "UA rotation" verdict; can be saved as the default. |

### Behaviour columns

| Field | Description |
|-------|-------------|
| Source | Source identifier, currently the source IP. Click to drill down. |
| Requests | Total requests from that source that day. |
| Blocked | How many of them the WAF blocked. |
| Backend 4xx | How many got a 4xx from the backend; high when probing paths that do not exist. |
| Distinct paths | How many distinct path templates it touched; highlighted at the threshold. |
| UAs | How many distinct User-Agents it used; highlighted at the threshold. |
| Verdict | Directory scan / UA rotation / Has blocks, derived from the thresholds and the block count. |
| Actions | Block / Allowlist. |

### Target columns

| Field | Description |
|-------|-------------|
| Path template | The normalized path. `{overflow}` is the catch-all row once the daily template cap is reached. |
| Requests | Total requests to that path that day. |
| Blocked | How many of them were blocked. |
| Backend 4xx | How many got a 4xx from the backend. |
| Distinct sources | How many different IPs requested it. |
| Top rule | The rule triggered most often on that path. |

## FAQ

- **The numbers here do not match the access log page.** This page is a daily rollup (distinct counts are computed at
  read time) while the access log is request by request, so the two measure different things. Also, plain requests
  silenced by an "exclude IP when logging" list write no log row and never reach the rollups, while their traffic
  bytes are still counted in traffic statistics.
- **Why did my path turn into something like `/user/{num}`?** That is normalization. Without it, URLs carrying IDs
  would fill the table and no pattern would be visible.
- **Do I need to act on `{overflow}`?** It means the site reached the 5000 path-template cap for that day, usually
  because it is being scanned with random paths. Use the behaviour angle to find the source, then decide.
- **Does a "Directory scan" verdict ban anything automatically?** No. Verdicts are labels on this page only;
  acting on them is your call via Block.
- **The page is empty right after upgrading.** Rollups start accumulating only from traffic after the upgrade;
  historical logs are not backfilled, so give it a full day.
