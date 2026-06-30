---
home: true
heroImage: /images/overview.png
heroText: SamWaf
tagline: 一款开源轻量级的网站应用防火墙
actions:
  - text: 快速上手 💡
    link: /quickstart/
    type: primary
  - text: 软件下载
    link: https://gitee.com/samwaf/SamWaf/releases
    type: secondary 	
	
features:
  - title: 开源
    icon: github
    details: 基于 Apache 2.0 License 代码完全开源,用的放心
	
  - title: 轻量化
    icon: light
    details: 轻量化不依赖三方服务
	
  - title: 私有化部署
    icon: customize
    details: 可部署在Windows、Linux 64位,Linux Arm64架构系统

  - title: 独立引擎
    icon: engine
    details: 防护功能不依赖IIS,Nginx插件形式,摆脱安装复杂兼容等问题
	
  - title: 容器化
    icon: OS
    details: 支持容器化部署 
	
  - title: Bot检测
    icon: check
    details: 百度、谷歌、Bing、搜狗、360搜索、Yisou和字节爬虫
	
  - title: Sql注入检测
    icon: mysql
    details: 识别常规Sql注入

  - title: XSS检测
    icon: javascript
    details: 识别XSS攻击

  - title: 扫描工具检测
    icon: actions
    details: 扫描工具检测

  - title: RCE检测
    icon: interact
    details: RCE检测  
	
  - title: 自定义防护规则
    icon: edit
    details: 支持脚本和界面编辑
	
  - title: 支持IP白名单访问
    icon: back-stage
    details: 白名单内IP可以直接放行	

  - title: 支持IP黑名单访问
    icon: back-stage
    details: 黑名单内IP可以直接封禁

  - title: 支持URL白名单
    icon: back-stage
    details: 白名单内URL可以单独不进行防护过滤

  - title: 支持限制URL访问
    icon: safe
    details: 限制URL不允许外部访问

  - title: 数据脱敏
    icon: storage
    details: 可定义指定URL的输出进行数据脱敏处理

  - title: CC防护
    icon: compare
    details: 可针对访问频率高的IP进行封禁处理					

  - title: 灵活性
    icon: ability
    details: 防护可以灵活设置是全网站应用或者特定网站

  - title: 安全性
    icon: lock
    details: 程序自动化生成,日志加密保存,管理访问加密访问,数据脱敏保存

  - title: 敏感词检测
    icon: filter
    details: 支持敏感词检测直接封禁
	
  - title: SSL文件夹
    icon: folder
    details: 支持SSL文件自动部署
	
  - title: 负载均衡
    icon: proxy
    details: 支持权重负载均衡,ip负载均衡模式

  - title: 自定义IP库
    icon: tool
    details: IP归属库可自行替换完成更新 
		
  - title: owasp 规则集
    icon: tool
    details: 支持最新owasp 规则集
	
  - title: IPv6
    icon: tool
    details: 支持IPv6
	
  - title: SSL自动申请延期
    icon: folder
    details: 支持SSL自动申请延期
	
  - title: 支持自定义拦击界面
    icon: folder
    details: 支持自定义拦击界面

  - title: 支持双因素认证(2FA)
    icon: folder
    details: 支持双因素认证(2FA)

  - title: 防火墙IP封禁
    icon: lock
    details: 操作系统级IP封禁,性能优于应用层黑名单

  - title: 缓存规则
    icon: storage
    details: 对静态资源等进行缓存,降低后端压力并提升访问速度

  - title: 网站访问认证
    icon: back-stage
    details: 为网站开启密码访问,支持HTTP Basic和自定义登录页

  - title: 隧道防护
    icon: proxy
    details: 内网穿透隧道,支持TCP/HTTP并可启用SSL

  - title: 批量任务
    icon: actions
    details: 批量定时执行配置任务

  - title: 密钥管理
    icon: lock
    details: 集中加密保存凭据,用于SSL证书DNS自动申请

  - title: 计划任务
    icon: actions
    details: 内置定时任务统一管理

  - title: 一键修改
    icon: tool
    details: 一键修改宝塔Web端口(仅Linux)

  - title: 防护日志
    icon: check
    details: 风险日志统计与按来源IP下钻分析

  - title: 访问分析
    icon: compare
    details: 访问数据分析与蜘蛛(爬虫)识别

  - title: 通知告警
    icon: interact
    details: 支持多渠道通知告警与订阅

  - title: 开放平台
    icon: engine
    details: 提供开放平台API与密钥管理

  - title: SSL到期检测
    icon: folder
    details: 批量检测SSL证书到期情况
---	
## 项目源码

[![Release](https://img.shields.io/github/release/samwafgo/SamWaf.svg)](https://github.com/samwafgo/SamWaf/releases)
[![Last commit](https://img.shields.io/github/last-commit/samwafgo/SamWaf?style=flat-square&color=blue&logo=github)](https://github.com/samwafgo/SamWaf/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/samwaf/samwaf?style=flat-square&color=blue&label=Docker+Image+Pulls)](https://hub.docker.com/r/samwaf/samwaf)
[![Release Downloads](https://img.shields.io/github/downloads/samwafgo/samwaf/total?style=flat-square&color=blue&label=Release+Downloads)](https://github.com/samwafgo/SamWaf/releases) 
[![Gitee](https://img.shields.io/badge/Gitee-blue?style=flat-square&logo=Gitee)](https://gitee.com/samwaf/SamWaf)
[![GitHub stars](https://img.shields.io/github/stars/samwafgo/SamWaf?style=flat-square&logo=Github)](https://github.com/samwafgo/SamWaf)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square)](LICENSE)

- gitee
[https://gitee.com/samwaf/SamWaf](https://gitee.com/samwaf/SamWaf)
- github
[https://github.com/samwafgo/SamWaf](https://github.com/samwafgo/SamWaf)
 
## 公众号

<img src="/images/mp_samwaf.png" alt="SamWaf 公众号" width="350" />
