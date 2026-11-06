# Command-Line Management

## 1 When to use it

Use the CLI to create, update, inspect, start, stop and delete websites on a local VM, in an offline environment or in deployment scripts. `site apply` matches an existing website first: it creates missing sites, merges changes into existing sites and returns `unchanged` for identical input, so the same configuration can be applied repeatedly.

Site operations go through the running SamWaf admin server and use the website management validation and hot reload. `apikey init` can create a local CLI Key offline; start the service before running `site` commands.

This feature is unreleased and requires a backend build containing these commands. Run commands from the program directory. Linux examples use `./SamWafLinux64`; Windows examples use `.\SamWaf64.exe`. Replace these with your actual executable name. Installing and controlling system services requires the appropriate system privileges.

## 2 Quick start on a new VM

### 2.1 Linux: 5 steps

1. Install the service: `./SamWafLinux64 install`.
2. Start the service: `./SamWafLinux64 start`.
3. Create the local Key: `./SamWafLinux64 apikey init`. Its value is hidden by default.
4. Save the configuration as `site.json`. This example forwards requests on local business port `8080` to a local origin on port `9112`; adjust these for your environment.

   ```bash
   cat > site.json <<'JSON'
   {
     "host": "www.example.com",
     "port": 8080,
     "remote_host": "http://127.0.0.1",
     "remote_port": 9112,
     "nickname": "demo"
   }
   JSON
   ```

5. Apply the configuration and list sites. `--wait 60s` waits for the admin server to become reachable.

   ```bash
   ./SamWafLinux64 site apply -f site.json --wait 60s
   ./SamWafLinux64 site list
   ```

   The first apply returns `created`; repeating the same input returns `unchanged`. Both exit with code `0`.

### 2.2 Windows PowerShell: 5 steps

Run PowerShell with permission to manage services:

1. Install the service: `.\SamWaf64.exe install`.
2. Start the service: `.\SamWaf64.exe start`.
3. Create the local Key: `.\SamWaf64.exe apikey init`.
4. Save the same configuration. The example contains only ASCII, so `ascii` avoids the UTF-8 BOM produced by Windows PowerShell 5.1. Save files containing non-ASCII text as UTF-8 without a BOM.

   ```powershell
   @'
   {
     "host": "www.example.com",
     "port": 8080,
     "remote_host": "http://127.0.0.1",
     "remote_port": 9112,
     "nickname": "demo"
   }
   '@ | Set-Content -Path site.json -Encoding ascii
   ```

5. Apply the configuration and list sites.

   ```powershell
   .\SamWaf64.exe site apply -f site.json --wait 60s
   .\SamWaf64.exe site list
   ```

   The first apply returns `created`; repeating it returns `unchanged`. Read `$LASTEXITCODE` immediately after the command to obtain its exit code.

## 3 Automation command reference

### 3.1 Options, references and output

| Option or reference | Meaning |
| --- | --- |
| `<ref>` | Website code or host:port, such as www.example.com:8080; use code when changing a domain or port |
| `-f file` / `-f -` | Read a JSON file / standard input, up to 10 MB; accepts one object or an array of objects |
| `-o text` / `-o json` | Output format for site and apikey, default text |
| `site --wait duration` | Retry refused connections or connection timeouts; default 0 (no retries), examples 60s or 2m; does not retry authentication or business errors |

`site` and `apikey` write results to stdout, with startup messages and logs on stderr. In text mode, errors go to stderr. In json mode, success or failure produces exactly one JSON object on stdout for scripts to parse. Values such as `site-code`, paths and fields below are illustrative.

```bash
./SamWafLinux64 site list -o json
./SamWafLinux64 site --wait 60s list
./SamWafLinux64 --help
./SamWafLinux64 site --help
./SamWafLinux64 apikey init --help
```

`--help` shows the command purpose, options and examples. An unknown command exits with code `2`; earlier versions returned `0`, so update scripts to check the new exit code.

### 3.2 apikey init

Create or reuse the local Key and save it to `data/.keys/cli_api_key` under the program directory. The Key value is hidden by default. Repeating the command reuses and enables the existing local Key.

```bash
./SamWafLinux64 apikey init
./SamWafLinux64 apikey init -o json
```

Example JSON output:

```json
{"ok":true,"action":"created","key_file":"/opt/samwaf/data/.keys/cli_api_key"}
```

`action` is `created`, `reused` or `rotated`. `--rotate` replaces the Key and invalidates the old value. `--show` writes only the Key itself to stdout for a controlled pipeline; keep that output out of logs and shared terminal recordings.

```bash
./SamWafLinux64 apikey init --rotate
./SamWafLinux64 apikey init --show
```

The rotate result reports the replacement and file location. The show result is one line containing the Key; no real Key is shown here.

### 3.3 site list

List all websites. The text table includes code, domain and port, origin, running state, protection state and nickname. Global sites carry a marker.

```bash
./SamWafLinux64 site list
./SamWafLinux64 site list -o json
```

Example JSON output:

```json
{"ok":true,"total":1,"items":[{"code":"site-code","host":"www.example.com","port":8080,"remote_host":"http://127.0.0.1","remote_port":9112,"remote_ip":"","start_status":0,"guard_status":1,"global_host":0,"nickname":"demo"}]}
```

### 3.4 site get

Export editable site JSON with sensitive fields removed. Default text mode emits the site object directly so it can be saved and edited. `-o json` wraps it as `{"ok":true,"site":{...}}`.

```bash
./SamWafLinux64 site get www.example.com:8080
./SamWafLinux64 site get www.example.com:8080 > site.json
./SamWafLinux64 site get site-code -o json
```

Excerpt of default output (actual output includes more editable fields):

```json
{
  "code": "site-code",
  "host": "www.example.com",
  "port": 8080,
  "remote_host": "http://127.0.0.1",
  "remote_port": 9112,
  "remarks": ""
}
```

### 3.5 site apply

Create a website or merge changes into an existing one. Updates replace only explicitly supplied fields and preserve omitted fields. Identical input does not submit an edit. Global sites cannot be modified with this command.

```bash
./SamWafLinux64 site apply -f site.json --wait 60s
./SamWafLinux64 site apply -f site.json -o json
printf '%s\n' '{"host":"www.example.com","port":8080,"remarks":"r2"}' | ./SamWafLinux64 site apply -f - -o json
```

Example text output:

```text
created   www.example.com:8080  code=site-code
unchanged www.example.com:8080
updated   www.example.com:8080  (remarks)
```

Example JSON structure:

```json
{"ok":true,"results":[{"index":0,"action":"updated","code":"site-code","host":"www.example.com","port":8080,"changed":["remarks"],"error":""}]}
```

### 3.6 site delete

Delete a website. A missing target returns exit code `5`.

```bash
./SamWafLinux64 site delete www.example.com:8080
```

The result shows `deleted` and the target site. Deleting it again reports that the site does not exist.

### 3.7 site start / site stop

Start or stop an individual website. These commands do not control the SamWaf system service. A site already in the requested state returns `unchanged`.

```bash
./SamWafLinux64 site stop www.example.com:8080
./SamWafLinux64 site start www.example.com:8080
```

Both return `updated` or `unchanged`. `start_status` means `0` for started and `1` for stopped. Starting fails with exit code `1` if another program occupies the port.

## 4 Site JSON fields and editing an export

| Field | Type | Purpose |
| --- | --- | --- |
| `code` | String | Stable site identifier from list/get; use when changing a domain or port |
| `host` | String | Domain such as www.example.com; without code, matches a site exactly together with port |
| `port` | Integer | Business ingress port, 1–65535 |
| `remote_host` | String | Origin address starting with http:// or https://; specify its port separately in remote_port |
| `remote_port` | Integer | Origin port, 1–65535 |
| `remote_ip` | String | Explicit origin IP, where required by the origin configuration |
| `nickname` / `remarks` | String | Site nickname / remarks |
| `ssl` | Integer | Website ingress HTTPS: 0 off, 1 on; independent of admin HTTPS |
| `bind_ssl_id` | String | ID of an SSL certificate already saved in the admin console |
| `start_status` | Integer | 0 started, 1 stopped |
| `group_code` | String | Website group code |
| `port_listens_json` | JSON string | Explicit port listener table; omitted on update means preserve the current value |
| `http_auth_json` | JSON string | Access authentication session lifetimes and similar options; contains no authentication account/password |

Each input needs either `code` or both `host` and `port`. Creating a new site also requires `host`, `port`, `remote_host` and `remote_port`. Use JSON numbers for integer fields, not strings. Where other `*_json` fields are used, retain the JSON string format emitted by get.

This first CLI phase rejects `keyfile` and `certfile` input. Save certificates in [SSL Certificate Management](../guide/SSL.md) first, then supply only `bind_ssl_id`; maintain access authentication accounts and passwords in the admin console. `http_auth_json` configures session lifetimes and similar options and can be supplied and exported. `custom_headers_json` and `custom_response_headers_json` are accepted as input, but get omits custom request/response headers and certificate/private key fields to avoid echoing credentials. Applying the export preserves those omitted fields. An export is not a full backup containing secrets.

Export, edit, then apply:

```bash
./SamWafLinux64 site get www.example.com:8080 > editable-site.json
# Edit remarks, nickname or bind_ssl_id in an editor, keeping code
./SamWafLinux64 site apply -f editable-site.json
```

Only default text-mode get output can be applied directly. With `-o json`, extract the `site` object first. Do not pass list output or an entire result wrapper to apply.

Windows PowerShell 5.1 uses UTF-16 for `>` by default. Save as UTF-8 without a BOM instead:

```powershell
$content = .\SamWaf64.exe site get www.example.com:8080
if ($LASTEXITCODE -eq 0) {
    [System.IO.File]::WriteAllText((Join-Path $PWD 'editable-site.json'), ($content -join "`n"), [System.Text.UTF8Encoding]::new($false))
}
# Edit the file, then run
.\SamWaf64.exe site apply -f editable-site.json
```

## 5 Batch arrays

`sites.json` may contain an array of objects. This example creates two sites in order:

```json
[
  {"host":"www.example.com","port":8080,"remote_host":"http://127.0.0.1","remote_port":9112},
  {"host":"www.example.com","port":8081,"remote_host":"http://127.0.0.1","remote_port":9113}
]
```

```bash
./SamWafLinux64 site apply -f sites.json -o json
```

All entries are prevalidated before submission. Invalid JSON, unknown fields, type errors or missing required fields return exit code `2` without submitting any entry. During execution, ordinary operation failures are recorded and processing continues; authentication failure or an unreachable admin server aborts processing. A batch has no transaction rollback, so successful entries remain applied. Fix failed entries and rerun as needed. Result `index` values identify input order. All success returns `0`; otherwise the first nonzero exit code is returned.

## 6 Exit codes

These stable exit codes apply to the site and apikey automation commands. Existing interactive maintenance tools retain their own result flows.

| Exit code | Meaning |
| --- | --- |
| 0 | Success, including unchanged |
| 1 | Server rejection or operation failure |
| 2 | Invalid arguments, JSON, fields or types; also an unknown command |
| 3 | Admin server unreachable or connection wait expired |
| 4 | Missing, invalid, disabled or expired Key, or failed authentication checks such as local-call requirements |
| 5 | Missing target for get/delete/start/stop |

Example JSON error:

```json
{"ok":false,"error":"Reason for failure","exit_code":4}
```

Check both the process exit code and `ok`. Do not infer success solely from HTTP status or the presence of a word in output.

## 7 Keys and local connection boundaries

- The Key comes first from `SAMWAF_API_KEY`, otherwise from `data/.keys/cli_api_key`. There is no `--api-key` argument. Keep the Key file, process environment and file permissions private.
- A local Key works independently of the global Open Platform switch, but its enabled state, expiry and Key IP whitelist still apply. Ordinary remote Keys are not enabled as a side effect.
- The CLI connects only to the admin port on `127.0.0.1`, disables HTTP system proxies and does not follow redirects. There is no remote server option. Admin HTTPS and the security entry are read automatically from configuration.
- Local Key authentication requires a loopback connection source and rejects forwarding headers, including the configured management proxy headers. These checks cannot identify headers already removed by a proxy. Restrict access in admin proxy deployments and do not forward local Key requests through a public proxy.
- Disable, delete or reset Keys in [Open Platform Key Management](../guide/OpenPlatform.md). Run apikey init again after deletion or reset to refresh the local file; use --rotate to replace the Key explicitly. Init enables the local Key again; separately review its expiry and whitelist.
- Manually created ordinary Keys can be supplied using `SAMWAF_API_KEY`; they still require the global Open Platform switch and their own access policies. A stale environment value overrides a file freshly written by init.

For example, with a Key already supplied by your controlled environment:

```bash
./SamWafLinux64 site list -o json
# Switch back to the local Key file
unset SAMWAF_API_KEY
./SamWafLinux64 site list
```

In PowerShell, clear the variable with `Remove-Item Env:SAMWAF_API_KEY -ErrorAction SilentlyContinue`. Keep real Keys out of shared scripts and version control.

## 8 Troubleshooting

| Symptom | Action |
| --- | --- |
| Cannot reach admin server / exit 3 | Check that the service is started, the CLI and service use the same program directory and configuration, and the admin port is correct; use --wait 60s for slow startup |
| HTTP 403 | Check that the management IP and domain whitelists permit 127.0.0.1, and review the Key IP whitelist |
| Invalid or disabled Key / exit 4 | Check environment precedence, status, expiry and whitelist; rerun init after a reset or deletion in the console |
| HTTPS or security entry enabled | Configuration is read automatically; no URL assembly is required and redirects are not used to discover the entry. Self-signed admin certificates are supported for the fixed local loopback connection |
| Port occupied when creating or starting a site | Check other programs and existing listeners; change the site port or free it, then retry |
| Changing a domain created another site | Identify the existing site using its stable code; a new host:port alone is matched as a new site |
| Unknown field or certificate field rejected by apply | Use sanitized default site get output, remove wrappers, and use bind_ssl_id for certificates |

## 9 Existing command groups and examples

Groups affect `--help` display only. Command names remain unchanged: **do not prepend service, maintain or datakey**. Running with no arguments still starts SamWaf in foreground/service mode. Run interactive tools in a terminal and back up relevant data before maintenance.

| Group | Command and purpose | Example | Output or result |
| --- | --- | --- | --- |
| Service management | install: install system service | `./SamWafLinux64 install` | Reports successful install when complete |
| Service management | start: start system service | `./SamWafLinux64 start` | Reports successful start when complete |
| Service management | stop: stop system service | `./SamWafLinux64 stop` | Reports successful stop when complete |
| Service management | restart: restart system service | `./SamWafLinux64 restart` | Reports successful restart when complete |
| Service management | uninstall: remove system service | `./SamWafLinux64 uninstall` | Reports successful uninstall when complete |
| Service management | rolling-restart: trigger rolling restart | `./SamWafLinux64 rolling-restart` | Reports the trigger; readiness and draining are recorded in runtime logs |
| Maintenance | resetpwd: interactive admin password reset | `./SamWafLinux64 resetpwd` | Prompts for input and reports the reset result |
| Maintenance | resetotp: interactive two-factor authentication reset | `./SamWafLinux64 resetotp` | Prompts for an account and reports the reset result |
| Maintenance | repairdb: interactive database repair | `./SamWafLinux64 repairdb` | Prompts for a database and reports repair results |
| Maintenance | execsql: interactive SQL execution | `./SamWafLinux64 execsql` | Prompts for a database and statements, then shows results |
| Maintenance | rollback: interactive restoration of a backup version | `./SamWafLinux64 rollback` | Lists backups for selection, or reports that none are available |
| Maintenance | migratedb: offline database migration | `./SamWafLinux64 migratedb --from=sqlite --to=postgres --dry-run` | Shows preflight results without migrating |
| Data keys | rekey: convert legacy fields to the current data key format | `./SamWafLinux64 rekey` | Reports processed rows; does not rotate the data key |
| Data keys | rekey-legacy: convert to the old format before downgrade | `./SamWafLinux64 rekey-legacy` | Reports rewritten rows |

`./SamWafLinux64 migratedb` prompts for a direction. Its options are `--from`, `--to`, `--dry-run` and `--force`; supported directions are SQLite → MySQL, SQLite → PostgreSQL and MySQL → PostgreSQL. See [Upgrade & Maintenance](../faq/readme.md) for requirements and backup guidance. Rollback does not provide `--list` or `--version` options.

## 10 Update history

| Date | Applicable version | Description |
| --- | --- | --- |
| 2026-11-04 | >v1.3.25-beta.9 (unreleased) | Local apikey/site commands, idempotent merging and machine-readable output; existing commands grouped in help; unknown commands now exit with code 2. |
