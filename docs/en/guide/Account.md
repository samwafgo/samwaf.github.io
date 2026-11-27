# Account Management

## Overview

Account Management is used to maintain the admin accounts that log in to the SamWaf console. From **Account Management → Account List** you can view all accounts and perform actions such as creating an account, editing an account, resetting a password, resetting two-factor authentication (2FA), and deleting an account. Each account can be assigned a role to differentiate management permissions.

<!-- Image: Account list page -->

## Role Permissions

The account role determines what the account can do in the console:

| Role | Scope |
| --- | --- |
| Super Administrator | All features. |
| Security Administrator | WAF protection policies (protection rules, block/allow lists, IP groups, CC protection, sensitive words, OWASP rule set, Access Authentication), plus read/write access to sites, path routes, load balancing, site groups, batch tasks and site import. |
| System Administrator | System-level features such as system configuration, account management, two-factor authentication, Open Platform keys, SQL query, app management and AI models, plus notifications, firewall IP blocking, threat intelligence, tunnels and file management. Does **not** include write access to sites, path routes, load balancing, site groups, batch tasks or site import. |
| Audit Administrator | Read-only. Can view system logs, account logs, login history and security audit, and cannot perform write operations. |

- Read-only queries in shared features are available to every signed-in role; changing your own password, saving UI preferences and handling upgrade notices also work for any role.
- A denied write operation shows "当前账号角色无权访问该功能" (the current account role cannot access this feature) and is recorded in [Security Audit](./AccessAudit.md) as a "Role denied" event; the same account and API are recorded at most once every 5 minutes.
- Existing accounts with an empty role are treated as **Super Administrator**.
- Calls made with an OpenAPI Key are not restricted by account role.

## Steps

### 1. Search Accounts

- Enter a keyword in the **Login Account** field at the top right and click **Search** to filter the list by login account.
- The list shows the login account, role, remarks, and creation time.

### 2. Create an Account

1. Click the **Create Account** button at the top left to open the dialog.
2. Fill in the following fields:
   - **Login Account** (required)
   - **Role**: choose from the dropdown (Super Administrator / System Administrator / Security Administrator / Audit Administrator)
   - **Login Password** (required)
   - **Status**: a number, default 1
   - **Remarks**: optional description
3. Click **Confirm** to create, or **Close** to cancel.

<!-- Image: Create account dialog -->

### 3. Edit an Account

1. Click **Edit** on the target account row.
2. You can modify **Login Account**, **Role**, **Status**, and **Remarks**.
3. Click **Confirm** to save.

> The edit dialog does not change the password. Use the **Reset Password** action to change it.

### 4. Reset Password

1. Click **Reset Password** on the target account row.
2. The **Login Account** is filled in automatically. Then enter:
   - **Super Administrator Password**: used to verify the current operator's identity.
   - **New Password**
   - **Confirm Password**: must match the new password, otherwise the message "The passwords do not match, please check" is shown.
3. Click **Confirm** to complete the reset.

<!-- Image: Reset password dialog -->

### 5. Reset 2FA

- Click **Reset 2FA** on the target account row to clear the bound two-factor authentication for that account. On the next login only the password is required (you can re-enable 2FA from the Two-Factor Authentication page).

### 6. Delete an Account

1. Click **Delete** on the target account row.
2. Confirm in the dialog to complete the deletion.

> The default admin account cannot be deleted.

## Field Reference

| Field | Description |
|-------|-------------|
| Login Account | The account name used to log in to the console. Required. |
| Role | Account role: Super Administrator, System Administrator, Security Administrator, or Audit Administrator. |
| Login Password | The login password set when creating the account. Required. |
| Status | Account status value, default 1 when created. |
| Remarks | Optional account description. |
| Create Time | Account creation time, recorded automatically. |
| Super Administrator Password | Used to verify identity when resetting a password. |
| New Password / Confirm Password | Entered when resetting a password; the two must match. |

## FAQ

- **The passwords do not match?** When resetting a password, **New Password** and **Confirm Password** must be exactly the same.
- **Cannot delete an account?** The default admin account is protected and cannot be deleted.
- **Lost your authenticator and cannot log in?** Use **Reset 2FA** to clear the 2FA binding for the account and restore password-only login.

## Update History

| Applicable version | Changes |
| --- | --- |
| v1.3.26 (beta) | Added Role Permissions: write operations for sites, path routes, load balancing, site groups, batch tasks and site import require the Security Administrator or Super Administrator; the Audit Administrator is read-only; denials are recorded in Security Audit as "Role denied". |
