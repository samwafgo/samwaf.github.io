# Firewall IP Block

## Overview

Firewall IP Block provides OS-level IP blocking. It performs better than the application-layer blacklist and is suited to malicious IPs that should be completely blocked.

Unlike the application-layer blacklist, Firewall IP Block stops traffic at the operating system firewall, so a blocked IP is rejected before it ever reaches the WAF application.

The top of the page shows four statistics cards giving a live overview of the current block rules: Total, Active, Inactive, and Expired.

<!-- Image: Firewall IP Block list and statistics cards -->

## Prerequisites

This feature relies on the firewall built into the operating system, so it has environment requirements:

| Operating System | Requirement |
| --- | --- |
| Linux | `iptables` is installed (`iptables-save` is required as well), and the SamWaf process is allowed to modify iptables (usually means running as root). |
| Windows | Windows Firewall is turned on (any one of the Domain / Private / Public profiles is enough). |
| macOS | The pf firewall is enabled (`sudo pfctl -e`) and SamWaf runs as root. |

When you open the page, SamWaf probes the current environment automatically. **If the requirements are not met, a yellow banner at the top of the page explains why, the Add Firewall IP Block / Batch Add / Sync Rules buttons are disabled, and the Enable action is hidden from the list.** Existing records can still be viewed, disabled, and deleted (in that case only the management-side records are cleaned up; the OS firewall is not touched).

<!-- Image: Warning banner and disabled buttons when the environment is unsupported -->

### Docker deployment

To use this feature inside a container, all three conditions below must be met:

1. **iptables must be present in the image.** The official SamWaf image ships with it; if you build your own image from a minimal Alpine base, add `apk add --no-cache iptables`.
2. **The container needs the `NET_ADMIN` capability.** Without it the commands fail on permissions even if iptables is installed.
3. **The container must share the host network namespace** (`--network host`). Otherwise the rules are written only into the container's own network namespace and have no effect on traffic reaching the host.

`docker run` example:

```bash
docker run -d --name samwaf-instance \
  --cap-add=NET_ADMIN \
  --network host \
  -v ./conf:/app/conf -v ./data:/app/data -v ./logs:/app/logs -v ./ssl:/app/ssl \
  samwaf/samwaf
```

The equivalent in `docker-compose.yml`:

```yaml
services:
  samwaf-instance:
    image: samwaf/samwaf
    cap_add:
      - NET_ADMIN
    network_mode: host
```

::: warning Note
With `network_mode: host` you can no longer declare `ports` mappings or custom `networks`; the container uses the host network directly.
:::

::: tip Tip
If you cannot meet these container requirements, use the **[IP Blacklist](/en/guide/IPBlack.html)** instead to block at the WAF application layer — it works in any environment.
:::

## Use Cases

- Completely block malicious IPs at the system level, not just at the application layer.
- Import a batch of known malicious IPs or IP ranges.
- Work with the automatic blocking mechanism to block source IPs that trigger rules, temporarily or long term.

## Steps

### Add a single block

1. Click **Add Firewall IP Block** at the top-left of the page.
2. In the dialog, choose the **Website**, enter the **IP Address** and **Block Reason**, and select a **Block Type**.
3. To set an **Expire Time**, pick a specific time; leave it blank for a permanent block.
4. Optionally add a remark, then click **Confirm** to save.

<!-- Image: Add block dialog -->

### Batch add

1. Click the **Batch Add** button.
2. In the **IP List** text box, enter one IP address per line. Single IP and CIDR formats are supported.
3. Choose the **Website**, enter the **Block Reason**, select a **Block Type**, and add remarks.
4. Click **Confirm** to block all of them at once.

### Enable / Disable

- In the action column, an **Inactive** record can be re-enabled with **Enable**; an **Active** record can be turned off with **Disable**.

### Sync Rules

- Click **Sync Rules** to push the management-side block rules to the operating system firewall.

### Clear Expired

- Click **Clear Expired** to remove all block records that have already expired.

### Edit / Delete / Batch Delete

- In the action column, click **Edit** to modify a single rule or **Delete** to remove it.
- Select multiple records and click **Batch Delete** to remove them at once.

## Field Reference

| Field | Description |
| --- | --- |
| Website | The website this block rule belongs to. |
| IP Address | The IP to block. Supports single IP or CIDR format, e.g. `192.168.1.100` or `192.168.1.0/24`. |
| IP List | Used for batch add: one IP address per line, single IP or CIDR format. |
| Block Reason | The reason for the block, for later traceability. |
| Block Type | One of Manual, Auto, or Temporary. |
| Status | Active, Inactive, or Pending. |
| Expire Time | When the block expires. Blank (or 0) means a permanent block; records past their time are shown as expired. |
| Remarks | Custom notes. |

### Block Type

| Type | Description |
| --- | --- |
| Manual | A block added manually by an administrator. |
| Auto | A block created automatically by the system. |
| Temporary | A temporary block. |

### Status

| Status | Description |
| --- | --- |
| Active | The block rule is in effect at the system level. |
| Inactive | The block rule is disabled and no longer in effect. |
| Pending | The block rule has not taken effect yet. |

## FAQ

- **The IP is not blocked immediately after adding it?** Click **Sync Rules** to push the rules to the operating system firewall.
- **How do I make a block permanent?** Leave the expire time blank when adding or editing; the list shows it as **Permanent**.
- **How do I clean up expired records?** Click the **Clear Expired** button at the top.
- **All buttons are greyed out with a "system firewall blocking is not available" message?** The environment does not meet the [prerequisites](#prerequisites). The banner states the exact reason — commonly: `iptables` is not installed on Linux, the process lacks permission to modify iptables (root is required), or Windows Firewall is off. For container deployments, add iptables, the `NET_ADMIN` capability, and `--network host` as described above.
- **The block succeeds inside a container, but the malicious IP can still reach the site?** The container is most likely not running with `--network host`. The rules were written only into the container's own network namespace and do nothing to traffic arriving at the host.
