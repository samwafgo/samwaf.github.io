# 常见问题

> 下文命令示例中的可执行文件名（如 `SamWaf64` / `SamWaf64.exe`）以你实际下载的版本为准。

[[toc]]

## 一、安装部署

### 1.1 端口 80 / 443 被占用

常见于 SamWaf 与 Web 应用服务器在同一台服务器的情况。需要把原 Web 服务占用的 80 / 443 改到其他端口，再让 SamWaf 监听 80 / 443 做前置代理。

#### 集成环境

::: tabs

@tab 宝塔

需要修改两处配置：

```
文件1: /www/server/panel/vhost/nginx/0.default.conf （首次可能没有，创建一个网站后才会出现）
文件2: /www/server/panel/vhost/nginx/phpfpm_status.conf
```

也可使用「一键修改」功能自动改宝塔 Web 端口（仅 Linux），详见操作手册「一键修改」。

@tab PhpStudy

在 PhpStudy 中修改 Nginx / Apache 的监听端口为其他端口。

:::

#### 原生 Web 环境

- **Nginx**：修改 80 或 443 为其他端口。
- **IIS**：修改 80 或 443 为其他端口。
- **Apache**：修改 80 或 443 为其他端口。

---

## 二、登录与账号安全

### 2.1 忘记密码

使用命令行重置密码：

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

执行命令后，程序会列出数据库中所有账号，如果存在 `admin` 账号则默认选中，否则需手动输入序号选择要重置的账号。

示例交互如下：

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
如果你已将 `admin` 账号改名，程序会列出所有账号供你选择，输入对应序号即可完成重置。
:::

### 2.2 口令（令牌）失效

为了安全，登录令牌设有有效期。它是**空闲有效期**——每一次通过鉴权的请求都会自动续期，只有在这段时间内一直没有任何操作才会失效。可按实际情况调整：

```
菜单路径：系统设置 -> 参数设置
token_expire_time  管理平台令牌有效期，单位分钟（默认 30 分钟）
```

::: tip 填 0 表示不限制
把 `token_expire_time` 填 `0` 或负数即表示**不管控有效期**，实际按 1 年封顶（不做真正的永不过期：永不过期的会话没有任何自然收敛点，令牌一旦泄露只能人工清理）。填写超过 1 年的值同样按 1 年生效。
:::

该值早期默认为 5 分钟，因为页面空闲时不会自动发请求，很容易出现"页面开着没动几分钟就被登出"。现已把默认值调整为 30 分钟；**升级后，如果你从未改过这一项（库里仍是 5），程序会在首次启动时自动升级为 30 并在日志中提示；你自己设置过的值不会被改动。**

令牌可能失效的情况：

| 情况 | 说明 |
| --- | --- |
| 空闲超时 | 超过 `token_expire_time` 未进行任何操作 |
| 同账号重新登录 | 同一账号、同一登录类型只保留一个有效令牌，新登录会让旧令牌失效 |
| 程序重启 | 令牌保存在程序内存中，重启（含容器重建、服务重启）后需要重新登录 |
| 主动注销 / 修改密码 | 注销会立即作废令牌 |

### 2.3 设备指纹与严格 IP 绑定

「系统配置」里有两个可选的增强项，**默认都是关闭的**：

| 配置项 | 说明 |
| --- | --- |
| `enable_device_fingerprint` | 设备指纹认证。由浏览器的 User-Agent、Accept-Language、Accept-Encoding 计算指纹，与登录时不一致即拒绝请求 |
| `enable_strict_ip_binding` | 严格 IP 绑定。令牌绑定登录时的真实 IP，IP 变化即需重新登录 |

::: warning 反向代理 / CDN 后请谨慎开启
指纹用到的 `Accept-Encoding` 等请求头很容易被反向代理、CDN 改写；动态 IP、双栈 IPv4/IPv6 交替、多出口 NAT 也会让绑定的 IP 频繁变化。这两项在这类环境下开启后，容易出现莫名其妙的掉线。开启前请先确认链路稳定；开启严格 IP 绑定前，还需先在「参数设置」里正确配置**管理端可信代理网段**，否则会按代理 IP 判定。
:::

校验不通过时只会拒绝当次请求，连续多次不匹配才会作废整个会话；WebSocket、AI 助手的流式响应、带下载链接的日志导出这三类请求不参与指纹比对（它们的请求头与页面内的普通请求天然不同）。

### 2.4 2FA 安全码无法登录

使用命令行重置双因素认证（2FA）：

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

## 三、管理端配置

### 3.1 切换默认管理端口

编辑根目录 `conf/config.yml`：

```yaml
local_port: 26666   # 本地管理端口
```

修改后重启程序生效。

### 3.2 白名单配置错误导致无法访问

如果管理端 IP 白名单配置不正确，导致自己也无法访问，可编辑 `conf/config.yml`（修改前请备份）放开白名单后重启：

```yaml
security:
    ip_whitelist: 0.0.0.0/0,::/0
```

### 3.3 隐藏管理入口 / 紧急入口

`conf/config.yml` 的 `security` 段支持隐藏后台入口与保留紧急入口：

```yaml
security:
    entry_enable: false      # 是否启用自定义管理入口路径
    entry_path: mysafeurl    # 启用后，管理后台需通过 http(s)://IP:端口/mysafeurl/ 访问
    emergency_path: xxxxxx   # 紧急入口路径（忘记/误配入口时的兜底访问路径）
```

启用 `entry_enable` 后，启动日志会打印实际可访问的入口地址。


### 3.4 证书配错 + 开了「仅允许HTTPS」，打不开管理端怎么办

先看你有没有开「仅允许HTTPS」——**这个开关决定了证书坏掉时的走向**：没开会自动降级成 HTTP 让你进得去；开了则会拒绝以明文提供服务（这是有意的，见情形二）。两种情况都有明确的恢复办法，不会真的救不回来。

#### 情形一：没开「仅允许HTTPS」—— 会自动降级，不用管

启动时如果 `data/ssl/manager/domain.crt` / `domain.key` 缺失、或内容损坏、或证书与私钥不配对，SamWaf 会**自动降级为 HTTP**并在日志里打印：

```
SSL证书文件不存在，降级使用 HTTP: ...
SSL证书加载失败，降级使用 HTTP: ...
```

直接用 `http://IP:26666` 就能进去，把证书重新配好即可。

#### 情形二：开了「仅允许HTTPS」但证书不可用 —— 会拒绝服务（这是有意的）

自 v1.3.24 起，开启「仅允许HTTPS」后**不再静默降级成明文**。因为证书过期/损坏恰恰是最常见的失败方式，而运维已经显式声明过"只走 HTTPS"——此时若悄悄以 HTTP 提供服务，管理端会在无人察觉的情况下明文接受登录，口令明文过网。

此时端口仍在监听，但**不挂载任何管理端功能**，访问只会得到一段 `503` 提示（这样运维不会误以为进程挂了）：

```
管理端已开启「仅允许HTTPS」，但当前无法提供 HTTPS 服务。
原因：管理端证书加载失败：...
为避免管理端以明文提供服务，已拒绝全部 HTTP 请求。
恢复方式（任选其一，改完需重启 SamWaf）：
  1. 修复管理端证书（data/ssl/manager/domain.crt 与 domain.key）
  2. conf/config.yml 设 security.ssl_force_https: false
  3. conf/config.yml 设 security.ssl_enable: false
```

按提示三选一即可：

```yaml
security:
    # 方案A（推荐）：只解除强制跳转，HTTPS 仍可用，HTTP 也能进
    ssl_force_https: false

    # 方案B：彻底关掉 HTTPS，回到纯 HTTP
    ssl_enable: false
```

```bash
# 方案C：修复或删掉证书文件；删掉后若 ssl_force_https 仍为 true，依然会拒绝服务，
# 所以想快速进后台请配合方案A
rm data/ssl/manager/domain.crt data/ssl/manager/domain.key
```

::: warning 改完必须重启
`conf/config.yml` 只在**进程启动时**读取，改完不重启不生效。
:::

#### 情形三：证书能加载、但浏览器不认

比如用了本地证书却没在这台电脑导入根证书，或者证书 SAN 里漏了你正在用的那个地址。此时 HTTPS 是**起来了的**，「仅允许HTTPS」正常生效，HTTP 被 301 跳到 HTTPS，而 HTTPS 又被浏览器拦下。

浏览器一般还留了「高级 → 继续前往」的入口，能点进去就先进去把开关关掉；点不进去就按情形二的办法改 `conf/config.yml`。

进去之后回「系统配置 → 管理端证书」把证书配对：本地证书要检查**访问地址是否漏填**（用哪个地址访问就必须填哪个），以及根证书有没有在这台电脑上导入。

#### 情形四：连端口都不对了

如果同时还改错了端口，见 [3.1 切换默认管理端口](#_3-1-切换默认管理端口)；白名单误配见 [3.2](#_3-2-白名单配置错误导致无法访问)。这几个开关都在 `conf/config.yml` 的 `security` 段，可以一次改完再重启。
---

## 四、命令行工具

SamWaf 是单个可执行文件，除直接运行外，还支持以下子命令（在程序所在目录执行）：

| 命令 | 说明 |
| --- | --- |
| `install` | 安装为系统服务（Windows 服务 / Linux systemd 等） |
| `start` | 启动服务 |
| `stop` | 停止服务 |
| `restart` | 重启服务 |
| `uninstall` | 卸载服务 |
| `rolling-restart` | 零停机滚动重启：拉起新 Worker 就绪后旧 Worker 优雅排空退出，业务不中断 |
| `resetpwd` | 重置管理员密码（见 2.1） |
| `resetotp` | 重置双因素认证(2FA)安全码（见 2.3） |
| `repairdb` | 修复损坏的数据库 |
| `execsql` | 在指定数据库上执行 SQL 语句（支持 SELECT/UPDATE/DELETE 等） |
| `migratedb` | 离线迁移数据库：SQLite → MySQL / SQLite → PostgreSQL / MySQL → PostgreSQL（见 6.3） |
| `rollback` | 回退到历史备份版本（交互式选择） |

> 不带任何参数直接运行，则以前台/服务方式启动 SamWaf。

使用示例：

::: tabs

@tab Linux

```bash
./SamWaf64 install     # 安装服务
./SamWaf64 start       # 启动
./SamWaf64 stop        # 停止
./SamWaf64 restart     # 重启
./SamWaf64 uninstall   # 卸载
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

## 五、配置文件 conf/config.yml

主配置文件位于根目录 `conf/config.yml`，采用 YAML 格式。**修改前请备份，改动后需重启程序生效。** 主要字段如下：

### 5.1 基础

| 字段 | 说明 |
| --- | --- |
| `local_port` | 本地管理端口，默认 `26666` |
| `custom_server_name` | 自定义服务器名称，用于在通知、统计中标识本节点 |
| `export_download` | 是否允许导出下载功能 |
| `drain_time_out` | 优雅升级/重启时排空在途连接的超时时间（秒） |

### 5.2 数据库 database

| 字段 | 说明 |
| --- | --- |
| `database.driver` | 数据库驱动：`sqlite`（默认）、`mysql` 或 `postgres` |
| `database.mysql.host` / `port` | MySQL 主机与端口 |
| `database.mysql.user` / `password` | MySQL 账号与密码 |
| `database.mysql.core_db` / `log_db` / `stats_db` | 核心库 / 日志库 / 统计库的库名 |
| `database.postgres.host` / `port` | PostgreSQL 主机与端口（默认端口 `5432`） |
| `database.postgres.user` / `password` | PostgreSQL 账号与密码 |
| `database.postgres.sslmode` | SSL 模式，默认 `disable`；远程连接可用 `require` |
| `database.postgres.timezone` | 会话时区，默认 `Asia/Shanghai`（详见下方提示） |
| `database.postgres.maintenance_db` | 用于自动建库的维护库，默认 `postgres` |
| `database.postgres.core_db` / `log_db` / `stats_db` | 核心库 / 日志库 / 统计库的库名 |

```yaml
database:
    driver: sqlite        # sqlite（默认，零依赖）、mysql 或 postgres
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

> 默认使用 SQLite，无需任何外部服务；如需切换到 MySQL 或 PostgreSQL，设置对应的 `driver` 并填写连接信息，再用 `migratedb` 迁移已有数据（见 6.3）。

::: tip 数据库会自动创建
无论 MySQL 还是 PostgreSQL，只要账号有建库权限，SamWaf 启动时会自动创建 `core_db` / `log_db` / `stats_db` 这三个库，无需手工建库。若账号没有建库权限，程序会在日志中打印需要手工执行的 SQL 语句。

PostgreSQL 无法在目标库自身上执行建库操作，因此需要先连接一个已存在的库（即 `maintenance_db`，默认 `postgres`）来创建它们。
:::

::: warning PostgreSQL 的 timezone 必须配置正确
`database.postgres.timezone` 决定时间字段的显示时区。**配错不会报错**，只会让界面上所有时间（如攻击日志时间）整体偏移若干小时，很难发现。

请填写服务器所在的时区（中国大陆为 `Asia/Shanghai`）。切换到 PostgreSQL 后，请随便打开一条攻击日志，核对时间与实际时间是否一致。
:::

### 5.3 缓存 cache

| 字段 | 说明 |
| --- | --- |
| `cache.type` | 缓存类型：`memory`（默认，内存）或 `redis` |
| `cache.redis.host` / `port` / `password` / `db` | 使用 Redis 时的连接信息 |

```yaml
cache:
    type: memory          # memory（默认） 或 redis
    redis:
        host: 127.0.0.1
        port: 6379
        password: ""
        db: 0
```

### 5.4 安全 security

| 字段 | 说明 |
| --- | --- |
| `security.ip_whitelist` | 管理端访问 IP 白名单，支持 CIDR，多个用逗号分隔（如 `0.0.0.0/0,::/0` 表示放开所有） |
| `security.domain_whitelist` | 管理端访问域名白名单，多个用逗号分隔 |
| `security.manage_trusted_proxies` | 管理端可信代理网段（CIDR/IP，逗号分隔）。仅当管理请求的直连来源落在此网段内，才采信 `X-Forwarded-For`/`X-Real-IP` 识别真实客户端，防止伪造代理头绕过 IP 白名单/登录锁定；留空=不信任任何代理头。仅在本机位于反向代理之后时设置 |
| `security.cors_allow_origins` | 允许跨域(CORS)访问管理接口的来源（逗号分隔）。回环/本机（`127.0.0.1`、`localhost`）始终放行，仅需填异地部署的前端来源；留空=仅放行回环 |
| `security.entry_enable` | 是否启用自定义管理入口路径 |
| `security.entry_path` | 自定义管理入口路径（隐藏后台，见 3.3） |
| `security.emergency_path` | 紧急入口路径（兜底访问） |
| `security.ssl_enable` | 管理端是否启用 HTTPS 访问 |
| `security.ssl_force_https` | 是否强制跳转 HTTPS |
| `security.access_force_disable` | 强制关闭[统一访问认证](../guide/AccessConfig.md)的自救开关，默认 `false`。仅当「管理端也被反代进了 WAF、且统一访问认证配错把自己锁在外面」时改成 `true` 并重启即可恢复访问（等效环境变量 `SAMWAF_ACCESS_DISABLE=1`） |
| `security.host_guard_force_disable` | 强制关闭[远程防爆破](../guide/HostGuard.md)的自救开关，默认 `false`。仅当「白名单配错，自己的 IP 被 SSH 爆破防护封进了系统防火墙」时改成 `true` 并重启，即可阻止新的封禁（等效环境变量 `SAMWAF_HOSTGUARD_DISABLE=1`）。注意：它只阻止新封禁，已下发的防火墙规则仍需手工清除 |
| `security.ssl_bind_cert_id` | 管理端 HTTPS 绑定的证书 ID |

### 5.5 应用管理 application

| 字段 | 说明 |
| --- | --- |
| `application_manage` | 是否开启应用管理功能 |
| `application_allow_dirs` | 应用管理允许操作的目录（多个用逗号分隔） |
| `application_op_password` | 应用操作密码 |

### 5.6 日志 zlog

| 字段 | 说明 |
| --- | --- |
| `zlog.debug_enable` | 是否开启调试日志 |
| `zlog.outputformat` | 日志输出格式（如 `console`） |
| `zlog.db_debug_enable` | 是否开启数据库 SQL 调试日志 |

### 5.7 其他

| 字段 | 说明 |
| --- | --- |
| `notice.isenable` / `notice.title` | 系统通知开关与标题 |
| `debug_worker_header` | 调试用：在响应头标记处理请求的进程，便于验证升级时新旧 Worker 交替 |
| `soft_id` / `user_code` | 软件标识与用户码（一般自动生成，无需手动修改） |

---

## 六、升级与维护

### 6.1 零停机滚动重启

```
./SamWaf64 rolling-restart      # Linux
SamWaf64.exe rolling-restart    # Windows
```

通知运行中的 SamWaf 切换 Worker：新 Worker 就绪后，旧 Worker 优雅排空在途连接再退出，业务零中断。

### 6.2 容器（Docker）环境如何升级

::: warning 容器环境不能用界面上的"应用内升级"
容器里的程序文件位于**镜像的可写层**，界面升级下载的新程序只对**当前这个容器**有效。一旦容器被重建（`docker compose up -d`、更换镜像、重装宿主机等），程序会回退成镜像里自带的旧版本；而数据库在新版本运行期间已经完成迁移、**无法回退**，于是形成"旧程序 + 新库"的不一致状态，可能出现功能异常、日志里报"任务方法 xxx 未找到"等现象。

因此在容器环境下，界面上的升级已被禁用，点击后会给出提示与镜像更新指引。
:::

容器环境请改用**更新镜像**的方式升级：

```bash
docker compose pull
docker compose up -d
```

挂载出来的 `conf` / `data` / `logs` / `ssl` 数据不受影响。

若你确实把程序文件挂载到了卷里（升级结果能持久保留），可以自行放行：

```
菜单路径：系统设置 -> 参数设置
allow_container_selfupdate  容器环境是否允许应用内升级（0 拦截，1 允许，默认拦截）
```

::: tip 降级运行会有日志提示
程序会把每次成功启动的版本记录在数据库里。如果启动时发现**数据库记录的版本高于当前程序版本**（典型情况就是上面说的容器重建导致回退），会在启动日志中打印一条错误提示，告诉你把镜像更新到不低于该版本后重建容器。该提示只做告警，不会阻止程序启动。
:::

### 6.3 版本回退

```
./SamWaf64 rollback
```

程序会列出本地历史备份版本（版本号、备份时间、大小），输入序号选择要回退的版本，确认后回退；回退完成后需手动重启服务（`start` 或 `restart`）。

### 6.4 数据库迁移

`migratedb` 用于把已有数据离线迁移到另一种数据库，支持三条方向：

| 迁移方向 | 说明 |
| --- | --- |
| SQLite → MySQL | 从默认的内置数据库迁到 MySQL |
| SQLite → PostgreSQL | 从默认的内置数据库迁到 PostgreSQL |
| MySQL → PostgreSQL | 已在用 MySQL，改用 PostgreSQL |

::: warning 迁移前请先停止 SamWaf
迁移过程中程序若仍在运行、持续写入数据，可能导致数据不完整或丢失。

建议顺序：**停止服务 → 执行迁移 → 核对数据 → 切换驱动 → 重启服务**。
:::

**用法**：直接执行，程序会以菜单形式让你选择迁移方向，再逐项询问目标数据库的连接信息（源库若是 MySQL，也会先询问源库连接信息）：

```
./SamWaf64 migratedb
```

也可以用参数直接指定方向，跳过选择菜单：

```
./SamWaf64 migratedb --from=sqlite --to=mysql
./SamWaf64 migratedb --from=sqlite --to=postgres
./SamWaf64 migratedb --from=mysql  --to=postgres
```

**可选参数**：

| 参数 | 说明 |
| --- | --- |
| `--from=sqlite\|mysql` | 迁移源；不填则在菜单中选择 |
| `--to=mysql\|postgres` | 迁移目标；不填则在菜单中选择 |
| `--dry-run` | 只统计各表行数做预估，不写入任何数据 |
| `--force` | 目标表中已有数据时强制覆盖（默认会跳过并提示） |

建议先用 `--dry-run` 看一遍各表行数，确认无误后再正式迁移：

```
./SamWaf64 migratedb --from=sqlite --to=postgres --dry-run
./SamWaf64 migratedb --from=sqlite --to=postgres
```

**迁移完成后**：

- 程序会在 `data/` 目录生成一份迁移报告 `migration_report_<时间>.md`，逐表列出源行数、目标行数与结果，请核对是否有失败项。
- 若全部成功，程序会询问是否自动把 `conf/config.yml` 的 `database.driver` 切换到目标数据库；选择「是」后重启即可生效，无需手工改配置。
- 迁移支持**断点续传**：中途中断后重新执行同一条命令，会从上次的进度继续，不会重复导入。

::: tip 关于「跳过」的表
报告里出现「目标表不存在」或「目标已有 N 行」的跳过项属正常情况：前者是历史遗留的备份表（当前版本已不使用），后者是程序初始化时已写入默认数据的表（如 CA 服务器、数据保留策略）。确需覆盖时再使用 `--force`。
:::

### 6.5 数据库修复与 SQL 执行

```
./SamWaf64 repairdb     # 数据库损坏时尝试修复
./SamWaf64 execsql      # 在指定数据库上执行 SQL 语句
```
