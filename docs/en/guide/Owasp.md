# OWASP Rule Set Management

## Overview

The OWASP Core Rule Set (CRS) online management page manages SamWaf's built-in OWASP CRS rules (powered by the Coraza engine). It brings rule browsing, tuning, hit statistics, online upgrade, sandbox testing, change log, and usage notes together on one page, switched via the tabs at the top.

Supported capabilities include: viewing the rule list, enabling / disabling / overriding rules, adjusting thresholds and PL (Paranoia Level), online upgrades (preserving user changes), sandbox testing, hit statistics, and usage notes.

The page has 7 tabs: **Rules, Tuning, Hit Stats, Online Upgrade, Sandbox, Change Log, Usage**.

<!-- Image: OWASP rule set management page -->

## Tabs

### 1. Rules

View and manage each CRS rule.

- **Filtering**: filter by source file, severity, PL, and status (Default / Disabled / Modified); search by keyword / rule ID / description; use "My Changes" to see only rules you modified, and "Hot Reload" to apply changes immediately.
- **Actions** per rule: **View / Enable / Disable / Override / Reset**.
  - **Disable**: adds a `SecRuleRemoveById` entry to `overrides/10-disabled-rules.conf` without modifying the original rule files; takes effect after hot reload.
  - **Override**: edit the rule content using Coraza / ModSecurity syntax; saved to `overrides/20-custom-rules.conf` and **not overwritten by upstream upgrades**.
  - **AI Analyze**: optionally send the rule content and metadata to the AI assistant to explain the rule's protection intent, trigger conditions, and possible false-positive scenarios (confirm the content before sending).
- **Field meanings**: the detail view explains rule ID, execution phase (Phase 1–5), severity, Paranoia Level, tags, description, directive type, etc.

<!-- Image: Rules tab -->

### 2. Tuning

Adjust the overall behavior and thresholds of the rule engine. SamWaf's defaults are already more lenient than the official ones to reduce false positives; changes hot-reload automatically.

Key parameters:

- **Engine mode**: On (blocking) / DetectionOnly (observe only) / Off.
- **Blocking Paranoia Level**: range 1-4, higher is stricter, default 1.
- **Detection Paranoia Level**: must be ≥ the blocking PL; rules above the blocking PL are only logged, not blocked; default 2.
- **Inbound / Outbound Anomaly thresholds**: blocking is triggered only when the cumulative risk score reaches this value. Inbound official default is 5 (SamWaf is more lenient); outbound default is 4.
- **Early blocking**: when on, an extra evaluation is done in Phase 1 (after reading only the request headers). Regardless of this switch, the standard Phase 2 blocking (after reading the request body) always applies.
- **Request body size limit / in-memory limit / inspection byte limit**: control how much of the request body Coraza buffers and inspects, in bytes; `0` usually means use the default.
- **CRS transaction variables (tx.*)**: written as `SecAction setvar` to `overrides/00-tuning.conf` — safer than overriding rules directly and not lost when CRS is upgraded.

> If you only want to skip OWASP inspection for specific URLs or IPs, there is no need to change global parameters — use the "URL Whitelist" or "IP Whitelist".

<!-- Image: Tuning tab -->

### 3. Hit Stats

Counts how many times each rule was hit while running (reset to zero on restart), helping you identify high-frequency false-positive rules and providing a basis for disabling or tuning.

- Sort by total / blocked / detected counts, and view summaries such as total blocked, total detected, and the most-hit rule.
- The list shows severity, rule message, total hits, blocked, detected, last seen, etc.
- Supports "Reset" of statistics (irreversible) and a "View Rule" jump to the Rules tab.

<!-- Image: Hit stats tab -->

### 4. Online Upgrade

Pulls the latest rule package from the SamWaf upgrade server. Upgrades **preserve the rule IDs you have overridden** and only update the upstream version.

- Shows current version, latest version, whether an update is needed, last check time, and the changelog.
- Click **Check Update** to compare versions; click **Upgrade Now** to run the upgrade in the background. A push notification is sent when it completes.

<!-- Image: Online upgrade tab -->

### 5. Sandbox

Construct an HTTP request and feed it directly to the current Coraza instance to see which rules are hit and the anomaly score — useful for verifying the effect of tuning or overrides.

- Enter method, URL, headers (one `Key: Value` per line), and body, or "Load Example".
- After running, the result shows whether it was blocked, the blocking score, detection score, blocking threshold, and per-rule details (severity, score, whether it counts toward blocking, phase, rule message, rule file).
- You can **Disable / Override** a hit rule directly from the result, and diagnostic hints are provided (e.g. hit but below threshold, not counted toward blocking due to PL filtering).

<!-- Image: Sandbox tab -->

### 6. Change Log

Records rule operations initiated through the SamWaf UI or API (manually editing files is not logged here).

- The list includes time, rule ID, action type (Disable / Enable / Override / Reset / Tuning), source file, and note.
- Refresh, and jump from a record to the corresponding rule.

<!-- Image: Change log tab -->

### 7. Usage

Built-in usage notes that introduce OWASP CRS concepts and how to use each feature on this page.

## Field Reference

### Core Tuning Concepts

| Concept | Description |
|---------|-------------|
| Engine mode | On = normal blocking; DetectionOnly = log only, no blocking (canary observation); Off = Coraza fully disabled. |
| Paranoia Level (PL) | Rule strictness tier, 1–4. Higher PL means more rules and stricter detection, but more false positives. SamWaf splits it into "Blocking PL" and "Detection PL". |
| Blocking PL | The tier that actually triggers blocking, default 1. |
| Detection PL | The tier that can observe hits without blocking, for canary evaluation; must be ≥ Blocking PL, default 2. |
| Anomaly Score | CRS accumulates a score per rule by severity; blocking happens only when the total exceeds the threshold (CRITICAL=+5, ERROR=+4, WARNING=+3, NOTICE=+2). |
| Inbound threshold | Blocking is triggered when the request-side cumulative score exceeds this value; official default 5. |
| Outbound threshold | Cumulative-score threshold on the response side (leaks / errors, etc.), default 4. |
| Early blocking | Whether to do an extra evaluation in Phase 1 (when reading headers); the standard Phase 2 blocking always applies. |

### Rule Status

| Status | Description |
|--------|-------------|
| Default | Uses the original upstream CRS rule, unchanged. |
| Disabled | Removed via `SecRuleRemoveById` (written to `overrides/10-disabled-rules.conf`). |
| Modified | Overridden with custom content (written to `overrides/20-custom-rules.conf`, not overwritten by upgrades). |

## FAQ

- **Will overriding / disabling rules be overwritten by upgrades?** No. User changes are written to separate config files under `overrides/`; online upgrades only update the upstream rule package and preserve your changes.
- **Why are hit statistics empty?** Data only appears after requests pass through OWASP inspection, and statistics reset to zero on restart.
- **How do I allow certain requests without changing global parameters?** Use the "URL Whitelist" or "IP Whitelist" to skip OWASP inspection for specific URLs / IPs.
- **Do I need to restart after tuning?** No. Tuning and rule changes hot-reload automatically.
