# 自定义拦截响应界面

## 功能简介

自定义拦截响应界面用于自定义 WAF 拦截请求时返回给访客的内容。你可以为不同网站、不同攻击类型配置专属的响应代码、响应内容和响应 Header，让拦截页面更友好或更贴合业务。

<!-- 图：自定义拦截响应界面列表 -->

## 操作步骤

1. 点击左上角的 **新建**。
2. 填写 **自定义拦截模板页面名称**（供自己识别）。
3. 选择 **网站**：正常选择全局网站即可；如果每个网站的返回需要特殊处理，则选择特定网站。
4. 选择 **攻击类型**：选择该模板适用的攻击类型，选择「通用(所有类型)」表示对所有类型生效。
5. 填写 **响应代码**：默认 `403`，可依据实际情况编辑。
6. 填写 **响应内容**：给访客返回的内容信息，支持变量（见下文）。
7. 配置 **响应Header头信息**：点击 **添加** 增加一行，填写键名与值；至少需要填写一项 Header。
8. 点击 **确定** 保存。

如需修改或删除，可在列表操作列点击 **编辑** 或 **删除**。

<!-- 图：新建自定义拦截响应界面弹窗 -->

## 字段说明

| 字段 | 说明 |
| --- | --- |
| 自定义拦截模板页面名称 | 模板名称，供自己识别。 |
| 网站 | 模板所属网站，可选择全局网站或特定网站。 |
| 攻击类型 | 模板适用的攻击类型，选择「通用(所有类型)」对所有类型生效。 |
| 响应代码 | 返回给访客的 HTTP 状态码，默认 `403`。 |
| 响应内容 | 返回给访客的内容信息，支持变量。 |
| 响应Header头信息 | 返回给访客的 HTTP 响应头，按「键名 = 值」配置，至少填写一项。 |

### 攻击类型

| 攻击类型 | 说明 |
| --- | --- |
| 通用(所有类型) | 对所有攻击类型生效。 |
| CC攻击 | CC 攻击。 |
| SQL注入 | SQL 注入。 |
| XSS攻击 | XSS 攻击。 |
| 扫描工具 | 扫描工具。 |
| 远程代码执行 | 远程代码执行（RCE）。 |
| 目录穿越 | 目录穿越。 |
| Bot爬虫 | Bot 爬虫。 |
| 敏感词 | 敏感词。 |
| IP黑名单 | IP 黑名单。 |
| URL黑名单 | URL 黑名单。 |
| 防盗链 | 防盗链。 |
| 自定义规则 | 自定义规则。 |
| OWASP规则 | OWASP 规则。 |
| 插件拦截 | 插件拦截。 |

### 响应 Header

| 键名 | 描述 | 例子值 |
| --- | --- | --- |
| `Content-Type` | 表示返回内容的类型。 | `text/html; charset=UTF-8` ， `text/json; charset=UTF-8` |

## 响应内容变量

响应内容支持以下变量，WAF 会在返回时替换为实际值：

```
访问ID码：
[[.SAMWAF_REQ_UUID]]
```

## HTML 示例

如果是正常 HTML，可以将 `Content-Type` 设置成：`text/html; charset=UTF-8`。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>您的访问被阻止</title>
    <style>
        /* 基本样式 */
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }

        /* 页面内容的容器 */
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        /* 标题样式 */
        h1 {
            font-size: 2.5em;
            color: #d9534f;
            margin: 0;
        }

        /* 访问识别码样式 */
        h3 {
            font-size: 1.5em;
            color: #5bc0de;
            margin: 20px 0;
        }

        /* 提示文字 */
        .message {
            font-size: 1.1em;
            color: #999;
            margin-bottom: 30px;
        }

        /* 返回首页按钮样式 */
        .back-btn {
            background-color: #5cb85c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 1.1em;
        }

        .back-btn:hover {
            background-color: #4cae4c;
        }

        .back-btn:active {
            background-color: #398439;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .container {
                padding: 30px;
            }

            h1 {
                font-size: 2em;
            }

            h3 {
                font-size: 1.3em;
            }

            .message {
                font-size: 1em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>您的访问被阻止</h1>
        <p class="message">由于安全策略，您的请求被阻止。<br>如果有疑问，请将下面的访问识别码发给管理员，以便进一步排查。</p>
        <h3>访问识别码：[[.SAMWAF_REQ_UUID]]</h3>
    </div>
</body>
</html>
```

## JSON 示例

如果是纯 API 接口也想用 JSON，可以将 `Content-Type` 设置成：`text/json; charset=UTF-8`。

```json
{"samwaf_req_uuid":"[[.SAMWAF_REQ_UUID]]","msg":"访问被拦截"}
```
