# Application Management

## Overview

Application Management lets SamWaf host and supervise local business processes (such as jar packages or executables). SamWaf can start, stop, and restart hosted applications, automatically relaunch them on abnormal exit according to a policy, and provides log viewing, initial file upload, upgrade/rollback, and network listening information.

The banner at the top of the page notes: trusted paths (directories allowed to be hosted) are configured via the `application_allow_dirs` field in `conf/config.yml`. Restart SamWaf after changes to take effect.

> Most sensitive operations (create, edit, delete, start, restart, upgrade) require entering the **App Operation Password** first. See the "App Operation Password" section below.

<!-- Image: Application list page -->

## Steps

### 1. Create an Application

1. Click **New App** at the top left (if the app operation password has not been entered yet, the password confirmation dialog appears first).
2. Fill in the form by section:

   **Basic Configuration**
   - **App Name** (required)
   - **Start Command** (required, e.g. `java -jar app.jar` or `./myapp`)
   - **Working Directory**: leave blank for the default `data/applications/{code}/`. The form shows the "Actual directory"; an absolute path prompts you to confirm that the path exists and contains the executable, while a relative path is relative to the SamWaf install directory.
   - **Environment Variables**: format `KEY=VALUE,KEY2=VALUE2` (comma separated)
   - **Status**: On / Off
   - **Auto Start**: Yes / No

   **Stop Configuration**
   - **Stop Mode**: Signal (SIGTERM/taskkill) or Custom Command
   - **Stop Command**: shown only when the stop mode is Custom Command
   - **Stop Timeout**: seconds to wait for stop (1–300)

   **Restart Policy**
   - **Restart Policy**: No Auto Restart / On Failure / Always
   - **Restart Delay**: shown when the policy is not "No Auto Restart", in seconds
   - **Max Restarts**: shown when the policy is not "No Auto Restart"; 0 means unlimited

   **Log Configuration**
   - **Max Log Lines (memory)** (100–10000)

   - **Remarks**: optional

   **Initial Files (Optional, only when creating)**
   - **Select File**: upload the application's initial files to the working directory
   - **SHA256 Hash**: auto-calculated after selecting a file, or entered manually

3. Click **Submit** to create, or **Cancel** to discard.

<!-- Image: Create application form -->

### 2. Start / Stop / Restart

In the action column of the target application row:

- **Start**: shown when the application is not running; sends a start command.
- **Stop**: shown when the application is running; sends a stop command.
- **Restart**: sends a restart command.

After a command is sent, "Processing..." is shown while the system polls the status until the target status is reached and refreshes the list.

### 3. View Logs

- Click **Logs** to open the log window, view the application's in-memory logs, and clear them.

### 4. Upgrade / Rollback

- Click **Upgrade/Rollback** to open the upgrade window, where you can upload a new version file and choose the action (Upload Only / Upload & Upgrade, where the upgrade flow is stop → backup → replace → restart), or roll back to a historical version from the backup list.

<!-- Image: Upgrade/Rollback window -->

### 5. View Network

- Click **Network** to view the application's listening ports, connected IPs, and other network information (showing up to 1000 connection records).

### 6. Change Logs

- Click **Change Logs** to open a drawer showing the application's change history. The badge on the button indicates the number of unread changes.

### 7. Edit / Delete

- **Edit**: modify the application configuration (same fields as the create form; opens after password confirmation).
- **Delete**: confirm in the dialog to delete the application.

## Field Reference

| Field | Description |
|-------|-------------|
| App Name | Display name of the application. Required. |
| Run Status | Running / Stopped / Crashed. |
| PID | Current process ID. |
| Restarts | Number of restarts that have occurred. |
| Status | On / Off. |
| Auto Start | Yes / No, whether SamWaf launches the application automatically at startup. |
| Restart Policy | No Auto Restart / On Failure / Always. |
| Start Command | Command used to start the application. Required. |
| Working Directory | Application run directory; default `data/applications/{code}/` when blank. |
| Environment Variables | Variables in the form `KEY=VALUE,KEY2=VALUE2`, comma separated. |
| Stop Mode | Signal (SIGTERM/taskkill) or Custom Command. |
| Stop Command | Command used when the stop mode is custom. |
| Stop Timeout | Seconds to wait for the application to stop (1–300). |
| Restart Delay | Seconds to wait before restarting. |
| Max Restarts | Upper limit for auto restarts; 0 means unlimited. |
| Max Log Lines (memory) | Number of log lines kept in memory (100–10000). |
| SHA256 Hash | Checksum of the uploaded file, auto-calculated after selection. |
| Remarks | Optional application description. |

## App Operation Password

Operations such as create, edit, delete, start, restart, and upgrade require the **App Operation Password**.

- This password differs from the login password. It is auto-generated at first startup and printed in the startup log, and is also visible in the `application_op_password` field of `conf/config.yml`.
- Enter the password in the confirmation dialog. You can check **Remember for this session** to avoid re-entering it for a period of time.
- An incorrect password shows "Operation password is incorrect, please try again".

## FAQ

- **The working directory does not take effect / the path is unavailable?** The directories that can be hosted are restricted by the `application_allow_dirs` (trusted paths) field in `conf/config.yml`. Restart SamWaf after changing it.
- **Don't know the app operation password?** Check the first startup log, or view the `application_op_password` field in `conf/config.yml`.
