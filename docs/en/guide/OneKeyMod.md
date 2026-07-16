# One-Key Modify

## Overview

Since only one program can occupy a given web port (80, 443) on a single server, to make SamWaf the front-end proxy you need to change the port 80 occupied by BT Panel's Nginx to 81, and 443 to 444. To simplify deployment, SamWaf provides a one-click way to modify the BT Panel web port, keeps a history of each change, and supports one-click restore.

This page has two tabs:

- **Port One-click Modify**: switch BT Panel Nginx ports 80/443 (below, Linux only).
- **Batch Import Sites**: extract sites from an Nginx configuration in bulk and add them as protected hosts (see the "Batch Import Sites" section at the end).

> "Port One-click Modify" is available on Linux only.

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

## Batch Import Sites

On the "Batch Import Sites" tab you can convert Nginx site configurations into SamWaf "protected hosts" in bulk, which makes it easy to add many sites quickly when onboarding environments such as BT Panel. You can also open this tab by clicking the "Batch Import Nginx Sites" button on the "Protected Hosts" page.

> This feature only reads and parses the configuration; it never modifies any Nginx file.

<!-- Image: Batch Import Sites interface -->

### 1. Choose the Config Source

- **Paste Text**: paste the Nginx `server { ... }` configuration into the text box; multiple server blocks are supported at once.
- **Scan Directory**: enter the BT Panel Nginx vhost directory (default `/www/server/panel/vhost/nginx`); the system reads and parses the `.conf` files in that directory. For security, the scan directory must be a BT Panel vhost directory (the path must contain `server/panel/vhost`), and only `.conf` files are read.

After clicking "Parse", each `server` block produces one host candidate to be added.

### 2. Review and Batch Edit

The parsed results are shown in a table where you can select the rows to add and edit them per row. The "Batch Edit" bar above the table lets you set "Upstream IP, SSL Cert, Force HTTPS, Start, Remarks" at once; click "Apply to Selected" to apply them.

Port and domain mapping rules:

- The parsed `listen` port is used as the **backend upstream port** (Upstream Port), and the upstream IP defaults to `127.0.0.1`;
- SamWaf's public port follows `http=80 / https=443`;
- When a `server_name` contains multiple domains, they are merged into one host: the first becomes the primary domain and the rest go to "Bound Domains";
- A site with `listen ... ssl` or an `ssl_certificate` is marked as HTTPS (public 443), and you must bind a configured certificate in "SSL Cert", otherwise port 443 has no certificate and cannot serve properly.

### 3. Add Hosts

Click "Add Selected Hosts". The system creates the protected hosts one by one and shows the success or failure reason in the "Result" column (e.g. "the site and port already exist"). When done, click "Go to Protected Hosts" to view them.

### Field Reference (Batch Import)

| Field | Description |
| --- | --- |
| Primary Domain | The first domain of server_name, used as the host domain |
| Bound Domains | The remaining domains of server_name, one per line |
| SSL | Whether it is an HTTPS site (public 443) |
| Public Port | SamWaf's public listening port (http default 80 / https default 443) |
| Upstream IP | The real backend service address, default 127.0.0.1 |
| Upstream Port | The parsed listen port (backend service port) |
| root | The Nginx site root directory, for reference only; not used for proxying |
| Source File | In Scan Directory mode, the `.conf` file the candidate was parsed from |
| Result | The add result: success / failure reason |

## FAQ

- **Can I use it on Windows?** "Port One-Key Modify" is Linux only; the "Paste Text" mode of "Batch Import Sites" is not restricted to any OS.
- **How do I revert the change?** Find the corresponding "Not Restore" record in the list and click "Restore" to revert to the pre-modification content.
- **The Scan Directory reports "directory is not within the allowed range"?** For security, the scan directory must be a BT Panel Nginx vhost directory (the path must contain `server/panel/vhost`). Use the correct vhost directory, or switch to the "Paste Text" mode.
- **An imported HTTPS site is unreachable after being added?** An HTTPS site needs a certificate bound for public port 443. Select a configured certificate in the "SSL Cert" field of the Batch Edit bar before adding, or add the certificate afterward on the Protected Hosts page.
