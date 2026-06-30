# Data Analysis (Access Analysis)

## Overview

The Data Analysis page visualizes the distribution of accesses by country/region within a selected time range using a **world map** and a **word cloud**, helping you intuitively understand where traffic comes from and how attack/allow behavior is distributed geographically.

- On the left is the world map: the darker the color, the higher the number of accesses for that country/region. You can zoom and pan the map, and hover to see the region name and access value.
- On the right is the word cloud: the size of each country/region name reflects its access weight — the more accesses, the larger the font.

<!-- Image: Data Analysis page, world map on the left and word cloud on the right -->

## Steps

1. Pick the time range under **Date** at the top. You can use the presets "Last 7 Days / Last 3 Days / Today", or set a custom start and end date.
2. In the dropdown to the right of the date, choose the **behavior type** to count (All / Block / Allow / Forbid).
3. Click **Search**; the map and word cloud refresh according to the selected conditions.
4. Move the mouse over the map to view access details for each region. An empty map means there is no matching data in the selected range.

## Field Reference

| Field | Description |
|-------|-------------|
| Date | The time range to count, defaulting to the last 7 days; supports preset and custom ranges. |
| Behavior Type | Filters the statistics by defense result: "All / Block / Allow / Forbid". |
| World Map | Access distribution aggregated by country/region; color depth represents access volume. Supports zoom, pan and hover. |
| Word Cloud | Font size represents each country/region's access weight — the more accesses, the larger the text. |

## FAQ

- **What if the map/word cloud shows no data?** Make sure there are access records of the chosen behavior type within the selected date range, then widen the time range or switch the behavior type to "All" and search again.
- **What do the behavior types mean?** "Block", "Allow" and "Forbid" correspond to how the WAF handled the access. Selecting a specific type counts only the geographic distribution of that kind of access.
