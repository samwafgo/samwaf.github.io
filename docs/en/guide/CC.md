# CC Protection

## Overview

CC Protection defends against CC (Challenge Collapsar) attacks, where a single source IP sends a large number of requests to a site within a short period. SamWaf counts the requests of each IP within a configured time window and rate-limits them; IPs that exceed the threshold are temporarily banned.

CC Protection can be configured per website; selecting the global website applies the rule to all sites.

![CC Protection](/images/cc.png)

## Steps

1. Open the **CC Protection** page.
2. Click the **New CC Protection** button at the top left to open the dialog.
3. Fill in the following:
   - Select the **Website** (a specific site or the global website).
   - Enter the **Window Size** (the length of the counting period, in seconds).
   - Enter the **Limit Access Times** (the maximum number of requests allowed within the window).
   - Select the **Limit Mode** (Average Rate Mode / Sliding Window Mode). The dialog shows a real-time effect hint based on the values you enter.
   - To trigger CC protection conditionally, enable **Enable Pre-Rule** and enter the rule in **Rule Content** (you can use "Generate Rule" to help build it).
   - For non-global websites, you may enable **Skip Global CC Check**.
   - Enter the **Lock Time (Minutes)** (how long the IP is banned after hitting the limit).
   - Enter **Remarks** (optional).
4. Click **Confirm** to save.

> Use the **Website** filter above the list to search. Click **Show CC Ban IP** to view currently banned IPs and their remaining ban time, and to remove a ban.

## Field Reference

| Field | Description |
| --- | --- |
| Website | The site this CC rule applies to; a specific site or the global website. |
| Window Size | The length of the request counting period, in seconds. |
| Limit Access Times | The maximum number of requests allowed for one IP within the window; exceeding it triggers a ban. |
| Limit Mode | The rate-limiting algorithm: Average Rate Mode or Sliding Window Mode. |
| Enable Pre-Rule | When enabled, CC protection runs only for requests that match the configured rule. |
| Rule Content | The content of the pre-rule, shown when Enable Pre-Rule is on; "Generate Rule" can help build it. |
| Skip Global CC Check | Available only for non-global websites; when enabled, global CC rules are no longer checked after this site's local CC rule is triggered. |
| Lock Time (Minutes) | How long the IP is banned after hitting the limit, in minutes (minimum 1). |
| Remarks | Custom note (optional). |
| Create Time | When the record was created (generated automatically). |

### Limit Modes

- **Average Rate Mode (rate)**: distributes requests evenly per second, suitable for preventing burst attacks. For example, a window of 10 seconds with a limit of 250 requests averages about 25 requests per second.
- **Sliding Window Mode (window)**: strictly enforces the "up to M requests in N seconds" rule, which is more intuitive. For example, a window of 10 seconds with a limit of 250 requests means one IP is allowed at most 250 requests within 10 seconds, after which it is banned.

> The dialog calculates and displays the effect of the current configuration in real time based on the Window Size and Limit Access Times, helping you confirm whether the threshold meets your expectations.

## FAQ

- **How do local and global rules work together?** You can configure CC rules for an individual website or for the global website. If a site has a local rule with **Skip Global CC Check** enabled, global rules are no longer checked once the local rule is triggered.
- **How do I unban a mistakenly banned IP?** Click **Show CC Ban IP**, find the IP, and use **Remove Ban IP**.

<!-- Image: New CC Protection dialog (Website, Window Size, Limit Access Times, Limit Mode, Lock Time, etc.) -->
<!-- Image: CC ban IP list (Ban IP, remaining time, IP location, remove ban) -->
