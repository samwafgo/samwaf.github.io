
# Quick Start

::: warning
**It is strongly recommended to fully test in a staging environment before deploying to production. Please report any issues promptly.**
:::

## 1. Download the latest version <Badge text="v1.3.15" type="tip" />
Gitee: [https://gitee.com/samwaf/SamWaf/releases](https://gitee.com/samwaf/SamWaf/releases)

GitHub: [https://github.com/samwafgo/SamWaf/releases](https://github.com/samwafgo/SamWaf/releases)

## 2. Quick Start

### Windows
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

### Linux

- install
```
curl -sSO http://update.samwaf.com/latest/install_samwaf.sh && bash install_samwaf.sh install 
``` 

- uninstall
```
curl -sSO http://update.samwaf.com/latest/install_samwaf.sh && bash install_samwaf.sh uninstall 
```

::: warning
PS:
Note that starting from version v1.3.7-beta.1, if your system is Windows Server 2008 R2, please download SamWaf64ForWin7Win8Win2008.exe to use.
:::

### For Linux Arm64 architecture, please download the corresponding file

### For Docker, please pull the latest version from Docker Hub

## 3. Start and Access

http://127.0.0.1:26666

Default username: admin  
Default password: admin868  
(Note: Please change the default password upon first login)

![SamWaf Main Screen](/images/overview.png)
