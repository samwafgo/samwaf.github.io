# Application Management

## Overview

Application Management lets SamWaf host and supervise local business processes (such as jar packages or executables). SamWaf can start, stop, and restart hosted applications, automatically relaunch them on abnormal exit according to a policy, and provides log viewing, initial file upload, upgrade/rollback, and network listening information.

## Enable Application Management

Application Management is disabled by default. When you open the page, SamWaf checks whether the running instance has it enabled. A loading indicator appears during the check; when enabled, the application list is displayed.

If the page shows the setup guide, follow these steps:

1. Open `conf/config.yml` in the **SamWaf installation directory** and set the existing `application_manage` entry to `true`. If the entry is missing, add it at the YAML top level:

   ```yaml
   application_manage: true
   ```

2. Save the file and restart SamWaf. For a service installation, restart the corresponding service. For a container installation, edit the persistent configuration file actually used by that container, then restart the container.
3. On first enablement, if no app operation password is configured, SamWaf generates one and saves it in the `application_op_password` field of the same configuration file. Read it from the file and keep it safe for subsequent application operations.
4. Return to Application Management and click **Check again**. Once the running instance reports that the feature is enabled, the original application list appears.

The page provides setup instructions. The configuration file and the settings loaded after restart determine the feature state; the page has no online switch and does not display the operation password. If you change the file to `true` without restarting, checking again still reports the current instance as disabled.

If the check fails, the page shows an error and lets you retry after the network and service recover. A failed check does not mean the feature is disabled. During a restart, wait until the service is available before checking again.

Once enabled, the banner at the top of the page notes: trusted paths (directories allowed to be hosted) are configured via the `application_allow_dirs` field in `conf/config.yml`. Restart SamWaf after changes to take effect.

> Most sensitive operations (create, edit, delete, start, restart, upgrade) require entering the **App Operation Password** first. See the "App Operation Password" section below.

<!-- Image: Application list page -->

## Steps

### 1. Create an Application

1. Click **New App** at the top left (if the app operation password has not been entered yet, the password confirmation dialog appears first).
2. Fill in the form by section:

   **Basic Configuration**
   - **App Name** (required)
   - **Start Command** (required, e.g. `java -jar app.jar` or `./myapp`)
   - **Working Directory**: leave blank to use the server default. The form shows the server-resolved path, allowed directory roots and the relative-path base in real time; save or start failures show the specific reason directly.
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

3. Click **Submit** to create, or **Cancel** to discard. If the initial file upload fails, the application record is kept; you can adjust the settings and submit again in the same dialog to update the existing record and retry the upload without creating a duplicate application.

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

On Linux, first uploads add the owner's execute bit to the initial file permissions while read and write permissions remain subject to the system `umask`. For example, the usual `0644` becomes `0744`, while `0600` under `umask 077` becomes `0700`. Uploading over or upgrading an existing file preserves its ordinary read, write and execute permissions. New backups retain the source file permissions, and rollback restores the permissions recorded in the backup.

If a Linux application already reports `Permission denied`, enter its working directory on the server and check `ls -l ./server-linux-amd64`. If the file owner is also the application's runtime account and the execute bit is missing, run `chmod u+x ./server-linux-amd64`, then start it from the page. For other runtime accounts, set permissions for the actual account and group. Historical backups do not automatically recover execute bits that were already lost. If permissions are correct but startup still fails, check parent-directory access, the filesystem's `noexec` mount option and system access policies.

<!-- Image: Upgrade/Rollback window -->

### 5. View Network

- Click **Network** to view the application's listening ports, connected IPs, and other network information (showing up to 1000 connection records).

### 6. Change Logs

- Click **Change Logs** to open a drawer showing the application's change history. The badge on the button indicates the number of unread changes.
- In **Security Audit**, select **Application Management** to view creation, editing, deletion, lifecycle commands, uploads, upgrades, rollback, log clearing and rejected operation-password checks. Records include the operator, source IP and result; details contain the application code, name, relevant file and processing stage. Application operations are reviewed in Security Audit and are no longer written to the system log.
- Success for an asynchronous command means that it was submitted. Check application status and logs for the actual outcome. If startup fails immediately after upgrade or rollback, the response states that the file was replaced or restored but startup failed, and the audit result is failure. If the application's start status is disabled, upgrade or rollback only replaces or restores the file without starting the application; the response states that the application is disabled and was not started, and the audit result is success.
- New creation and editing change logs keep the actual working directory path, and retain only setting or change summaries for commands and environment variables. Audit records do not contain operation passwords, environment variable values or complete commands.

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

- This password differs from the login password. When Application Management is enabled and no operation password is configured, SamWaf generates one and saves it in the `application_op_password` field of `conf/config.yml` in the installation directory. Read it from that file.
- Enter the password in the confirmation dialog. You can check **Remember for this session** to avoid re-entering it for a period of time.
- An incorrect password shows "Operation password is incorrect, please try again".

## FAQ

- **The working directory does not take effect / the path is unavailable?** The directories that can be hosted are restricted by the `application_allow_dirs` (trusted paths) field in `conf/config.yml`. Restart SamWaf after changing it. The page shows the server-resolved directory and allowed roots; if saving or starting fails, first check whether the path in the message is inside the allowed range.
- **Don't know the app operation password?** Read the `application_op_password` field in `conf/config.yml` in the SamWaf installation directory. If it is still empty after first enablement, confirm that you restarted the correct service or container and that its configuration file is writable.
- **Still shown as disabled after changing the configuration?** Confirm that you edited the file used by the current instance, save it, restart that instance, and click **Check again**.

## Update History

| Applicable version | Changes |
|--------------------|---------|
| >v1.3.25-beta.9 (unreleased) | Linux first uploads add owner execute permission; overwrites and upgrades preserve existing ordinary permissions, while backups and rollback retain source permissions. Application operations appear under Application Management in Security Audit with results and processing stages. Added execute-permission recovery instructions. |
| >v1.3.25-beta.9 (unreleased) | The working directory field now shows the server-resolved path, allowed directory roots and the relative-path base in real time; save or start failures show the specific reason directly; if the initial file upload fails, you can retry it in the same dialog without creating a duplicate application. |
| v1.3.25-beta.9 | Added setup guidance, feature status checks and retries, and instructions for finding the operation password in the configuration file. |
