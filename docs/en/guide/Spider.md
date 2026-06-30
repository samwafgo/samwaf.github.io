# Spider (Crawler Identification Analysis)

## Overview

The Spider Analysis page counts the access share of various **crawlers (spiders) / visitors** within a selected time range, helping you identify the composition of search-engine crawlers, bots and normal visitors on your site.

The page shows the access share of each crawler type with a **pie chart**, alongside a **detail table** on the right that lists the visit count and percentage of each type, with pagination.

<!-- Image: Spider Analysis page, pie chart on the left and detail table on the right -->

## Steps

1. Select the **date range** to count at the top (presets "Last 7 Days / Last 3 Days / Today" or a custom range; defaults to today).
2. Pick the **website** to view in the dropdown; choose "Global Website" to see the total across all sites. The dropdown can be cleared.
3. Click **Search**; the pie chart and detail table refresh according to the selected conditions.
4. Browse the visit count and percentage of each crawler type page by page in the table on the right.

## Field Reference

| Field | Description |
|-------|-------------|
| Date Range | The time range to count, defaulting to today; supports preset and custom ranges. |
| Website | The site to count; choose "Global Website" to see the total across all sites. |
| Spider Type | The identified crawler/visitor category name (e.g. various search-engine crawlers, normal visitors). |
| Visit Count | The number of visits of this type within the selected range. |
| Percentage | The share of this type's visits in the total visits within the selected range. |

## FAQ

- **What if there is no data?** Make sure the selected website has access records in the date range, then widen the time range or switch to "Global Website" and search again.
- **How is the percentage calculated?** Percentage = this crawler type's visit count / total visits in the selected range x 100%.
