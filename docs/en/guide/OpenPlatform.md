# Open Platform

## 1 Overview

The Open Platform exposes SamWaf's management capabilities to third-party systems and scripts. Callers do not need to log in to the admin console — they only need to carry an `X-API-Key` in the HTTP header of each request for authentication.

The Open Platform consists of three pages:

- **API Key Management**: Create, view, enable/disable, reset, and delete API Keys.
- **Call Logs**: Record the request method, path, source IP, status code, duration, and request/response content of every API call.
- **API Docs**: View the online Swagger API documentation in an embedded frame ([https://doc.samwaf.com/api/](https://doc.samwaf.com/api/)).

::: tip Note
The Open Platform must first be enabled in **System Configuration** before it can be used. When it is disabled, the API Docs page shows: "Open Platform is not enabled. Please enable it in System Configuration to view API documentation."
:::

::: warning Security Path Impact
If a security access path (custom access code) is enabled in **System Configuration**, that path applies to ALL requests, including Open Platform external calls. Once enabled, callers must update their URLs to the format `http(s)://host:port/{code}/api/v1/...`. Please notify all API integrators to update their endpoints accordingly.
:::

<!-- Image: Open Platform menu (API Key Management / Call Logs / API Docs) -->

## 2 API Keys

The API Key Management page lists all created keys in a table.

<!-- Image: API Key Management list -->

### 2.1 List Columns

| Column | Description |
|--------|-------------|
| Key Name | Custom name of the key for easy identification. |
| API Key | The key value used for authentication (the value of the `X-API-Key` header). |
| Status | `Enabled` or `Disabled`. Calls with a disabled key are rejected. |
| Rate Limit (req/min) | Allowed calls per minute. `0` means no limit. |
| IP Whitelist | Source IPs allowed to use the key, comma-separated, CIDR supported. Empty means no restriction. |
| Call Count | Total number of calls made with the key. |
| Last Used | The time the key was last used. |
| Expire Time | Key expiration time. Empty means never expire. |
| Operation | Edit, Enable/Disable, Reset Key, Delete. |

You can filter the list with the **Key Name** search box at the top.

### 2.2 Create a Key

Click **New API Key** and fill in the following fields:

- **Key Name** (required): Custom name of the key.
- **Rate Limit (req/min)**: Allowed calls per minute. `0` means no limit.
- **IP Whitelist**: Source IPs allowed to call, comma-separated, CIDR supported. Empty means no restriction.
- **Expire Time**: Format `2026-12-31 23:59:59`. Empty means never expire.
- **Remark**: Optional description.

<!-- Image: Create API Key form -->

::: warning The Key Is Shown Only Once
After creation, a dialog shows the full API Key. **The key is shown only once — copy and save it immediately.** Use the **Copy** button in the dialog to copy it. Once the dialog is closed, the full key cannot be viewed again; you can only generate a new value via "Reset Key".
:::

### 2.3 Edit a Key

Click **Edit** on a row to modify: Key Name, Status (Enabled/Disabled), Rate Limit, IP Whitelist, Expire Time, and Remark.

<!-- Image: Edit API Key form -->

### 2.4 Enable / Disable

Click **Enable** or **Disable** on a row to quickly toggle the key status. Once disabled, calls using that key are rejected immediately.

### 2.5 Reset Key

Click **Reset Key** to generate a new API Key, shown in a dialog (again only once — copy it immediately). **Resetting invalidates the old key immediately**; callers using the old key must update to the new one.

### 2.6 Delete a Key

Click **Delete** and confirm to delete the key. **After deletion, calls using that key are rejected immediately.** This action cannot be undone.

### 2.7 Using X-API-Key

The Open Platform API uses the BasePath `/api/v1`, and authentication is done by carrying `X-API-Key` in the request header — no login token is required. Example:

```bash
curl -H "X-API-Key: your_api_key" https://host:port/api/v1/...
```

If a security access path is enabled, the URL becomes:

```bash
curl -H "X-API-Key: your_api_key" https://host:port/{code}/api/v1/...
```

## 3 Call Logs

The Call Logs page records every API call for troubleshooting and auditing.

<!-- Image: Call Logs list -->

### 3.1 List Columns

| Column | Description |
|--------|-------------|
| Key Name | The name of the key used to make the call. |
| Method | HTTP method (GET/POST, etc.). |
| Request Path | The endpoint path that was called. |
| Client IP | Source IP of the caller. |
| Status Code | HTTP response status code (`200` shown in green, others in orange). |
| Duration | Duration of the call, in milliseconds (ms). |
| Call Time | The time the call occurred. |
| Operation | Details, Delete. |

### 3.2 Filtering

The top of the page provides three filters: **Key Name**, **Request Path**, and **Client IP**. Fill them in and click **Search** to filter.

### 3.3 Call Detail

Click **Details** on a row to view the full information of that call: Key Name, request method and path, Client IP, Status Code, Duration, Call Time, and the **Request Body** and **Response Body** content.

<!-- Image: Call Log detail -->

### 3.4 Delete a Log

Click **Delete** on a row and confirm to delete that call log entry.

## 4 API Docs

The API Docs page embeds the online Swagger API documentation at [https://doc.samwaf.com/api/](https://doc.samwaf.com/api/). There you can view the request parameters, request examples, and response examples for each endpoint.

<!-- Image: API Docs (embedded Swagger) -->

- **BasePath**: `/api/v1`
- **Authentication**: Carry `X-API-Key` in the HTTP header of each request. No login token required.
- **Header Value**: The value obtained after creating a key on the **API Key Management** page.

## 5 FAQ

**Q: Why does the API Docs page say "Open Platform is not enabled"?**
A: The Open Platform must first be enabled in **System Configuration**. Once enabled, you can view the API docs and use the endpoints.

**Q: What if I forget my API Key?**
A: The full key is shown only once, at creation or reset, and cannot be viewed again. Use **Reset Key** on that key in **API Key Management** to generate a new value, then update the caller's configuration.

**Q: What can cause authentication failures on a call?**
A: Common causes include: the key is disabled, the key has expired, the source IP is not in the IP whitelist, the rate limit was exceeded, or the `X-API-Key` header was not sent correctly.

**Q: Calls fail after enabling the security access path?**
A: The security path also applies to the Open Platform. The call URL must be changed to `http(s)://host:port/{code}/api/v1/...`. Please update the integrator's endpoint accordingly.
