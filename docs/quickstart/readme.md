# 快速上手

::: warning
**强烈建议您在测试环境测试充分在上生产，如遇到问题请及时反馈**
:::

## 1.下载最新版本 <Badge text="v1.3.6" type="tip" />
gitee:  [https://gitee.com/samwaf/SamWaf/releases](https://gitee.com/samwaf/SamWaf/releases)

github: [https://github.com/samwafgo/SamWaf/releases](https://github.com/samwafgo/SamWaf/releases)

## 2.快速启动
### Windows
- 直接启动
```
SamWaf64.exe
```
- 服务形式
```
//安装
SamWaf64.exe install 

//启动
SamWaf64.exe start

//停止
SamWaf64.exe stop

//卸载
SamWaf64.exe uninstall
```

### Linux

- 直接启动
```
./SamWafLinux64
```
- 服务形式
```
//安装
./SamWafLinux64 install 

//启动
./SamWafLinux64 start

//停止
./SamWafLinux64 stop

//卸载
./SamWafLinux64 uninstall
```
::: warning
PS:
注意从v1.3.7-beta.1 开始如果是windows server 2008r2 的系统请下载 SamWaf64ForWin7Win8Win2008.exe 使用。
:::
## 3.启动访问

http://127.0.0.1:26666

默认帐号：admin  默认密码：admin868 (注意首次进入请把默认密码改掉)

![SamWaf主画面](/images/overview.png)