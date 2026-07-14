
# Quick Start

::: warning
**It is strongly recommended to fully test in a staging environment before deploying to production. Please report any issues promptly.**
:::

## 1. Download the latest version <Badge text="v1.3.21" type="tip" />
Gitee: [https://gitee.com/samwaf/SamWaf/releases](https://gitee.com/samwaf/SamWaf/releases)

GitHub: [https://github.com/samwafgo/SamWaf/releases](https://github.com/samwafgo/SamWaf/releases)

## 2. Quick Start

::: tabs

@tab Linux

- install
```
curl -sSO https://update.samwaf.com/latest/install_samwaf.sh && bash install_samwaf.sh install 
``` 

- uninstall
```
curl -sSO https://update.samwaf.com/latest/install_samwaf.sh && bash install_samwaf.sh uninstall 
```

@tab Windows

- Direct start:

```
SamWaf64.exe
```

- As a service As Administration
```
//Install & Start
SamWaf64.exe install && SamWaf64.exe start

//Stop &  Uninstall 
SamWaf64.exe stop && SamWaf64.exe uninstall
``` 

PS:
Note that starting from version v1.3.7-beta.1, if your system is Windows Server 2008 R2, please download SamWaf64ForWin7Win8Win2008.exe to use.

@tab Linux Arm64
For Linux Arm64 architecture, please download the corresponding file SamWaf_Linux_arm64.v*.tar.gz
 
```
./SamWafLinuxArm64 install && ./SamWafLinuxArm64 start
```
@tab Docker
For Docker, please pull the latest version from Docker Hub (https://hub.docker.com/r/samwaf/samwaf)

**Standard start (published ports)**

```
docker run -d --name=samwaf-instance \
           --restart always \
           -p 26666:26666 \
           -p 80:80 \
           -p 443:443 \
           -v /path/to/your/conf:/app/conf \
           -v /path/to/your/data:/app/data \
           -v /path/to/your/logs:/app/logs \
           -v /path/to/your/ssl:/app/ssl \
           samwaf/samwaf


```

Replace the four mount paths with real directories on the host. They are used for:

| Directory | Description |
| --- | --- |
| `/app/conf` | Holds the `config.yml` configuration file. |
| `/app/data` | Database and data files (including `initial_password.txt` generated on a fresh install). |
| `/app/logs` | Runtime logs. |
| `/app/ssl` | SSL certificate files. |

**If you want to use Firewall IP Block**

[Firewall IP Block](/en/guide/FirewallIPBlock.html) drives the host's iptables, so the container needs extra privileges and network settings. Without them the feature is disabled in the UI with an "environment not supported" message:

```
docker run -d --name=samwaf-instance \
           --restart always \
           --cap-add=NET_ADMIN \
           --network host \
           -v /path/to/your/conf:/app/conf \
           -v /path/to/your/data:/app/data \
           -v /path/to/your/logs:/app/logs \
           -v /path/to/your/ssl:/app/ssl \
           samwaf/samwaf
```

- `--cap-add=NET_ADMIN`: grants the container permission to modify iptables (the official image already ships with iptables — no need to install it yourself).
- `--network host`: shares the host network. **Without it, block rules are written only into the container's own network namespace and have no effect on real traffic.**

::: warning Note
With `--network host` you can no longer use `-p` port mappings; the container binds directly to the host's 26666 / 80 / 443 ports.
:::

If you do not need Firewall IP Block, the standard start above is enough — every other feature (including the application-layer [IP Blacklist](/en/guide/IPBlack.html)) works either way.

:::

 
## 3. Start and Access

http://127.0.0.1:26666

Default username: admin  
Default password: admin868  
(Note: Please change the default password upon first login)

::: tip About the initial password
Since v1.3.21-beta.8  no longer use a fixed default password for a **fresh install** — they generate a **random initial password** written to `data/initial_password.txt` in the program directory (the startup log also shows a hint). If `admin868` does not work, open that file to get the initial password. Either way, **change the password immediately after first login**.
:::

![SamWaf Main Screen](/images/overview.png)
