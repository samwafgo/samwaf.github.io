# 快速上手

::: warning
**强烈建议您在测试环境测试充分在上生产，如遇到问题请及时反馈**
:::

## 1.下载最新版本 <Badge text="v1.3.22" type="tip" />
gitee:  [https://gitee.com/samwaf/SamWaf/releases](https://gitee.com/samwaf/SamWaf/releases)

github: [https://github.com/samwafgo/SamWaf/releases](https://github.com/samwafgo/SamWaf/releases)

## 2.快速启动

::: tabs

@tab Linux

- Linux 一键自动下载并安装脚本
```
curl -sSO https://update.samwaf.com/latest/install_samwaf.sh && bash install_samwaf.sh install 
``` 

- Linux 一键卸载脚本
```
curl -sSO https://update.samwaf.com/latest/install_samwaf.sh && bash install_samwaf.sh uninstall 
```
 

@tab Windows

- 直接启动
```
SamWaf64.exe
```
- 服务形式(安装服务需以管理员身份运行cmd)
```
//安装并启动
SamWaf64.exe install && SamWaf64.exe start

//停止并卸载
SamWaf64.exe stop && SamWaf64.exe uninstall
```



PS:
注意从v1.3.7-beta.1 开始如果是windows server 2008r2 的系统请下载 SamWaf64ForWin7Win8Win2008.exe 使用。

@tab Linux Arm64
Linux Arm64架构请下载对应的文件 SamWaf_Linux_arm64.v*.tar.gz
 
```
./SamWafLinuxArm64 install && ./SamWafLinuxArm64 start
```
@tab Docker
请到dockerhub拉取最新版本 (https://hub.docker.com/r/samwaf/samwaf)

**常规启动（端口映射模式）**

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

四个挂载目录请换成宿主机上的真实路径，作用如下：

| 目录 | 说明 |
| --- | --- |
| `/app/conf` | 配置文件 `config.yml` 所在目录。 |
| `/app/data` | 数据库与数据文件（含首次安装生成的 `initial_password.txt`）。 |
| `/app/logs` | 运行日志。 |
| `/app/ssl` | SSL 证书文件。 |

**需要使用「防火墙IP封禁」时**

[防火墙IP封禁](/guide/FirewallIPBlock.html) 会调用宿主机的 iptables，容器需要额外的权限和网络配置，否则页面上该功能会被禁用并提示环境不支持：

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

- `--cap-add=NET_ADMIN`：授予容器操作 iptables 的权限（官方镜像已内置 iptables，无需自行安装）。
- `--network host`：与宿主机共享网络。**不加这个参数，封禁规则只写入容器自身的网络命名空间，对真实流量不生效。**

::: warning 注意
使用 `--network host` 后不能再写 `-p` 端口映射，容器直接使用宿主机的 26666 / 80 / 443 端口。
:::

如果不需要防火墙IP封禁，用上面的常规启动即可，其余功能（含应用层 [IP黑名单](/guide/IPBlack.html)）都不受影响。

:::


## 3.启动访问

http://127.0.0.1:26666

默认帐号：admin  默认密码：admin868 (注意首次进入请把默认密码改掉)

::: tip 关于初始密码
自v1.3.21-beta.8版本在**全新安装**时不再使用固定默认密码，而是生成**随机初始密码**并写入程序目录下的 `data/initial_password.txt`（启动日志也会提示）。若用 `admin868` 无法登录，请打开该文件获取初始密码。无论哪种方式，**首次登录后请立即修改密码**。
:::

![SamWaf主画面](/images/overview.png)
