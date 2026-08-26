# Common Issues

> In the command examples below, the executable name (e.g. `SamWaf64` / `SamWaf64.exe`) depends on the build you actually downloaded.

[[toc]]

## 1. Installation & Deployment

### 1.1 Port 80 / 443 Already in Use

Common when SamWaf and the web application server run on the same machine. Move the existing web server off 80 / 443 to another port, then let SamWaf listen on 80 / 443 as the front-end proxy.

#### Integrated environments

::: tabs

@tab BT Panel

Modify two configuration files:

```
File 1: /www/server/panel/vhost/nginx/0.default.conf (may not exist at first; appears after you create a site)
File 2: /www/server/panel/vhost/nginx/phpfpm_status.conf
```

You can also use the "One-Key Modify" feature to change the BT Panel web port automatically (Linux only) — see the "One-Key Modify" guide.

@tab PhpStudy

Change the Nginx / Apache listening port in PhpStudy to another port.

:::

#### Native web environments

- **Nginx**: change 80 or 443 to another port.
- **IIS**: change 80 or 443 to another port.
- **Apache**: change 80 or 443 to another port.

---

## 2. Login & Account Security

### 2.1 Forgot Password

Reset the password from the command line:

::: tabs

@tab Linux

```
./SamWaf64 resetpwd
```

@tab Windows

```
SamWaf64.exe resetpwd
```

:::

The program lists all accounts in the database. If an `admin` account exists it is selected by default; otherwise enter the number of the account to reset.

Example interaction:

```
Available accounts:
  [1] admin [default]
  [2] myuser
Please enter account number (press Enter to use default 'admin'):
Reset password for 'admin' successfully, the new password is:
xK9mP2qRtZ7w
Please keep it safe.
```

::: tip
If you have renamed the `admin` account, the program lists all accounts for you to choose from; enter the corresponding number to complete the reset.
:::

### 2.2 Token Expiration

For security, the login token has an expiration time. It is an **idle timeout** — every authenticated request slides the expiry forward, so the token only dies after that much time with no activity at all. Adjust it as needed:

```
Menu path: System Settings -> Parameter Settings
token_expire_time   Management token validity period, in minutes (default 30)
```

::: tip Set it to 0 for "no limit"
Setting `token_expire_time` to `0` or a negative number means **no expiry management**; in practice it is capped at 1 year. A truly never-expiring session has no natural end, so a leaked token could only be cleaned up by hand. Values longer than 1 year are capped at 1 year as well.
:::

This value used to default to 5 minutes. Because an idle page sends no requests, that easily led to "I left the page open for a few minutes and got logged out". The default is now 30 minutes. **After upgrading, if you never changed this item (the stored value is still 5), it is automatically raised to 30 on the first start, with a line in the log; a value you set yourself is left untouched.**

A token can become invalid in these cases:

| Case | Description |
| --- | --- |
| Idle timeout | No activity for longer than `token_expire_time` |
| Same account logs in again | Only one valid token is kept per account and login type; a new login invalidates the old token |
| Program restart | Tokens live in process memory, so a restart (including container recreation or service restart) requires logging in again |
| Logout / password change | Logging out invalidates the token immediately |

### 2.3 Device Fingerprint and Strict IP Binding

System Config offers two optional hardening switches, **both disabled by default**:

| Item | Description |
| --- | --- |
| `enable_device_fingerprint` | Device fingerprint check. The fingerprint is derived from the browser's User-Agent, Accept-Language and Accept-Encoding; a request whose fingerprint differs from the one captured at login is rejected |
| `enable_strict_ip_binding` | Strict IP binding. The token is bound to the real client IP seen at login; a change of IP requires logging in again |

::: warning Enable with care behind a reverse proxy / CDN
Headers such as `Accept-Encoding` are frequently rewritten by reverse proxies and CDNs, and dynamic IPs, dual-stack IPv4/IPv6 switching or multi-egress NAT make the bound IP change often. In such environments these two switches easily cause seemingly random logouts. Make sure the path is stable first; before enabling strict IP binding, also configure the **trusted proxy ranges** for the admin console in Parameter Settings, otherwise the proxy IP is used for the check.
:::

A failed check only rejects that single request; the session is invalidated only after several consecutive mismatches. WebSocket connections, the AI assistant's streaming responses and token-in-URL log downloads are excluded from the fingerprint check, because their headers naturally differ from ordinary in-page requests.

### 2.4 2FA Secret Code Cannot Log In

Reset Two-Factor Authentication (2FA) from the command line:

::: tabs

@tab Linux

```
./SamWaf64 resetotp
```

@tab Windows

```
SamWaf64.exe resetotp
```

:::

---

## 3. Admin Console Configuration

### 3.1 Change the Management Port

Edit `conf/config.yml` in the root directory:

```yaml
local_port: 26666   # local management port
```

Restart the program to apply.

### 3.2 Locked Out by a Wrong Whitelist

If the management IP whitelist is misconfigured and you can no longer access the console, edit `conf/config.yml` (back it up first) to open the whitelist, then restart:

```yaml
security:
    ip_whitelist: 0.0.0.0/0,::/0
```

### 3.3 Hidden Entry / Emergency Entry

The `security` section of `conf/config.yml` supports hiding the admin entry and keeping an emergency fallback path:

```yaml
security:
    entry_enable: false      # enable a custom admin entry path
    entry_path: mysafeurl    # when enabled, access the console via http(s)://IP:port/mysafeurl/
    emergency_path: xxxxxx   # emergency entry path (fallback when the entry is forgotten/misconfigured)
```

When `entry_enable` is on, the startup log prints the actual accessible entry URL.


### 3.4 Wrong certificate plus "Force HTTPS" - locked out of the console?

Start with whether "Force HTTPS" is on - **that switch decides what happens when the certificate breaks**: with it off SamWaf falls back to HTTP so you can still get in; with it on the console refuses to be served in the clear (by design, see case 2). Both situations have a documented way back in.

#### Case 1: "Force HTTPS" is off - automatic fallback, nothing to do

If `data/ssl/manager/domain.crt` / `domain.key` are missing, corrupt, or the certificate and key do not match, SamWaf **falls back to plain HTTP** at startup and logs:

```
SSL certificate file not found, falling back to HTTP: ...
Failed to load SSL certificate, falling back to HTTP: ...
```

Just use `http://IP:26666` to get in and fix the certificate.

#### Case 2: "Force HTTPS" is on and the certificate is unusable - service is refused (by design)

Since v1.3.24, turning on "Force HTTPS" means SamWaf **no longer falls back to plaintext silently**. An expired or broken certificate is the most common failure, and the operator explicitly asked for HTTPS only - quietly serving HTTP would let the console accept logins in the clear, with credentials crossing the network unnoticed.

The port stays open, but **no console functionality is mounted**; every request gets a `503` notice instead (so nobody mistakes it for a dead process):

```
The console has "Force HTTPS" enabled but cannot serve HTTPS.
Reason: failed to load the console certificate: ...
All HTTP requests are refused so the console is never served in the clear.
To recover (pick one, then restart SamWaf):
  1. Fix the console certificate (data/ssl/manager/domain.crt and domain.key)
  2. Set security.ssl_force_https: false in conf/config.yml
  3. Set security.ssl_enable: false in conf/config.yml
```

Pick one of the three:

```yaml
security:
    # Option A (recommended): only drop the forced redirect - HTTPS still works, HTTP gets you in
    ssl_force_https: false

    # Option B: turn HTTPS off entirely and go back to plain HTTP
    ssl_enable: false
```

```bash
# Option C: fix or delete the certificate files. Note that with ssl_force_https still true
# the service stays refused, so combine this with option A to get back in quickly.
rm data/ssl/manager/domain.crt data/ssl/manager/domain.key
```

::: warning A restart is required
`conf/config.yml` is only read **when the process starts**; edits do not take effect until you restart.
:::

#### Case 3: the certificate loads but the browser rejects it

For example you used a local certificate without importing the root CA on this computer, or the SAN list is missing the address you are browsing with. HTTPS **is** up, "Force HTTPS" works as intended, HTTP is redirected with a 301, and HTTPS is blocked by the browser.

Browsers usually still offer "Advanced - Proceed anyway"; if that works, go in and turn the switch off. If not, edit `conf/config.yml` as described in case 2.

Once back in, go to System Settings - Console certificate and fix it: for a local certificate, check whether an **access address is missing** (every address you browse with must be listed) and whether the root CA was imported on this computer.

#### Case 4: the port is wrong too

If you also changed the port by mistake, see [3.1 Change the Management Port](#_3-1-change-the-management-port); for a misconfigured whitelist see [3.2](#_3-2-locked-out-by-a-wrong-whitelist). All of these switches live in the `security` section of `conf/config.yml`, so you can fix them in one edit and restart once.
---

## 4. Command-Line Tools

SamWaf is a single executable. Besides running it directly, it supports the following subcommands (run from the program directory):

| Command | Description |
| --- | --- |
| `install` | Install as a system service (Windows service / Linux systemd, etc.) |
| `start` | Start the service |
| `stop` | Stop the service |
| `restart` | Restart the service |
| `uninstall` | Uninstall the service |
| `rolling-restart` | Zero-downtime rolling restart: a new Worker comes up, then the old one drains and exits — no service interruption |
| `resetpwd` | Reset the administrator password (see 2.1) |
| `resetotp` | Reset the Two-Factor Authentication (2FA) code (see 2.3) |
| `repairdb` | Repair a corrupted database |
| `execsql` | Execute SQL statements on a specified database (SELECT/UPDATE/DELETE, etc.) |
| `migratedb` | Offline database migration: SQLite → MySQL / SQLite → PostgreSQL / MySQL → PostgreSQL (see 6.3) |
| `rollback` | Roll back to a previous backup version (interactive) |

> Running with no arguments starts SamWaf in foreground/service mode.

Usage:

::: tabs

@tab Linux

```bash
./SamWaf64 install     # install service
./SamWaf64 start       # start
./SamWaf64 stop        # stop
./SamWaf64 restart     # restart
./SamWaf64 uninstall   # uninstall
```

@tab Windows

```bat
SamWaf64.exe install
SamWaf64.exe start
SamWaf64.exe stop
SamWaf64.exe restart
SamWaf64.exe uninstall
```

:::

---

## 5. Configuration File conf/config.yml

The main configuration file is `conf/config.yml` (YAML format) in the root directory. **Back it up before editing, and restart the program to apply changes.** Key fields:

### 5.1 Basics

| Field | Description |
| --- | --- |
| `local_port` | Local management port, default `26666` |
| `custom_server_name` | Custom server name, used to identify this node in notifications and statistics |
| `export_download` | Whether the export/download feature is allowed |
| `drain_time_out` | Timeout (seconds) for draining in-flight connections during graceful upgrade/restart |

### 5.2 Database

| Field | Description |
| --- | --- |
| `database.driver` | Database driver: `sqlite` (default), `mysql` or `postgres` |
| `database.mysql.host` / `port` | MySQL host and port |
| `database.mysql.user` / `password` | MySQL username and password |
| `database.mysql.core_db` / `log_db` / `stats_db` | Core / log / stats database names |
| `database.postgres.host` / `port` | PostgreSQL host and port (default port `5432`) |
| `database.postgres.user` / `password` | PostgreSQL username and password |
| `database.postgres.sslmode` | SSL mode, `disable` by default; use `require` for remote connections |
| `database.postgres.timezone` | Session time zone, `Asia/Shanghai` by default (see the warning below) |
| `database.postgres.maintenance_db` | Maintenance database used to auto-create the databases, `postgres` by default |
| `database.postgres.core_db` / `log_db` / `stats_db` | Core / log / stats database names |

```yaml
database:
    driver: sqlite        # sqlite (default, zero-dependency), mysql or postgres
    mysql:
        host: 127.0.0.1
        port: 3306
        user: root
        password: yourpassword
        core_db: samwaf_core
        log_db: samwaf_log
        stats_db: samwaf_stats
    postgres:
        host: 127.0.0.1
        port: 5432
        user: postgres
        password: yourpassword
        sslmode: disable
        timezone: Asia/Shanghai
        maintenance_db: postgres
        core_db: samwaf_core
        log_db: samwaf_log
        stats_db: samwaf_stats
```

> SQLite is used by default and needs no external service. To switch to MySQL or PostgreSQL, set the corresponding `driver`, fill in the connection info, then migrate existing data with `migratedb` (see 6.3).

::: tip Databases are created automatically
For both MySQL and PostgreSQL, SamWaf creates the three databases (`core_db` / `log_db` / `stats_db`) on startup, as long as the account has permission to create databases — no manual setup needed. If it does not, SamWaf prints the exact SQL you need to run manually in the log.

PostgreSQL cannot create a database from a connection to that same database, so it first connects to an existing one (`maintenance_db`, `postgres` by default) to create them.
:::

::: warning Set the PostgreSQL time zone correctly
`database.postgres.timezone` determines the time zone used to display timestamps. **A wrong value does not raise any error** — it silently shifts every timestamp in the UI (for example in attack logs) by a number of hours, which is easy to miss.

Set it to the time zone of your server. After switching to PostgreSQL, open any attack log entry and check that the time matches the actual time.
:::

### 5.3 Cache

| Field | Description |
| --- | --- |
| `cache.type` | Cache type: `memory` (default) or `redis` |
| `cache.redis.host` / `port` / `password` / `db` | Redis connection info when using Redis |

```yaml
cache:
    type: memory          # memory (default) or redis
    redis:
        host: 127.0.0.1
        port: 6379
        password: ""
        db: 0
```

### 5.4 Security

| Field | Description |
| --- | --- |
| `security.ip_whitelist` | Admin access IP whitelist, CIDR supported, comma-separated (e.g. `0.0.0.0/0,::/0` opens to all) |
| `security.domain_whitelist` | Admin access domain whitelist, comma-separated |
| `security.manage_trusted_proxies` | Management trusted proxy CIDRs/IPs (comma-separated). Only when a management request's direct source falls within these ranges are `X-Forwarded-For`/`X-Real-IP` trusted to identify the real client, preventing spoofed proxy headers from bypassing the IP whitelist / login lockout; empty = trust no proxy header. Set only when this instance is behind a reverse proxy |
| `security.cors_allow_origins` | Origins allowed to access the management API cross-origin (CORS), comma-separated. Loopback/local (`127.0.0.1`, `localhost`) is always allowed; only add remotely-deployed frontend origins; empty = loopback only |
| `security.entry_enable` | Enable a custom admin entry path |
| `security.entry_path` | Custom admin entry path (hides the console, see 3.3) |
| `security.emergency_path` | Emergency entry path (fallback access) |
| `security.ssl_enable` | Whether the admin console uses HTTPS |
| `security.ssl_force_https` | Whether to force redirect to HTTPS |
| `security.access_force_disable` | Emergency kill switch for [Access Authentication](../guide/AccessConfig.md), default `false`. Set it to `true` and restart only when the admin panel is proxied through the WAF and a misconfiguration locked you out (equivalent env var: `SAMWAF_ACCESS_DISABLE=1`) |
| `security.host_guard_force_disable` | Emergency kill switch for [Remote Brute-force Guard](../guide/HostGuard.md), default `false`. Set it to `true` and restart when a whitelist misconfiguration got your own IP blocked into the system firewall; this stops any new blocks (equivalent env var: `SAMWAF_HOSTGUARD_DISABLE=1`). Note it only stops new blocks — firewall rules already applied must still be removed by hand |
| `security.ssl_bind_cert_id` | Certificate ID bound to the admin HTTPS |

### 5.5 Application Management

| Field | Description |
| --- | --- |
| `application_manage` | Enable the application management feature |
| `application_allow_dirs` | Directories the application management may operate on (comma-separated) |
| `application_op_password` | Application operation password |

### 5.6 Logging (zlog)

| Field | Description |
| --- | --- |
| `zlog.debug_enable` | Enable debug logging |
| `zlog.outputformat` | Log output format (e.g. `console`) |
| `zlog.db_debug_enable` | Enable database SQL debug logging |

### 5.7 Others

| Field | Description |
| --- | --- |
| `notice.isenable` / `notice.title` | System notification switch and title |
| `debug_worker_header` | Debug: mark the handling process in the response header to verify Worker switchover during upgrades |
| `soft_id` / `user_code` | Software identifier and user code (usually auto-generated; no manual change needed) |

---

## 6. Upgrade & Maintenance

### 6.1 Zero-Downtime Rolling Restart

```
./SamWaf64 rolling-restart      # Linux
SamWaf64.exe rolling-restart    # Windows
```

Tells the running SamWaf to switch Workers: once the new Worker is ready, the old one drains in-flight connections and exits — zero interruption.

### 6.2 Upgrading in a Container (Docker)

::: warning In-app update is disabled in containers
Inside a container the binary lives in the **image's writable layer**, so an in-app update only applies to **that one container**. As soon as the container is recreated (`docker compose up -d`, a new image, host reinstall, ...) the binary rolls back to the version shipped in the image — while the database was already migrated by the newer version and **cannot roll back**. That leaves an "old program + new database" mismatch, which can surface as broken features or log lines such as "task method xxx not found".

For that reason the in-app update button is disabled in containers and shows the image-update instructions instead.
:::

In a container, upgrade by updating the image:

```bash
docker compose pull
docker compose up -d
```

The mounted `conf` / `data` / `logs` / `ssl` data is not affected.

If you really did mount the binary into a volume (so an update survives recreation), you can allow it explicitly:

```
Menu path: System Settings -> Parameter Settings
allow_container_selfupdate  Allow in-app update inside containers (0 = block, 1 = allow; blocked by default)
```

::: tip Downgraded runs are reported in the log
SamWaf records the version of every successful start in the database. If, at startup, the **version recorded in the database is newer than the running program** (typically the container-recreation rollback described above), an error line is printed telling you to update the image to at least that version and recreate the container. It is a warning only and does not prevent startup.
:::

### 6.3 Version Rollback

```
./SamWaf64 rollback
```

The program lists local backup versions (version, backup time, size). Enter the number of the version to roll back to and confirm; after rollback, restart the service manually (`start` or `restart`).

### 6.4 Database Migration

`migratedb` migrates existing data offline to another database. Three routes are supported:

| Route | Description |
| --- | --- |
| SQLite → MySQL | Move from the default built-in database to MySQL |
| SQLite → PostgreSQL | Move from the default built-in database to PostgreSQL |
| MySQL → PostgreSQL | Already on MySQL, switching to PostgreSQL |

::: warning Stop SamWaf before migrating
If SamWaf keeps running and writing data during the migration, the result may be incomplete or lose data.

Recommended order: **stop the service → run the migration → verify the data → switch the driver → restart the service**.
:::

**Usage**: run it directly and SamWaf shows a menu to pick the route, then prompts for the target database connection details one by one (if the source is MySQL, it prompts for the source connection first):

```
./SamWaf64 migratedb
```

You can also specify the route with arguments and skip the menu:

```
./SamWaf64 migratedb --from=sqlite --to=mysql
./SamWaf64 migratedb --from=sqlite --to=postgres
./SamWaf64 migratedb --from=mysql  --to=postgres
```

**Optional arguments**:

| Argument | Description |
| --- | --- |
| `--from=sqlite\|mysql` | Migration source; omit it to pick from the menu |
| `--to=mysql\|postgres` | Migration target; omit it to pick from the menu |
| `--dry-run` | Only count the rows of each table as an estimate, write nothing |
| `--force` | Overwrite even when the target table already contains data (skipped by default) |

It is a good idea to run `--dry-run` first to review the row counts, then perform the real migration:

```
./SamWaf64 migratedb --from=sqlite --to=postgres --dry-run
./SamWaf64 migratedb --from=sqlite --to=postgres
```

**After the migration**:

- A migration report `migration_report_<timestamp>.md` is written to the `data/` directory, listing the source rows, target rows and result for every table. Check it for any failures.
- If everything succeeded, SamWaf asks whether to switch `database.driver` in `conf/config.yml` to the target database for you. Answer yes and restart — no manual config edit needed.
- The migration supports **resuming**: if it is interrupted, run the same command again and it continues from where it stopped instead of importing rows twice.

::: tip About skipped tables
Entries reported as "target table does not exist" or "target already has N rows" are expected. The former are legacy backup tables no longer used by the current version; the latter are tables SamWaf already populated with defaults during initialization (such as CA servers and data retention policies). Use `--force` only if you really want to overwrite them.
:::

### 6.5 Database Repair & SQL Execution

```
./SamWaf64 repairdb     # try to repair a corrupted database
./SamWaf64 execsql      # execute SQL statements on a specified database
```
