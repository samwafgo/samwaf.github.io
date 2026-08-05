# Access Accounts

## 1 Overview

This page maintains the **visitor accounts for [Access Authentication](./AccessConfig.md)** — in other words, who is allowed through the gate.

Notice at the top of the page: **These accounts are for visitors signing in. They are entirely separate from admin panel accounts and from a site's [Site Password] feature. Passwords are stored with bcrypt and cannot be read back.**

::: tip
**Create at least one account here before** turning on Access Authentication, or nobody will be able to get in once the master switch flips.
:::

<!-- Image: Access accounts list page -->

## 2 Steps

### 2.1 Create an account

1. Go to **Access Auth → Access Accounts** and click **New account** in the top-left corner.
2. Fill in **Username** and **Password** (both required).
3. Optionally set **Display name**, **Status**, **Two-step**, **Allowed sites**, **Account expiry** and **Remarks**.
4. Click **Confirm** to save.

::: warning
**The username cannot be changed after creation** (sessions and audit logs key off it). To rename, delete and recreate.
:::

Password complexity follows the admin password policy — these accounts are internet-facing sign-in entry points, so there is no reason to be more lenient than the admin panel.

<!-- Image: New access account dialog -->

### 2.2 Allowed sites

Left empty by default, which means **every site** is allowed (recommended, and enough for most self-hosted setups).

Once you pick sites, the account can only reach those. Choose site names directly from the dropdown — no internal codes to type. The list column shows **All sites** or **N site(s)**; hover to see the actual site names.

::: warning
Deleting a site removes it from here automatically; **if that empties the list, the account is disabled**.
This is deliberate: an empty list means "every site", so silently saving it would promote a restricted account to full access — exactly the wrong direction. Re-select sites for the account and enable it again.
:::

### 2.3 Account expiry

Leave empty for **no expiry**. Once expired the account cannot sign in and **existing sessions are revoked**.

### 2.4 Two-step verification

Click **Two-step** in the **Operation** column of a row:

- **Not bound**: scan the QR code with an authenticator app (or enter the **Secret** manually), then enter one **verification code** to complete binding. Binding only succeeds if the code is correct, so you can never end up with the system thinking it is bound while the phone has nothing.
- **Bound**: click **Unbind**. After unbinding, sign-in will no longer ask for a code.

<!-- Image: Two-step binding dialog -->

The **Two-step** field in the account form controls enforcement:

| Value | Description |
| --- | --- |
| Inherit global | Follow site and global settings |
| Force | This account always has to enter a code |
| Exempt | This account is never asked |

::: tip
The account-level setting wins over site and global settings. **Accounts without an authenticator bound are never forced** — otherwise they would be stuck at the sign-in page.
:::

### 2.5 Reset password

Click **Reset password** and enter a new one.

::: warning
Resetting the password also **kicks every active session for this account** — this is the stop-the-bleeding action when a password may have leaked.
:::

### 2.6 Kick and delete

- **Kick**: force all sessions of this account offline, normally with immediate effect.
- **Delete**: deleting the account also kicks all its active sessions and cannot be undone.

Switching the status to **Disabled** likewise kicks all of this account's active sessions immediately.

### 2.7 Search

The top-right corner supports fuzzy filtering by **Username**; enter a value and click **Search**.

## 3 Field reference

| Field | Description |
| --- | --- |
| Username | The visitor's sign-in name, required; **cannot be changed after creation** |
| Password | Required on creation, stored with bcrypt and unreadable; use "Reset password" to change it |
| Display name | A friendlier label, optional |
| Status | Enabled / Disabled; switching to disabled immediately kicks the account's sessions |
| Two-step | Inherit global / Force / Exempt; the account level takes precedence |
| Allowed sites | Nothing selected = every site; otherwise only the selected sites |
| Account expiry | Empty = never expires; after expiry sign-in fails and existing sessions are revoked |
| Remarks | Free-form notes, optional |
| Last sign-in | Time of the most recent successful sign-in (list column) |
| Last sign-in IP | Source IP of the most recent successful sign-in (list column) |

## 4 FAQ

- **Why did an account suddenly become disabled?** The only site it was allowed to reach was deleted. Re-select allowed sites and enable it again — see [2.2](#_2-2-allowed-sites).

- **If an account is limited to one site, can it still sign in at the auth center?** Yes. Sign-in happens at the auth center and that step does not check site authorization; the per-site check happens while redirecting back to the business site. So you do **not** need to add the auth center to every account's allowed sites.

- **An authenticator is bound but sign-in never asks for a code.** Check all three layers: the account's **Two-step** may be Exempt, the site may be Exempt, or global two-step in [Auth Settings](./AccessConfig.md) may be off. Precedence is account > site > global.

- **A visitor forgot their password.** As an administrator, click **Reset password** on this page and set a new one (this also kicks that account's active sessions).

- **Can these accounts sign in to the admin panel?** No. Access accounts only pass the Access Authentication gate for proxied business sites; they are fully isolated from admin accounts on port `26666`.
