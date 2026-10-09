# 开放平台 API 场景手册

面向第三方系统/脚本对接者的场景化手册：不按接口清单罗列，而是按「我要做什么事」组织，每个场景给出可直接运行的 curl 示例。新场景会持续补充到本文，见文末的场景索引。

> 密钥的创建与管理见操作手册 [开放平台](../guide/OpenPlatform.md)；全量接口参数见 [在线 Swagger 文档](/api/)。

## 1 通用约定

### 1.1 请求方式

- **Base URL**：`http(s)://<管理端地址>:26666/api/v1`（管理端端口默认 26666）
- **认证**：请求头携带 `X-API-Key: sk-xxxx`（在「开放平台 → 密钥管理」创建）
- 无需登录 Token、无需防重放头（`X-Request-Time`/`X-Request-Id` 仅后台 Token 方式需要）
- 响应为**明文 JSON**（不加密），统一结构：`{"code":0,"data":...,"msg":"..."}`，`code=0` 成功，`code=-999` 鉴权失败
- 若启用了「安全访问路径」，URL 需改为 `http(s)://host:port/{安全码}/api/v1/...`

### 1.2 分页参数

分页接口的请求体字段为**驼峰**命名：

```json
{"pageIndex": 1, "pageSize": 50}
```

响应统一为：

```json
{"code": 0, "data": {"list": [...], "total": 1, "pageIndex": 1, "pageSize": 50}, "msg": "获取成功"}
```

### 1.3 常见失败码

| code | 含义 | 排查 |
|------|------|------|
| `-999` | 鉴权失败 | 开放平台未开启 / Key 错误 / Key 被禁用 / Key 过期 / 来源 IP 不在白名单 |
| `-1` | 业务失败 | 看 `msg` 字段（如限流「请求频率超限」） |

每次调用都会记录到「开放平台 → 调用日志」（含请求/响应内容、来源 IP、耗时），联调时先去那里看。

## 2 场景索引

| 场景 | 章节 | 主要接口 |
|------|------|----------|
| 查询被封的 IP | [场景 1](#_3-场景-1-查询被封的-ip) | `ipblock/list`、`ipfailure/baniplist`、`firewall/ipblock/list`、`hostguard/ban/list` |
| 解除 IP 封禁 | [场景 2](#_4-场景-2-解除-ip-封禁) | `ipblock/del`、`ipfailure/removebanip`、`firewall/ipblock/del`、`hostguard/ban/release` |

## 3 场景 1：查询被封的 IP

「被封的 IP」在 SamWaf 里按封禁来源分四处存放，对接前先确认要查哪一类（或全查）：

| 封禁来源 | 说明 | 持久化 |
|----------|------|--------|
| IP 黑名单 | 手动拉黑 / 批量任务导入，长期有效 | 数据库 |
| IP 失败封禁 | 登录/认证失败次数超限的临时封禁 | 内存，重启即清 |
| 系统防火墙封禁 | 下发到 iptables / Windows 防火墙的封禁 | 数据库 + 系统防火墙 |
| 主机防护封禁 | SSH/RDP 爆破防护产生的封禁 | 数据库 |

### 3.1 IP 黑名单（应用层）

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipblock/list" \
  -H "X-API-Key: sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"host_code":"","ip":"","pageIndex":1,"pageSize":50}'
```

- `host_code` 留空查全部站点，填站点唯一码只查该站
- `ip` 精确匹配单条；`group_code` 按引用的 IP 组筛选

返回示例：

```json
{"code":0,"data":{"list":[{"id":"a1b2...","host_code":"e680...","ip":"1.2.3.4","ip_type":"","remarks":"恶意扫描","create_time":"2026-10-01 12:00:00"}],"total":1},"msg":"获取成功"}
```

### 3.2 IP 失败封禁（临时封禁）

```bash
curl "http://127.0.0.1:26666/api/v1/wafhost/ipfailure/baniplist" \
  -H "X-API-Key: sk-xxxxxxxx"
```

无参数，返回当前所有被封 IP 及剩余时间：

```json
{"code":0,"data":{"list":[{"ip":"1.2.3.4","fail_count":8,"first_time":"2026-10-09 09:00:00","last_time":"2026-10-09 09:04:11","remain_time":"26分","region":"上海","trigger_minutes":10,"trigger_count":5}],"total":1},"msg":"获取成功"}
```

### 3.3 系统防火墙层封禁

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/firewall/ipblock/list" \
  -H "X-API-Key: sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":1,"pageSize":50}'
```

支持按 `host_code` / `ip` / `block_type` / `status` 过滤。

### 3.4 主机防护封禁（SSH/RDP 爆破）

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/hostguard/ban/list" \
  -H "X-API-Key: sk-xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"pageIndex":1,"pageSize":50}'
```

支持按 `ip` / `source` / `status` 过滤；`status` 留空只返回生效中的封禁。

## 4 场景 2：解除 IP 封禁

四类封禁各有对应的解除接口。解除前先用场景 1 的列表接口拿到记录 `id`。

### 4.1 解除 IP 黑名单

```bash
# 解除单条
curl "http://127.0.0.1:26666/api/v1/wafhost/ipblock/del?id=<记录id>" \
  -H "X-API-Key: sk-xxxxxxxx"

# 批量解除
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipblock/batch/del" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"ids":["id1","id2"]}'

# 清空某站点（或全部站点）的黑名单
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipblock/delall" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"host_code":""}'
```

删除后立即同步到 WAF 引擎生效，无需重启。

### 4.2 解除失败封禁 / CC 临时封禁

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/wafhost/ipfailure/removebanip" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"ip":"1.2.3.4"}'
```

一个接口同时解除两类内存态封禁：登录失败封禁和 CC 防护的临时封禁。对未被封的 IP 调用也返回成功（幂等）。

### 4.3 解除系统防火墙封禁

```bash
curl "http://127.0.0.1:26666/api/v1/firewall/ipblock/del?id=<记录id>" \
  -H "X-API-Key: sk-xxxxxxxx"
```

会先摘除系统防火墙规则再删除记录。批量用 `POST /api/v1/firewall/ipblock/batch/del`。

### 4.4 解除主机防护封禁

```bash
curl -X POST "http://127.0.0.1:26666/api/v1/hostguard/ban/release" \
  -H "X-API-Key: sk-xxxxxxxx" -H "Content-Type: application/json" \
  -d '{"id":"<封禁记录id>"}'
```

### 4.5 注意事项

- **双层封禁要解两处**：加黑时选择了「系统防火墙」层级的 IP，在 `ipblock` 和 `firewall/ipblock` 各有一条独立记录，需分别删除。
- **临时封禁可不手动解**：失败封禁和 CC 封禁自带 TTL，到期自动解除；手动接口用于等不及的场景。
- **被拦截 ≠ 被封禁**：攻击日志里出现 403 的 IP 不一定在黑名单中，没有封禁状态就无需解除。

## 5 场景 3：一键验证脚本

仓库内提供零依赖 Python 验证脚本 `SamWafTechDoc/Tool/openapicheck/openapi_verify.py`，自动完成：临时开启开放平台 → 建临时 Key → 四类查询 → 加黑/解封闭环 → 错误 Key 拒绝 → 清理现场，并输出逐项通过报告：

```bash
python openapi_verify.py --password 管理端密码
# 指定实例：python openapi_verify.py --password xxx --admin http://192.168.1.10:26666
```

每次执行在脚本同级 `logs/` 目录留一份带时间戳的日志，密码与密钥不完整落日志。适合发版回归或对接方自助排障。

## 6 维护说明：如何新增场景

1. 在「场景索引」表加一行（场景名 / 章节锚点 / 主要接口）。
2. 按现有场景的版式新增一节：一句话说明 → curl 示例 → 关键参数表/返回示例 → 注意事项。
3. curl 示例一律用 `X-API-Key` 方式、明文 JSON，参数名以代码里的 json tag 为准（分页是驼峰 `pageIndex/pageSize`）。
4. 涉及写操作的场景，示例 IP 一律用 RFC 5737 文档段（`198.51.100.x`），避免读者误伤真实地址。
5. 英文版同步更新 `en/dev/openapi-cookbook.md`。
