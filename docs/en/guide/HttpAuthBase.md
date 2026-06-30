# Website Access Authentication

## Overview

Website access authentication lets you require a password to access a protected website. After a website password is enabled, visitors must access the site with the password. The authentication accounts (username + password) are managed on this page, while the authentication type and authentication path prefix are configured on the website edit page.

<!-- Image: Website access authentication account list -->

## Prerequisites

Authentication accounts work together with the website's "Web Password Visit" switch:

1. Open the website edit page and turn **Web Password Visit** on (after enabling, the website requires a password for access; please add a username and password).
2. Choose an **Authentication Type**:
   - **Authorization Mode (Browser Popup)**: standard HTTP Basic Auth, authenticated through the browser popup.
   - **Custom Mode (Custom Page)**: a custom login page, suitable for avoiding conflicts when the backend site also uses Authorization authentication.
3. Set the **Auth Path Prefix**: a custom HTTP authentication path prefix to hide system features. Leave it empty for an auto-generated random path. Format: start with `/_`, at least 10 characters, lowercase letters, numbers, and underscores only. Example: `/_waf_a7k3m9x2`.
4. Add access accounts (username + password) on this page.

## Steps

### Add an account

1. Click **New**.
2. Enter a **Username** and **Password**.
3. Click **Confirm** to save.

> Note: the password must not contain a colon `:`, otherwise a "Password Not Normal" message appears.

<!-- Image: Add authentication account dialog -->

### Search / Edit / Delete

- Enter a keyword in the **Username** box at the top and click **Search**.
- In the list action column, click **Edit** to modify an account or **Delete** to remove it.

## Field Reference

### Authentication account (this page)

| Field | Description |
| --- | --- |
| Username | The login username used to access the website. |
| Password | The login password used to access the website; it must not contain a colon `:`. |

### Related settings on the website edit page

| Field | Description |
| --- | --- |
| Web Password Visit | After enabling, the website requires a password for access. Please add a username and password. |
| Authentication Type | Authorization mode: standard HTTP Basic Auth (browser popup); Custom mode: custom login page, suitable for avoiding conflicts when the backend also uses Authorization authentication. |
| Auth Path Prefix | Custom HTTP authentication path prefix to hide system features. Leave empty for an auto-generated random path. Format: start with `/_`, at least 10 characters, lowercase letters, numbers, and underscores only. Example: `/_waf_a7k3m9x2`. |

## FAQ

- **"Password Not Normal" message?** The password must not contain a colon `:`. Remove the colon and try again.
- **Account added but the website does not ask for a password?** Make sure **Web Password Visit** is enabled on the website edit page.
- **When should I use Custom mode?** When the backend website itself also uses Authorization authentication, use Custom mode (a custom login page) to avoid authentication conflicts.
