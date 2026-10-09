# OpenAPI Cookbook

A scenario-based manual for third-party systems and scripts integrating with SamWaf. Instead of listing endpoints, it is organized by "what do I want to do", with ready-to-run curl examples. New scenarios will be appended over time — see the scenario index at the end of section 1.

> For creating and managing keys, see the user manual [Open Platform](../guide/OpenPlatform.md). For the full parameter list, see the [online Swagger docs](/en/api/).

## 1 General Conventions

### 1.1 Request Basics

- **Base URL**: `http(s)://<admin-host>:26666/api/v1` (admin port defaults to 26666)
- **Authentication**: send header `X-API-Key: sk-xxxx` (created under "Open Platform → Key Management")
- No login token and no replay-protection headers required (`X-Request-Time`/`X-Request-Id` are only for the admin-token channel)
- Responses are **plain JSON** (not encrypted), always `{"code":0,"data":...,"msg":"..."}`; `code=0` means success, `code=-999` means authentication failure
- If a custom "secure access path" is enabled, URLs become `http(s)://host:port/{secure-code}/api/v1/...`

### 1.2 Pagination

Paginated endpoints take **camelCase** fields in the request body:

```json
{"pageIndex": 1, "pageSize": 50}
```

and respond with:

```json
{"code": 0, "data": {"list": [...], "total": 1, "pageIndex": 1, "pageSize": 50}, "msg": "success"}
```

### 1.3 Common Failure Codes

| code | Meaning | What to check |
|------|---------|---------------|
| `-999` | Authentication failed | Open platform disabled / wrong key / key disabled / key expired / source IP not in whitelist |
| `-1` | Business failure | See `msg` (e.g. rate limit "request frequency exceeded") |

Every call is logged under "Open Platform → Call Logs" (request/response bodies, client IP, latency) — look there first when debugging.

### 1.4 Scenario Index

| Scenario | Section | Main endpoints |
|----------|---------|----------------|
| Query blocked IPs | [Scenario 1](#_2-scenario-1-query-blocked-ips) | `ipblock/list`, `ipfailure/baniplist`, `firewall/ipblock/list`, `hostguard/ban/list` |
| Unblock an IP | [Scenario 2](#_3-scenario-2-unblock-an-ip) | `ipblock/del`, `ipfailure/removebanip`, `firewall/ipblock/del`, `hostguard/ban/release` |

## 2 Scenario 1: Query Blocked IPs

Blocked IPs live in four separate stores depending on why they were blocked. Decide which ones you need (or query all four):

| Source | Description | Persistence |
|--------|-------------|-------------|
| IP blacklist | Manual blocks / batch-task imports, long-lived | Database |
| Failure ban | Temporary ban after too many auth failures | In-memory, cleared on restart |
| Firewall ban | Pushed down to iptables / Windows Firewall | Database + OS firewall |
| Host guard ban | SSH/RDP brute-force protection | Database |

### 2.1 IP Blacklist (Application Layer)

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipblock/list" \
  -H "X-API-Key: sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"host_code":"","ip":"","pageIndex":1,"pageSize":50}'
```

- Leave `host_code` empty to query all sites, or pass a site code to scope it
- `ip` matches exactly one entry; `group_code` filters by referenced IP group

Example response:

```json
{"code":0,"data":{"list":[{"id":"a1b2...","host_code":"e680...","ip":"1.2.3.4","ip_type":"","remarks":"malicious scan","create_time":"2026-10-01 12:00:00"}],"total":1},"msg":"success"}
```

### 2.2 Failure Bans (Temporary)

```bash
curl "http://127.0.0.1:26666/api/v1/wafhost/ipfailure/baniplist" \
  -H "X-API-Key: sk-xxxxxxxx"
```

No parameters; returns all currently banned IPs with remaining time:

```json
{"code":0,"data":{"list":[{"ip":"1.2.3.4","fail_count":8,"first_time":"2026-10-09 09:00:00","last_time":"2026-10-09 09:04:11","remain_time":"26m","region":"Shanghai","trigger_minutes":10,"trigger_count":5}],"total":1},"msg":"success"}
```

### 2.3 Firewall-Level Bans

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/firewall/ipblock/list" \
  -H "X-API-Key: sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":1,"pageSize":50}'
```

Filterable by `host_code` / `ip` / `block_type` / `status`.

### 2.4 Host Guard Bans (SSH/RDP)

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/hostguard/ban/list" \
  -H "X-API-Key: sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":1,"pageSize":50}'
```

Filterable by `ip` / `source` / `status`; empty `status` returns only bans currently in effect.

## 3 Scenario 2: Unblock an IP

Each store has its own unblock endpoint. Get the record `id` from the list endpoints in Scenario 1 first.

### 3.1 Remove from IP Blacklist

```bash
# Single entry
curl "http://127.0.0.1:26666/api/v1/wafhost/ipblock/del?id=<record-id>" \
  -H "X-API-Key: sk-xxxxxxxx"

# Batch
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipblock/batch/del" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"ids":["id1","id2"]}'

# Clear the blacklist of one site (or all sites)
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipblock/delall" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"host_code":""}'
```

Deletions are pushed to the WAF engine immediately — no restart needed.

### 3.2 Release Failure / CC Temporary Bans

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipfailure/removebanip" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"ip":"1.2.3.4"}'
```

One call clears both kinds of in-memory bans: login-failure bans and CC-protection temporary bans. Calling it for an IP that is not banned also returns success (idempotent).

### 3.3 Remove a Firewall Ban

```bash
curl "http://127.0.0.1:26666/api/v1/firewall/ipblock/del?id=<record-id>" \
  -H "X-API-Key: sk-xxxxxxxx"
```

Removes the OS firewall rule first, then deletes the record. Batch variant: `POST /api/v1/firewall/ipblock/batch/del`.

### 3.4 Release a Host Guard Ban

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/hostguard/ban/release" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"id":"<ban-record-id>"}'
```

### 3.5 Notes

- **Dual-layer bans must be lifted twice**: an IP added at the "system firewall" level has independent records in both `ipblock` and `firewall/ipblock` — delete both.
- **Temporary bans expire on their own**: failure bans and CC bans carry a TTL; the manual endpoint is for when you cannot wait.
- **Blocked ≠ banned**: an IP showing 403s in the attack log is not necessarily blacklisted — if no ban record exists, there is nothing to unblock.

## 4 Scenario 3: One-Click Verification Script

The repo ships a zero-dependency Python script `SamWafTechDoc/Tool/openapicheck/openapi_verify.py` that automatically: temporarily enables the open platform → creates a temporary key → runs all four queries → exercises a block/unblock cycle → checks that a bad key is rejected → cleans up, printing a per-item report:

```bash
python openapi_verify.py --password <admin-password>
# Custom instance: python openapi_verify.py --password xxx --admin http://192.168.1.10:26666
```

Each run leaves a timestamped log under `logs/` next to the script; passwords and keys are never written in full. Useful for release regression or integrator self-service troubleshooting.

## 5 Maintainer Notes: Adding a New Scenario

1. Add one row to the scenario index (name / anchor / main endpoints).
2. Add a section following the existing layout: one-line summary → curl example → key parameters / response example → caveats.
3. curl examples always use `X-API-Key` with plain JSON; parameter names follow the json tags in the Go code (pagination is camelCase `pageIndex/pageSize`).
4. For write scenarios, always use RFC 5737 documentation-range IPs (`198.51.100.x`) so readers cannot hurt real addresses by copy-pasting.
5. Keep the Chinese version `dev/openapi-cookbook.md` in sync.
