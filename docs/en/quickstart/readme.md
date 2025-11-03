
# Quick Start

::: warning
**It is strongly recommended to fully test in a staging environment before deploying to production. Please report any issues promptly.**
:::

## 1. Download the latest version <Badge text="v1.3.17" type="tip" />
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

```
docker run -d --name=samwaf-instance \
           -p 26666:26666 \
           -p 80:80 \
           -p 443:443 \
           -v /path/to/your/conf:/app/conf \
           -v /path/to/your/data:/app/data \
           -v /path/to/your/logs:/app/logs \
           -v /path/to/your/ssl:/app/ssl \
           samwaf/samwaf


```
:::

 
## 3. Start and Access

http://127.0.0.1:26666

Default username: admin  
Default password: admin868  
(Note: Please change the default password upon first login)

![SamWaf Main Screen](/images/overview.png)
