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

For security, starting from v1.3.10-beta.4 the login token has an expiration time. Adjust it as needed:

```
Menu path: System Settings -> Parameter Settings
token_expire_time   Management token validity period, in minutes (default 5)
```

A token becomes invalid in two cases: ① it reaches its expiry time; ② the account logs in from a different IP, invalidating the old token.

### 2.3 2FA Secret Code Cannot Log In

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
| `migratedb` | Offline migrate the database SQLite → MySQL (see 6.3) |
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
| `database.driver` | Database driver: `sqlite` (default) or `mysql` |
| `database.mysql.host` / `port` | MySQL host and port |
| `database.mysql.user` / `password` | MySQL username and password |
| `database.mysql.core_db` / `log_db` / `stats_db` | Core / log / stats database names |

```yaml
database:
    driver: sqlite        # sqlite (default, zero-dependency) or mysql
    mysql:
        host: 127.0.0.1
        port: 3306
        user: root
        password: yourpassword
        core_db: samwaf_core
        log_db: samwaf_log
        stats_db: samwaf_stats
```

> SQLite is used by default and needs no external service. To switch to MySQL, set `driver: mysql`, fill in the connection info, then migrate existing data with `migratedb` (see 6.3).

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

### 6.2 Version Rollback

```
./SamWaf64 rollback
```

The program lists local backup versions (version, backup time, size). Enter the number of the version to roll back to and confirm; after rollback, restart the service manually (`start` or `restart`).

### 6.3 Database Migration (SQLite → MySQL)

First set `database.driver: mysql` in `conf/config.yml` with the connection info, then run:

```
./SamWaf64 migratedb            # perform migration
./SamWaf64 migratedb --dry-run  # estimate only, no data written
./SamWaf64 migratedb --force    # force overwrite when the target table already has data
```

### 6.4 Database Repair & SQL Execution

```
./SamWaf64 repairdb     # try to repair a corrupted database
./SamWaf64 execsql      # execute SQL statements on a specified database
```
