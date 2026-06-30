# Custom Blocking Response Page

## Overview

The custom blocking response page lets you customize what the WAF returns to a visitor when it blocks a request. You can configure a dedicated response code, response content, and response headers per website and per attack type, making the blocking page friendlier or better aligned with your business.

<!-- Image: Custom blocking response page list -->

## Steps

1. Click **Create New** at the top-left.
2. Enter a **Custom Blocking Page Name** (used for identification).
3. Choose the **Website**: normally select the global website; if a website needs a specific response, choose that website.
4. Choose the **Attack Type**: select the attack type this template applies to; choose "General (All Types)" to apply to all types.
5. Enter the **Response Code**: default is `403`, editable as needed.
6. Enter the **Response Content**: the content returned to the visitor; variables are supported (see below).
7. Configure **Response Header Information**: click **Add** to add a row and fill in the key name and value; at least one header is required.
8. Click **Confirm** to save.

To modify or remove a template, use **Edit** or **Delete** in the list action column.

<!-- Image: Add custom blocking response page dialog -->

## Field Reference

| Field | Description |
| --- | --- |
| Custom Blocking Page Name | The template name, used for identification. |
| Website | The website the template belongs to; can be the global website or a specific website. |
| Attack Type | The attack type the template applies to; "General (All Types)" applies to all types. |
| Response Code | The HTTP status code returned to the visitor; default is `403`. |
| Response Content | The content returned to the visitor; variables are supported. |
| Response Header Information | The HTTP response headers returned to the visitor, configured as "key = value"; at least one is required. |

### Attack Type

| Attack Type | Description |
| --- | --- |
| General (All Types) | Applies to all attack types. |
| CC Attack | CC attack. |
| SQL Injection | SQL injection. |
| XSS Attack | XSS attack. |
| Scan Tool | Scan tool. |
| Remote Code Execution | Remote code execution (RCE). |
| Directory Traversal | Directory traversal. |
| Bot Attack | Bot crawler. |
| Sensitive Word | Sensitive word. |
| IP Blocked | IP blacklist. |
| URL Blocked | URL blacklist. |
| Anti Leech | Anti-leech. |
| Custom Rule | Custom rule. |
| OWASP Rule | OWASP rule. |
| Plugin Block | Plugin block. |

### Response Header

| Key Name | Description | Example Value |
| --- | --- | --- |
| `Content-Type` | Specifies the type of the returned content. | `text/html; charset=UTF-8`, `text/json; charset=UTF-8` |

## Response Content Variables

The response content supports the following variable, which the WAF replaces with the actual value when responding:

```
Visit ID:
[[.SAMWAF_REQ_UUID]]
```

## HTML Example

If you are using regular HTML, set the `Content-Type` to: `text/html; charset=UTF-8`.

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Access is Blocked</title>
    <style>
        /* Basic Styles */
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

        /* Page Content Container */
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        /* Title Style */
        h1 {
            font-size: 2.5em;
            color: #d9534f;
            margin: 0;
        }

        /* Visit ID Style */
        h3 {
            font-size: 1.5em;
            color: #5bc0de;
            margin: 20px 0;
        }

        /* Message Style */
        .message {
            font-size: 1.1em;
            color: #999;
            margin-bottom: 30px;
        }

        /* Back to Home Button Style */
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

        /* Responsive Design */
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
        <h1>Your Access is Blocked</h1>
        <p class="message">Your request was blocked due to security policies.<br>If you have any questions, please send the visit ID below to the administrator for further investigation.</p>
        <h3>Visit ID: [[.SAMWAF_REQ_UUID]]</h3>
    </div>
</body>
</html>
```

## JSON Example

If you want to use JSON for API interfaces, set the `Content-Type` to: `text/json; charset=UTF-8`.

```json
{"samwaf_req_uuid":"[[.SAMWAF_REQ_UUID]]","msg":"Access Blocked"}
```
