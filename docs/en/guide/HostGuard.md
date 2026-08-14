# Remote Brute-force Guard

## Overview

Remote Brute-force Guard protects the SSH / RDP logins of **the machine SamWaf itself runs on** — not the websites you have configured inside SamWaf.

It watches the operating system's login failure logs to detect brute-force attempts: once an IP reaches the failure threshold within the detection window, SamWaf tells the system firewall to block it, and releases it automatically when the block expires. Repeat offenders are blocked for progressively longer periods. The page also includes a **Connections** dashboard showing which IPs are currently connected to this machine.

::: warning How this differs from website protection
This feature targets something completely different from [IP Blacklist](/en/guide/IPBlack.html) and [Firewall IP Block](/en/guide/FirewallIPBlock.html): those block requests to your **websites**, while this one blocks SSH / RDP login attempts against your **server**.
:::

Menu location: **System Settings → Remote Brute-force Guard**. The page has six tabs: **Overview**, **Failed Logins**, **Blocked IPs**, **Offender Profiles**, **Connections** and **Settings**.

<!-- Image: Remote Brute-force Guard overview tab -->

## Prerequisites

### Detection (reading login failure logs)

| Operating System | Support |
| --- | --- |
| Linux | SSH supported. Auto-detects `/var/log/secure` and `/var/log/auth.log`; falls back to `journalctl` when neither exists (subscribing to the `sshd`, `sshd-session` and `sshd-auth` identifiers, so it also works with OpenSSH 9.8+ where authentication runs in a separate process). |
| Windows | RDP and network logons supported. Reads event 4625 from the Security channel (logon type 10 for RDP, 3 for network logons) and correlates the `RemoteDesktopServices-RdpCoreTS` channel to fill in the source IP. **Administrator privileges are required**: installing SamWaf as a system service runs it as LocalSystem, which has access; running the executable as a normal user cannot read the Security log. |
| macOS | **Automatic detection is not supported.** Since 10.12 macOS uses the unified logging system (os_log), so sshd authentication details no longer go to syslog and the format differs entirely from Linux. The **Connections** dashboard, **Manual Block**, the block list and automatic expiry all still work normally. |

When the environment cannot collect logs, a red banner at the top of the page explains why.

::: tip Two collection methods on Windows
Windows uses an **event subscription** (`wevtapi`) by default to receive failed logins in real time. On a few systems the subscription is established successfully yet never delivers any event; SamWaf detects this within a minute and automatically **falls back to polling** (`wevtutil`, once every 5 seconds — same functionality, slightly higher latency). The fallback is written to the log and the **Event Source** on the Overview tab changes accordingly; no manual action is needed.

To select polling explicitly, set this system environment variable and restart SamWaf:

```
SAMWAF_HOSTGUARD_WINSRC=wevtutil
```
:::

### Blocking (calling the system firewall)

Block execution relies on the operating system firewall; the requirements are the same as for [Firewall IP Block](/en/guide/FirewallIPBlock.html#prerequisites) (Linux needs `iptables`/`ipset` and sufficient privileges, Windows needs the firewall enabled, macOS needs pf enabled).

**If the firewall is unavailable, the feature automatically degrades to observe mode** — failed logins are still recorded but nothing is blocked — and a yellow banner at the top of the page explains why.

::: tip Detection does not depend on ports
The port recorded in sshd logs is the attacker's **source** port, and Windows 4625 events do not carry the service port at all. So moving SSH to 22222 or RDP to 33890 does not affect detection. The SSH/RDP ports in **Settings** are only used for the "SSH/RDP ports only" block scope and for highlighting in the connection dashboard.
:::

## Steps

### Step 1: Start in observe mode

The feature is disabled by default, and its default mode is **Observe Mode**. Keeping this order is strongly recommended:

1. Open the **Settings** tab and turn on **Enable Host Remote Login Brute-force Guard** at the top.
2. A confirmation dialog lists the addresses that will be automatically exempt; confirm to apply.
3. Leave **Mode** on **Observe Mode** and let it run for a few days.

In observe mode nothing is blocked: no firewall rule is written and no block notification is sent.

<!-- Image: confirmation dialog shown before enabling -->

### Step 2: Check for false positives

Go to the **Failed Logins** tab and filter by **Source**, **IP Address**, **Username Tried** or **Action**. The key thing to verify is that none of your own addresses appear.

The **Action** column has four values:

| Action | Meaning |
| --- | --- |
| Blocked | Threshold reached and the block has been applied. |
| Counted | Counted towards the detection window, threshold not yet reached. |
| Observed | Observe mode: "would have been blocked, but only recorded". |
| Not Counted | Exempt via whitelist, or a soft failure that does not count towards the threshold. |

Each row offers **Block**, **Whitelist**, and **Filter by IP** to quickly list every event from that IP.

<!-- Image: failed logins list -->

### Step 3: Switch to block mode

Once you are satisfied, go back to **Settings**, change **Mode** to **Block Mode** and save. From then on, IPs reaching the threshold are actually blocked and appear under **Blocked IPs**.

### Managing blocks

The **Blocked IPs** tab is the block ledger; filter by IP, source and status (Active / Expired / Released / All). For records that are **Active** you can:

- **Release** — lift the block ahead of schedule.
- **Make Permanent** — turn a time-limited block into a permanent one (shown only for non-permanent records).

Click **Manual Block** to block an IP directly, specifying the **Duration** in minutes (`0` means permanent) and a **Reason**. Manual blocks bypass the whitelist and observe mode.

<!-- Image: blocked IPs list and manual block dialog -->

### Offender profiles

The **Offender Profiles** tab records how many times each IP has been blocked. **This count drives the escalation ladder**: the more often an IP is blocked, the longer the next block lasts. Offenders that stay quiet longer than the memory period start over from level 1.

Row actions include **Reset Level** (the next block starts from level 1 again), **Block Permanently**, **Whitelist** and **Delete**.

<!-- Image: offender profiles list -->

### Connection dashboard

The **Connections** tab shows the current TCP connections on this machine, with five summary cards at the top: total connections, established, listening ports, remote login connections and collection time.

- Filter by **Local Port**, **State** or **Source IP**, or tick **SSH/RDP ports only**.
- Connections on SSH / RDP ports are tagged **Remote Login**; already blocked source IPs are tagged **Blocked**.
- Both manual **Refresh** and **Auto Refresh** (Off / 5s / 10s / 30s, Off by default) are available.
- For source IPs that are not blocked yet, the row offers **Block This IP**.

<!-- Image: connection dashboard -->

### Tuning the escalation ladder

At the bottom of the **Settings** tab is the escalation ladder editor. The Nth time an IP is blocked, the Nth level duration applies; once the count exceeds the highest level, the highest level keeps applying. The defaults are:

| Level | Duration | Notes |
| --- | --- | --- |
| 1 | 5 minutes | First hit — usually just a mistyped password or a passing scanner, so a short block is enough. |
| 2 | 15 minutes | Second hit. |
| 3 | 60 minutes | Third hit. |
| 4 | 1440 minutes (1 day) | Fourth hit. |
| 5 | 0 = permanent | Persistent offender, blocked for good. |

You can **Add Level**, change durations and notes, disable a level with its switch, or delete a level; click **Save Ladder** when done. Enter `0` for a permanent block.

::: tip Why level 1 is so short
Most threshold hits are simply an administrator mistyping a password. With a 5 minute first level, the worst case resolves itself in five minutes.
:::

## Avoid locking yourself out

This is the part that deserves the most attention. SamWaf provides several layers of protection.

### Whitelist (automatic + manual)

The following addresses are **never blocked**; matching any one of them is enough:

1. Loopback addresses (`127.0.0.0/8`, `::1`) — always exempt, no switch controls this.
2. All local interface IPs — always exempt, no switch controls this.
3. Common private ranges (`10/8`, `172.16/12`, `192.168/16`, etc.) — controlled by **Auto-exempt Private Networks**, on by default.
4. Addresses you enter in the **Whitelist** — single IP / CIDR / wildcard / range, comma separated.
5. Narrowed-down ranges from the admin console IP whitelist.
6. **The egress IP you are currently using for the admin console** — valid for 30 minutes and renewed as long as you keep using the console.

The **Settings** tab provides a **Whitelist Check** tool: enter an IP, click **Check**, and it tells you whether the IP is exempt and which rule matched. Verifying your own egress IP with it before switching to block mode is recommended.

<!-- Image: whitelist check tool -->

### If you do get locked out

The same rescue list is printed at the bottom of the **Settings** tab. Try these in order:

1. Turn off the master switch at the top of this page (fastest, as long as you can still reach the admin console).
2. On the server, edit `conf/config.yml`, set `security.host_guard_force_disable` to `true` and restart SamWaf.
3. For container deployments, set the environment variable `SAMWAF_HOSTGUARD_DISABLE=1` and restart.
4. Options 2 and 3 only stop **new** blocks — existing firewall rules must be removed by hand (via a physical console or your cloud provider's VNC):

```bash
# Linux: release a single IP / flush the whole block set
ipset del samwaf_hostguard <IP>
ipset flush samwaf_hostguard

# Windows: delete the block rules (there may be several shards, numbered from 0)
netsh advfirewall firewall delete rule name=SamWAF_Set_samwaf_hostguard_0
```

::: tip Reduce the blast radius
Setting **Block Scope** to **SSH/RDP Ports Only** means that if a false positive happens, only remote login is blocked while web and business ports stay reachable, leaving you far more room to recover. The option is unavailable on macOS and when the execution mode is "Per-rule" (it is greyed out with an explanation in those cases).
:::

## Field Reference

### Detection

| Field | Description |
| --- | --- |
| Enable Host Remote Login Brute-force Guard | Master switch, off by default. While off, no logs are collected and no automatic blocking or releasing happens. |
| Mode | **Observe Mode** (default) only records failed logins, without blocking or notifying; **Block Mode** blocks once the threshold is reached. |
| Detection Window | Time window for counting failures, in minutes. Default 10. |
| Threshold | Action is triggered once failures within the window reach this number. Default 8. |
| Offender Memory | In days, default 7. If an IP stays quiet longer than this, its next block starts from level 1 again. |
| Count Soft Failures | Off by default. Soft failures include pre-auth disconnects (generated in bulk by port scanners and health probes), username enumeration and PAM failure lines (which appear alongside password failure lines, so counting both effectively halves your threshold). |

### Whitelist (false-positive protection)

| Field | Description |
| --- | --- |
| Whitelist | Addresses that are never blocked. Comma separated, supports single IP / CIDR / wildcard / range, e.g. `1.2.3.4,10.0.0.0/8,192.168.1.*`. |
| Auto-exempt Private Networks | On by default. Automatically exempts all local interface IPs, loopback and common private ranges. |
| Whitelist Check | Enter an IP to check whether it is exempt and see which rule matched. |

### Event source & ports

| Field | Description |
| --- | --- |
| Custom Log Paths | Comma separated. Leave empty to auto-detect `/var/log/secure` and `/var/log/auth.log`, falling back to `journalctl`. For container deployments, mount the host log directory read-only and specify the path here. |
| SSH Ports / RDP Ports | Leave empty for auto-discovery; detected ports are shown alongside. Used only for port-scoped blocking and dashboard highlighting — detection itself does not depend on ports. |

### Block execution

| Field | Description |
| --- | --- |
| Block Scope | **All Ports** (default) or **SSH/RDP Ports Only**. The latter has a smaller blast radius on a false positive, but is not supported by every OS and execution mode. |
| Execution Mode | **Auto** (default, adapts to the platform) / **Set (ipset)** / **Per-rule**. The mode actually in use is shown alongside. |
| Windows Sync Debounce | In seconds, default 5. Windows has no ipset and can only rebuild firewall rules in full, so debouncing collapses a burst into a single rebuild. **This value is also the maximum delay before a block is actually written to the firewall** — up to this long between triggering a block and the rule taking effect; the notification is sent immediately. Linux / macOS use incremental updates that take effect at once and are unaffected. |

### Flood protection

| Field | Description |
| --- | --- |
| Max Blocked Entries | Default 10000. Once the limit is reached, temporary blocks with the least remaining time are evicted first; permanent blocks are never evicted. |
| Max New Blocks per Minute | Default 200. Prevents a distributed brute-force attack from filling the block set within seconds. |
| Subnet Aggregation | Off by default. When the number of blocked IPs inside one `/24` reaches the threshold on the right (default 10), the whole subnet is blocked. Effective against botnets, but it may take down an entire data centre or carrier range — enable with care. |
| Send Notification on Block | On by default. Sends an **IP Ban** notification when a block is applied; you must subscribe to that type under [Notification Subscription](/en/guide/NotifySubscription.html) for it to actually be delivered. |

### Connection dashboard

| Field | Description |
| --- | --- |
| Enable Connection Dashboard | On by default. When off, the **Connections** tab no longer collects data. |
| Snapshot Cache | In seconds, default 3. On Linux, collecting the connection table requires walking `/proc` to map inodes to processes, which is noticeably expensive with tens of thousands of connections. Keep this at 3 seconds or above. |

### Failed logins list

| Field | Description |
| --- | --- |
| Time | When the event was collected. |
| Source | SSH or RDP. |
| IP Address / Location | Source IP and its geographic location. |
| Username Tried | The username the attacker tried to log in with. |
| Failure Type | Wrong Password / Public Key Failure / Unknown User / Max Auth Tries Exceeded / User Not Allowed / PAM Auth Failure / Pre-auth Disconnect / Port Scan Probe / RDP Logon Failure. |
| Action | Blocked / Counted / Observed / Not Counted. |
| Count in Window | Failures accumulated by this IP within the detection window. |
| Src Port | The attacker's source port. |
| Raw Log | The raw log line collected; hover to see the full content. |

### Blocked IPs

| Field | Description |
| --- | --- |
| IP Address | The blocked IP; blocks produced by subnet aggregation carry a **Subnet** tag. |
| Level | The ladder level used for this block; manual blocks show **Manual**. |
| Duration / Remaining | The duration and remaining time of this block. Permanent blocks do not count down. |
| Blocked At | When the block started. |
| Status | Active / Expired / Released. |
| Reason | Description of what triggered the block. |

### Offender profiles

| Field | Description |
| --- | --- |
| Block Count | How many times this IP has been blocked in total; determines which ladder level applies next. |
| Level | The escalation level the IP is currently at. |
| Total Failures | Accumulated login failures. |
| First Blocked / Last Blocked | When the IP was first and most recently blocked. |
| Last Reason | Reason for the most recent block. |

### Connections

| Field | Description |
| --- | --- |
| Source IP / Source Port | Address and port of the connecting peer; already blocked source IPs carry a **Blocked** tag. |
| Local Port | The local port being connected to; SSH / RDP ports carry a **Remote Login** tag. |
| State | TCP connection state, such as ESTABLISHED, LISTEN, TIME_WAIT, CLOSE_WAIT. |
| Process | Name of the process owning the connection. |
| Location | Geographic location of the source IP. |

## FAQ

- **Does detection still work if I changed the SSH / RDP port?** Yes. Detection reads login failure logs and is independent of the service port. The port settings only affect the "SSH/RDP ports only" block scope and port highlighting in the connection dashboard.

- **The Failed Logins list stays empty on Windows — how do I troubleshoot?** Check these three in order:

  1. **Is SamWaf running as administrator?** Reading the Security event log requires administrator or LocalSystem privileges; installing it as a system service satisfies this.
  2. **Is the system recording failed logons?** In an elevated PowerShell (quote the GUID, otherwise PowerShell treats `{}` as a script block):

     ```powershell
     auditpol /get /subcategory:"{0CCE9215-69AE-11D9-BED3-505054503030}"
     ```

     "Logon" should read **Success and Failure**; if only Success, enable it with `/set ... /failure:enable`.
  3. **Check the SamWaf log.** Search `logs/log.log` for `主机登录防护`. You should see the subscription being established followed by a message confirming the first Windows security event was received. If only the former appears, SamWaf falls back to polling within a minute and logs the reason.

- **Why isn't a block effective immediately on Windows?** Windows has no ipset and can only rebuild the firewall rules as a whole, so automatic blocks are batched over the window set by **Windows Sync Debounce** (default 5 seconds) — **that value is the maximum delay before a block takes effect**. The notification is sent immediately, which is why you see "notification first, rule shortly after". Manual block, manual release and expiry all take effect at once and are unaffected; Linux / macOS use incremental updates and are also immediate.

- **The banner says "System firewall unavailable, automatically degraded to observe mode".** The environment does not meet the blocking prerequisites; the banner states the exact reason. Follow the [Firewall IP Block prerequisites](/en/guide/FirewallIPBlock.html#prerequisites); container deployments additionally need `--cap-add=NET_ADMIN` and `--network host`.

- **No logs are collected inside a container.** A container cannot see the host's `/var/log`. Mount the host log directory read-only (e.g. `-v /var/log:/host/var/log:ro`) and set **Custom Log Paths** to `/host/var/log/secure`.

- **Can observe mode cause any damage?** No. In observe mode no firewall rule is written and no block notification is sent — events are only recorded as "Observed".

- **What if I block myself?** See [If you do get locked out](#if-you-do-get-locked-out) above. Most commonly the first level blocks for only 5 minutes and clears itself.

- **I already run fail2ban — will they conflict?** Each maintains its own rules and sets and they never delete each other's, but the same IP may be blocked twice. Running just one of them is recommended.

- **Do blocks survive a machine reboot?** The Linux ipset lives in kernel memory and is cleared on reboot. SamWaf replays all unexpired blocks from its database into the system firewall on startup, so no manual recovery is needed.

- **I am not receiving notifications.** Check that **Send Notification on Block** is on, that the **IP Ban** type is subscribed under [Notification Subscription](/en/guide/NotifySubscription.html), and that the corresponding [Notification Channel](/en/guide/NotifyChannel.html) is working.
