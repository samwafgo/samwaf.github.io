# 快速上手

::: warning
**强烈建议您在测试环境测试充分在上生产，如遇到问题请及时反馈**
:::

## 1.下载最新版本 <Badge text="v1.3.18" type="tip" />
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


## 3.启动访问

http://127.0.0.1:26666

默认帐号：admin  默认密码：admin868 (注意首次进入请把默认密码改掉)

![SamWaf主画面](/images/overview.png)