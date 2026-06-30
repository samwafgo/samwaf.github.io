# Cache Rule

## Overview

Cache rules cache matching requests. When a request hits a rule, the cached content is returned directly, reducing backend load and speeding up access. Different rule types suit different scenarios.

## Prerequisites

Cache rules require the **Cache** feature to be enabled on the target website first: open the website edit page, turn Cache on, and choose a cache location (memory / file / all). Only then do cache rules take effect.

<!-- Image: Cache rule list -->

## Steps

1. Click **New** at the top-left.
2. In the dialog, choose the **Website** and enter a **Rule Name**.
3. Select a **Rule Type** (Suffix Match / Specific Directory / Specific File) and fill in the matching **Rule Content** for that type.
4. Choose a **Param Type** (Ignore Parameters / Full Parameters).
5. Set the **Cache Time**, **Priority**, and **Request Method**, and add **Remarks** if needed.
6. Click **Confirm** to save.

To modify or remove a rule, use **Edit** or **Delete** in the list action column.

<!-- Image: Add cache rule dialog -->

## Field Reference

| Field | Description |
| --- | --- |
| Website | The website this cache rule belongs to. |
| Rule Name | The name of the rule, for easy identification. |
| Rule Type | The type of cache rule. Different types apply to different scenarios. |
| Rule Content | Fill in content according to the rule type: suffix match for file extensions (e.g. `.jpg`), specific directory for directory paths (e.g. `/images/`), specific file for file paths (e.g. `/index.html`). Example: `.jpg;.png;.gif` or `/images/` or `/index.html`. |
| Param Type | Whether to ignore URL parameters. When ignoring parameters, URLs with parameters share the cache with URLs without parameters. |
| Cache Time | Cache validity period in seconds. Default is 3600 seconds (1 hour). |
| Priority | Rule priority; a higher number means higher priority. Default is 1. |
| Request Method | Which HTTP request methods this rule applies to; separate multiple methods with semicolons. Default is `GET`. Example: `GET` or `GET;HEAD`. |
| Remarks | Custom notes. |

### Rule Type

| Type | Description |
| --- | --- |
| Suffix Match | Match by file extension; fill the rule content with a file extension (e.g. `.jpg`). |
| Specific Directory | Match by directory; fill the rule content with a directory path (e.g. `/images/`). |
| Specific File | Match a specific file; fill the rule content with a file path (e.g. `/index.html`). |

### Param Type

| Option | Description |
| --- | --- |
| Ignore Parameters | URLs with and without parameters share the same cache entry. |
| Full Parameters | Cache is distinguished by the full URL (including parameters). |
