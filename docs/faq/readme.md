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

为了安全，自 v1.3.10-beta.4 起为登录令牌增加了有效期。可按实际情况调整：

```
菜单路径：系统设置 -> 参数设置
token_expire_time  管理平台令牌有效期，单位分钟（默认 5 分钟）
```

令牌有两种失效情况：① 令牌到期失效；② 账号在不同 IP 登录导致旧令牌失效。

### 2.3 2FA 安全码无法登录

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
| `migratedb` | 离线迁移数据库 SQLite → MySQL（见 6.3） |
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
| `database.driver` | 数据库驱动：`sqlite`（默认）或 `mysql` |
| `database.mysql.host` / `port` | MySQL 主机与端口 |
| `database.mysql.user` / `password` | MySQL 账号与密码 |
| `database.mysql.core_db` / `log_db` / `stats_db` | 核心库 / 日志库 / 统计库的库名 |

```yaml
database:
    driver: sqlite        # sqlite（默认，零依赖） 或 mysql
    mysql:
        host: 127.0.0.1
        port: 3306
        user: root
        password: yourpassword
        core_db: samwaf_core
        log_db: samwaf_log
        stats_db: samwaf_stats
```

> 默认使用 SQLite，无需任何外部服务；如需切换到 MySQL，设 `driver: mysql` 并填写连接信息，再用 `migratedb` 迁移已有数据（见 6.3）。

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

### 6.2 版本回退

```
./SamWaf64 rollback
```

程序会列出本地历史备份版本（版本号、备份时间、大小），输入序号选择要回退的版本，确认后回退；回退完成后需手动重启服务（`start` 或 `restart`）。

### 6.3 数据库迁移（SQLite → MySQL）

先在 `conf/config.yml` 设 `database.driver: mysql` 并填好连接信息，然后执行：

```
./SamWaf64 migratedb            # 正式迁移
./SamWaf64 migratedb --dry-run  # 仅预估，不写入数据
./SamWaf64 migratedb --force    # 目标表已有数据时强制覆盖
```

### 6.4 数据库修复与 SQL 执行

```
./SamWaf64 repairdb     # 数据库损坏时尝试修复
./SamWaf64 execsql      # 在指定数据库上执行 SQL 语句
```
