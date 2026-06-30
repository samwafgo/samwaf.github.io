# One-Key Modify

## Overview

Since only one program can occupy a given web port (80, 443) on a single server, to make SamWaf the front-end proxy you need to change the port 80 occupied by BT Panel's Nginx to 81, and 443 to 444. To simplify deployment, SamWaf provides a one-click way to modify the BT Panel web port, keeps a history of each change, and supports one-click restore.

> This feature is available on Linux only.

<!-- Image: One-Key Modify interface -->

## Steps

### 1. Confirm the BT Panel Nginx Configuration Path

The input box at the top is the "BT Panel Nginx configuration default path", with a default value of `/www/server/panel/vhost/nginx`. If your environment differs, change it to the actual path first.

### 2. Run One-Key Modify

Click the "One-Click Modify" button. The system changes port 80 to 81 and port 443 to 444 in the BT Panel Nginx configuration, and adds a record in the list below.

### 3. View Modification Records

The list shows the Operating System, File Path, Restore status, and Creation Time of each change. Click "Details" to view the original and modified content of that change.

<!-- Image: Modification details dialog -->

### 4. Restore a Modification

For records with the "Not Restore" status, click "Restore" and confirm. The system reverts the file to its pre-modification content (this action cannot be undone).

### 5. Delete a Record

Click "Delete" and confirm to remove the modification record.

## Field Reference

| Field | Description |
| --- | --- |
| Operating System | The OS type where the modification was made |
| File Path | The path of the modified configuration file |
| Is Restore | Restore status: Not Restore / Restored |
| Creation Time | When the modification record was created |
| Original Content | The file content before modification (shown in Details) |
| Modified Content | The file content after modification (shown in Details) |

## FAQ

- **Can I use it on Windows?** No, One-Key Modify is Linux only.
- **How do I revert the change?** Find the corresponding "Not Restore" record in the list and click "Restore" to revert to the pre-modification content.
