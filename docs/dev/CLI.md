# 命令行管理

## 1 适用场景

命令行适合在本机虚拟机、离线环境或部署脚本中创建、更新、查询、启停和删除网站。`site apply` 会先匹配已有网站：不存在则创建，存在则合并修改，内容相同则返回 `unchanged`，可重复执行同一份配置。

站点操作通过运行中的 SamWaf 管理端完成，沿用网站管理的校验和热加载。`apikey init` 可离线创建本机命令行 Key；运行 `site` 命令前必须先启动服务。

本文功能尚未发布，需使用包含这些命令的后端版本。以下命令在程序目录执行；Linux 使用 `./SamWafLinux64`，Windows 使用 `.\SamWaf64.exe`，请替换为实际文件名。安装和控制系统服务需相应系统权限。

## 2 全新虚拟机快速开始

### 2.1 Linux：5 步

1. 安装服务：`./SamWafLinux64 install`。
2. 启动服务：`./SamWafLinux64 start`。
3. 创建本机 Key：`./SamWafLinux64 apikey init`，默认不显示 Key 内容。
4. 保存网站配置为 `site.json`。示例将本机业务入口 `8080` 的请求转发到本机源站 `9112`，请按实际环境修改。

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

5. 应用并查看网站；`--wait 60s` 用于等待管理端就绪。

   ```bash
   ./SamWafLinux64 site apply -f site.json --wait 60s
   ./SamWafLinux64 site list
   ```

   首次输出 `created`；重复应用相同配置输出 `unchanged`，退出码均为 `0`。

### 2.2 Windows PowerShell：5 步

在具有服务管理权限的 PowerShell 中执行：

1. 安装服务：`.\SamWaf64.exe install`。
2. 启动服务：`.\SamWaf64.exe start`。
3. 创建本机 Key：`.\SamWaf64.exe apikey init`。
4. 保存同样的网站配置。此处全部为 ASCII，使用 `ascii` 避免 Windows PowerShell 5.1 的 UTF-8 BOM；含中文的文件请保存为 UTF-8 无 BOM。

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

5. 应用并查看网站。

   ```powershell
   .\SamWaf64.exe site apply -f site.json --wait 60s
   .\SamWaf64.exe site list
   ```

   首次输出 `created`，再次执行输出 `unchanged`。用 `$LASTEXITCODE` 取得刚执行命令的退出码。

## 3 自动化命令参考

### 3.1 参数、标识与输出

| 参数或标识 | 说明 |
| --- | --- |
| `<ref>` | 网站 code，或 host:port，如 `www.example.com:8080`；改域名或端口时建议用 code 定位 |
| `-f file` / `-f -` | 从 JSON 文件 / 标准输入读取，最大 10 MB，支持单个对象或对象数组 |
| `-o text` / `-o json` | site、apikey 的输出格式，默认 text |
| `site --wait duration` | 管理端连接拒绝或连接超时时等待重试，默认 0（不重试），如 60s、2m；不重试认证或业务错误 |

`site`、`apikey` 的结果写 stdout，启动信息及日志走 stderr。text 模式的错误写 stderr；json 模式的成功或失败都只向 stdout 输出一个 JSON 对象，适合脚本解析。以下输出中的 `site-code`、路径和字段仅为示例。

```bash
./SamWafLinux64 site list -o json
./SamWafLinux64 site --wait 60s list
./SamWafLinux64 --help
./SamWafLinux64 site --help
./SamWafLinux64 apikey init --help
```

`--help` 输出该命令的用途、参数和示例。未知命令返回退出码 `2`；旧版对此返回 `0`，脚本应检查新的退出码。

### 3.2 apikey init

创建或复用本机 Key，并保存到程序目录下的 `data/.keys/cli_api_key`；默认不打印密钥。再次执行会复用已有本机 Key，并启用该 Key。

```bash
./SamWafLinux64 apikey init
./SamWafLinux64 apikey init -o json
```

JSON 输出示例：

```json
{"ok":true,"action":"created","key_file":"/opt/samwaf/data/.keys/cli_api_key"}
```

`action` 为 `created`、`reused` 或 `rotated`。`--rotate` 更换 Key，旧值随即失效；`--show` 仅向 stdout 输出 Key 本身，用于受控管道，勿将其输出录入日志或共享终端记录。

```bash
./SamWafLinux64 apikey init --rotate
./SamWafLinux64 apikey init --show
```

`--rotate` 的结果显示 Key 已更换及文件位置；`--show` 的结果为一行密钥，此处不展示真实值。

### 3.3 site list

列出所有网站。text 列表包含网站编码、域名与端口、源站、运行状态、防护状态和昵称；全局网站带标记。

```bash
./SamWafLinux64 site list
./SamWafLinux64 site list -o json
```

JSON 输出示例：

```json
{"ok":true,"total":1,"items":[{"code":"site-code","host":"www.example.com","port":8080,"remote_host":"http://127.0.0.1","remote_port":9112,"remote_ip":"","start_status":0,"guard_status":1,"global_host":0,"nickname":"demo"}]}
```

### 3.4 site get

导出单个网站的可编辑 JSON，已移除敏感字段。默认 text 模式直接输出网站对象，便于保存后编辑；`-o json` 则返回 `{"ok":true,"site":{...}}` 封装。

```bash
./SamWafLinux64 site get www.example.com:8080
./SamWafLinux64 site get www.example.com:8080 > site.json
./SamWafLinux64 site get site-code -o json
```

默认输出的节选示例（实际包含更多允许编辑的字段）：

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

创建或合并更新网站。更新时只覆盖输入中显式提供的字段，未提供的字段保留；相同内容不重复提交修改。不支持通过此命令修改全局网站。

```bash
./SamWafLinux64 site apply -f site.json --wait 60s
./SamWafLinux64 site apply -f site.json -o json
printf '%s\n' '{"host":"www.example.com","port":8080,"remarks":"r2"}' | ./SamWafLinux64 site apply -f - -o json
```

text 输出示例：

```text
created   www.example.com:8080  code=site-code
unchanged www.example.com:8080
updated   www.example.com:8080  (remarks)
```

JSON 输出结构示例：

```json
{"ok":true,"results":[{"index":0,"action":"updated","code":"site-code","host":"www.example.com","port":8080,"changed":["remarks"],"error":""}]}
```

### 3.6 site delete

删除指定网站。目标不存在时返回退出码 `5`。

```bash
./SamWafLinux64 site delete www.example.com:8080
```

结果显示 `deleted` 和目标网站；再次删除同一目标返回“网站不存在”。

### 3.7 site start / site stop

启动或停止指定网站，不影响 SamWaf 系统服务。目标已经处于所需状态时返回 `unchanged`。

```bash
./SamWafLinux64 site stop www.example.com:8080
./SamWafLinux64 site start www.example.com:8080
```

两条命令的结果均为 `updated` 或 `unchanged`。`start_status` 为 `0` 表示启动、`1` 表示停止；启动时端口被其他程序占用则失败，退出码 `1`。

## 4 网站 JSON 字段与导出后编辑

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| `code` | 字符串 | 稳定网站标识，可从 list/get 取得；适合在改域名或端口时定位 |
| `host` | 字符串 | 域名，如 www.example.com；无 code 时与 port 一起精确匹配已有网站 |
| `port` | 整数 | 业务入口端口，范围 1–65535 |
| `remote_host` | 字符串 | 源站地址，带 http:// 或 https://，端口另填 remote_port |
| `remote_port` | 整数 | 源站端口，范围 1–65535 |
| `remote_ip` | 字符串 | 指定源站 IP，可按源站配置需要填写 |
| `nickname` / `remarks` | 字符串 | 网站昵称 / 备注 |
| `ssl` | 整数 | 网站入口 HTTPS：0 关闭、1 开启，与管理端 HTTPS 独立 |
| `bind_ssl_id` | 字符串 | 绑定已在管理端保存的 SSL 证书 ID |
| `start_status` | 整数 | 0 启动、1 停止 |
| `group_code` | 字符串 | 网站分组短码 |
| `port_listens_json` | JSON 字符串 | 显式端口监听表；更新时不提供该字段则保留原值 |
| `http_auth_json` | JSON 字符串 | 网站访问认证的会话时效等选项，不含认证账号密码 |

每条输入须提供 `code` 或 `host` + `port`；创建新网站还须提供 `host`、`port`、`remote_host`、`remote_port`。数字使用 JSON 数字，不要写成字符串。其他 `*_json` 字段如被使用，类型仍按 get 输出的 JSON 字符串格式填写。

首期 CLI 不接受 `keyfile`、`certfile` 输入。证书请先在[SSL 证书管理](../guide/SSL.md)保存，然后仅传 `bind_ssl_id`；访问认证的账号与密码通过管理端维护。`http_auth_json` 仅配置会话时效等选项，可正常输入和导出。`custom_headers_json`、`custom_response_headers_json` 可输入，但 get 导出时会省略自定义请求头、响应头及证书、私钥字段，避免回显凭据；再次 apply 时未提供的字段仍保留。导出结果不是包含秘密的完整备份。

导出、编辑、再应用：

```bash
./SamWafLinux64 site get www.example.com:8080 > editable-site.json
# 使用编辑器修改 remarks、nickname 或 bind_ssl_id 等字段，保留 code
./SamWafLinux64 site apply -f editable-site.json
```

只有默认 text 模式的 get 输出可直接作为 apply 文件；若用了 `-o json`，先取封装中的 `site` 对象。不要把 list 的结果或整个结果封装直接提交给 apply。

Windows PowerShell 5.1 的 `>` 默认生成 UTF-16 文件；可使用以下方式以 UTF-8 无 BOM 保存：

```powershell
$content = .\SamWaf64.exe site get www.example.com:8080
if ($LASTEXITCODE -eq 0) {
    [System.IO.File]::WriteAllText((Join-Path $PWD 'editable-site.json'), ($content -join "`n"), [System.Text.UTF8Encoding]::new($false))
}
# 使用编辑器修改后执行
.\SamWaf64.exe site apply -f editable-site.json
```

## 5 批量数组

`sites.json` 可以是对象数组，以下例子按顺序创建两个网站：

```json
[
  {"host":"www.example.com","port":8080,"remote_host":"http://127.0.0.1","remote_port":9112},
  {"host":"www.example.com","port":8081,"remote_host":"http://127.0.0.1","remote_port":9113}
]
```

```bash
./SamWafLinux64 site apply -f sites.json -o json
```

提交前预检全部条目；JSON 格式、未知字段、类型或必填字段错误导致退出码 `2`，整批不提交。执行阶段逐条处理，普通操作失败记录结果后继续，认证失败或管理端不可达则中止。批量操作不提供事务回滚，已成功条目会保留；修正失败项后可再次执行。结果数组以 `index` 标识输入顺序，全部成功退出 `0`，否则返回第一个非零退出码。

## 6 退出码

以下稳定退出码用于 `site`、`apikey` 自动化命令；原有交互式维护工具仍按其自身流程输出结果。

| 退出码 | 含义 |
| --- | --- |
| 0 | 成功，包括 unchanged |
| 1 | 服务端拒绝或操作失败 |
| 2 | 参数、JSON、字段或类型错误；未知命令也返回 2 |
| 3 | 无法连接管理端，或等待连接超时 |
| 4 | Key 缺失、无效、禁用、过期，或本机调用条件等认证校验未通过 |
| 5 | get/delete/start/stop 的目标网站不存在 |

json 模式错误输出示例：

```json
{"ok":false,"error":"错误原因","exit_code":4}
```

请同时检查进程退出码和 `ok`；不要只依据 HTTP 状态或输出中是否含某个单词判断成功。

## 7 Key 与本机连接边界

- Key 优先取环境变量 `SAMWAF_API_KEY`，未设置时读取 `data/.keys/cli_api_key`。没有 `--api-key` 参数；请妥善保护 Key 文件、进程环境及相关文件权限。
- 本机 Key 不受开放平台总开关控制，但仍校验启用状态、有效期及 Key 的 IP 白名单；不会同时启用普通远程 Key。
- CLI 固定连接 `127.0.0.1` 的管理端口，禁用 HTTP 系统代理且不跟随重定向，没有远端服务器参数。管理端 HTTPS 和安全入口自动从配置读取。
- 本机 Key 认证要求连接来源为回环地址，且拒绝携带转发头，包括配置的管理端代理头。该检查无法识别已被代理移除的转发头；管理端代理部署仍须限制访问，不应通过对外代理转发本机 Key 请求。
- 可在[开放平台密钥管理](../guide/OpenPlatform.md)禁用、删除或重置 Key。删除或重置后重新运行 `apikey init` 同步本地文件；需要主动换新则用 `--rotate`。init 会重新启用该本机 Key，但请另行核对有效期与白名单。
- 手动创建的普通 Key 可通过 `SAMWAF_API_KEY` 传入；普通 Key 仍受开放平台总开关和自身访问策略约束。若环境变量仍存旧值，它会覆盖刚由 init 写入的文件。

例如，已有受控环境变量后运行：

```bash
./SamWafLinux64 site list -o json
# 改回使用本机 Key 文件
unset SAMWAF_API_KEY
./SamWafLinux64 site list
```

PowerShell 清除环境变量可用 `Remove-Item Env:SAMWAF_API_KEY -ErrorAction SilentlyContinue`。不要将真实密钥写进共享脚本或版本库。

## 8 常见问题

| 现象 | 处理方法 |
| --- | --- |
| 连不上管理端 / 退出 3 | 确认服务已启动、CLI 与服务使用同一份程序目录和配置、管理端口正确；启动较慢时加 --wait 60s |
| 返回 403 | 检查管理端 IP 白名单和域名白名单是否允许 127.0.0.1，同时检查 Key 自身的 IP 白名单 |
| 提示 Key 无效或被禁用 / 退出 4 | 检查环境变量优先级、Key 状态、有效期、白名单；页面重置或删除后重跑 init |
| 已开启 HTTPS 或安全入口 | CLI 自动读取配置，无需拼 URL；不会通过跟随跳转来发现入口。仅为固定本机回环连接兼容管理端自签证书 |
| 创建或启动网站时提示端口占用 | 检查业务端口是否被其他程序占用或与已有监听冲突，修改网站端口或释放端口后重试 |
| 修改域名后生成了另一条网站 | 用稳定 code 定位原网站；仅传新的 host:port 会按新网站匹配 |
| apply 报未知字段或证书字段被拒 | 使用默认 site get 的脱敏输出并删除额外封装；证书使用 bind_ssl_id |

## 9 原有命令分组与示例

以下分组只影响 `--help` 展示，命令名保持不变，**不需要在命令前加 service、maintain 或 datakey**。不带参数直接运行仍以前台/服务方式启动。交互式工具请在终端中按提示操作，维护前备份相关数据。

| 分组 | 命令及用途 | 示例 | 输出或结果 |
| --- | --- | --- | --- |
| 服务管理 | install：安装系统服务 | `./SamWafLinux64 install` | 成功时显示 install 执行成功 |
| 服务管理 | start：启动系统服务 | `./SamWafLinux64 start` | 成功时显示 start 执行成功 |
| 服务管理 | stop：停止系统服务 | `./SamWafLinux64 stop` | 成功时显示 stop 执行成功 |
| 服务管理 | restart：重启系统服务 | `./SamWafLinux64 restart` | 成功时显示 restart 执行成功 |
| 服务管理 | uninstall：卸载系统服务 | `./SamWafLinux64 uninstall` | 成功时显示 uninstall 执行成功 |
| 服务管理 | rolling-restart：触发滚动重启 | `./SamWafLinux64 rolling-restart` | 显示已触发；就绪和排空结果见运行日志 |
| 维护工具 | resetpwd：交互重置管理员密码 | `./SamWafLinux64 resetpwd` | 按提示输入，显示重置结果 |
| 维护工具 | resetotp：交互重置双因素认证 | `./SamWafLinux64 resetotp` | 按提示选择账号，显示重置结果 |
| 维护工具 | repairdb：交互修复数据库 | `./SamWafLinux64 repairdb` | 提示数据库选择及修复结果 |
| 维护工具 | execsql：交互执行 SQL | `./SamWafLinux64 execsql` | 提示数据库与语句输入，显示执行结果 |
| 维护工具 | rollback：交互回退到历史备份 | `./SamWafLinux64 rollback` | 显示备份列表供选择；没有备份时提示不可回退 |
| 维护工具 | migratedb：离线迁移数据库 | `./SamWafLinux64 migratedb --from=sqlite --to=postgres --dry-run` | 显示迁移预检结果，不执行迁移 |
| 数据密钥 | rekey：将遗留字段升级为当前数据密钥格式 | `./SamWafLinux64 rekey` | 显示处理行数；此命令不轮换数据密钥 |
| 数据密钥 | rekey-legacy：降级前转换为旧格式 | `./SamWafLinux64 rekey-legacy` | 显示重写行数 |

`./SamWafLinux64 migratedb` 不带参数时交互选择，支持 `--from`、`--to`、`--dry-run`、`--force`；迁移方向为 SQLite → MySQL、SQLite → PostgreSQL、MySQL → PostgreSQL。操作要求和备份说明见[升级与维护](../faq/readme.md)。`rollback` 不提供 `--list`、`--version` 参数。

## 10 更新记录

| 日期 | 适用版本 | 说明 |
| --- | --- | --- |
| 2026-11-04 | >v1.3.25-beta.9（未发布） | 新增本机 apikey/site 命令、幂等合并与机器可解析输出；原有命令分组展示，未知命令退出码调整为 2。 |
