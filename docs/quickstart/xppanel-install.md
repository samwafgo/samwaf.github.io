# 小皮面板部署

## 安装小皮面板

```shell
# [Ubuntu/Debian]
sudo wget -O install.sh https://dl.xp.cn/dl/xp/install.sh && sudo bash install.sh

# [RedHat/CentOS]
sudo curl -O https://dl.xp.cn/dl/xp/install.sh && sudo bash install.sh

# [通用脚本/其他系统]
if [ -f /usr/bin/curl ];then curl -O https://dl.xp.cn/dl/xp/install.sh;else wget -O install.sh https://dl.xp.cn/dl/xp/install.sh;fi;bash install.sh
```

关于 小皮面板 的安装部署与基础功能介绍，请参考 [小皮面板 官方文档](https://doc.xp.cn/linux)。在完成了 小皮面板 的安装部署后，根据提示网址打开浏览器进入 小皮面板，如下界面。

![安装小皮面板](/images/xppanel_home.png)

## 一键安装 SamWaf

1. 点击左侧 软件商店 > 全部软件 > SamWaf > 安装

![小皮面板一键安装1](/images/xppanel_install1.png)

2. 开始安装后会输出安装进度

![小皮面板一键安装2](/images/xppanel_install2.png)

3. 安装完成后根据提示访问即可

![小皮面板一键安装3](/images/xppanel_install_finish.png)
