# 版本发布
## 20241011 (v1.3.6)
- 新增定义IP数据库 
[https://gitee.com/samwaf/SamWaf/blob/main/docs/ipmodify.md](https://gitee.com/samwaf/SamWaf/blob/main/docs/ipmodify.md)
- 新增SSL证书夹并可以自动加载最新证书信息

![证书加载位置](/images/sslconfig_auto.png)

- 添加docker脚本新增ssl文件夹目录映射 
- 修正数据分析背景颜色问题
- 修正数据分析全选问题
- 修正攻击日志里面页面大小丢失的问题

## 20241008 (v1.3.5)
- 修正如果上游是CDN或者NGINX无法正常访问的问题
主机编辑里面可依据情况 开启或者关闭 来源严格端口

## 20241006 (v1.3.4)
- 1.增加负载均衡

![负载均衡列表](/images/loadbalanceindex.png)。

- 2.运行支持windows 2008r2环境
## 20240925 (v1.3.3)
- 1.当服务形式安装、启动、停止、卸载后操作后回写反馈信息.
- 2.当SamWaf启动完毕显示管理端地址.
- 3.自定义获取上游Proxy Ip
- 4.修正点击页面关闭逻辑问题
- 5:进行Upx压缩减少文件大小

## 20240920 (v1.3.2)
- 1.修正几处多语言问题
- 2.适配流水线编译
- 3.增加拦截敏感词

![敏感词](/images/Sensitive.png)

- 4.增加日志导出sqlite db文件

 ![增加日志导出](/images/export_log_db.png)
 
- 5.正式开源

## 20240903(v1.3.1)
- 1.增加多语言环境
- 2.增加docker环境
```
https://hub.docker.com/r/samwaf/samwaf
```
- 3.重构如果上游服务端失败也正常反馈出来
- 4.修正如果写入失败情况异常的问题
- 5.命令行新增管理员重置密码功能
```
如登录密码丢失可以使用命令行形式重置；

SamWaf64.exe resetpwd

SamWafLinux64 resetpwd
```
- 6.修正被拒情况没有返回403的问题
- 7.修正当仅需要ssl情况下必须要重启才生效的问题
- 8.修正检测内部修改weblog无效的问题
- 
##  20240729(v1.2.2) 
- 修正Thinkphp下提示"此表单不安全,因此,系统已关闭自动填充功能"的问题
  
##  20240712(v1.2.1) 
- 修正重要安全问题
- 新增集中管理

##  20240705(v1.1.10) 
- 主机增加配置排除某些url记录日志的功能	 
- 修正添加主机时候校验返回错误内容问题
- 添加主机时候，按钮距离太近的问题
  
##  20240704(v1.1.9) 
- 提升程序稳定性
- 优化操作流程
- 修正主机导出导入异常问题
  
##  20240703(v1.1.8) 
- 新增一键修改宝塔安装的Nginx默认web端口
- 简化操作修改主机不需要的内容

##  20240603(v1.1.7) 
- 修正腾讯云上Ubuntu 20.04 LTS 无法运行的问题
- 优化部分代码
  
##  20240506(v1.1.6) 
- 主机单独控制搜索引擎bot检测，xss，rce，scan，sql注入 
- 增加请求信息脱敏保存
- 修正CIDR判断问题

##  20240124(v1.1.5) 
- windows升级逻辑调整 
- linux 升级逻辑调整
- 加载配置调整

##  20240118(v1.1.3) 
- 核心数据每次重启进行自动备份
- 日志增加访客身份和header的筛选  
- 实时通讯数据进行加密处理
- 修正主机维护时候逻辑问题
- 提升主机运行状态健壮性

##  20240112(v1.1.2) 
- 减小Linux文件大小
- 增加搜索爬虫的检验  
- 白名单IP和黑名单IP 支持IP网段类型
- 日志时间可排序
- 日志增加耗时记录
 
##  20231230(v1.1.1)
本次版本更新较大
- 重构初始化配置信息
- 重构日期和封装信息
- 首页信息异常信息提示进行轮播处理
- 新增通讯加密
- 增加在线文档
- 增加各主要界面查询
- 提升日志插入效率
- 新增运行状态信息
- 新增日志100W归档
 
##  20231128(v1.0.128) 

- 本地信息进行加密处理
- 修正从详情返回列表日期丢失的问题
- 默认删除180天以前的数据
- 完成国家Country的词云
- 增加世界地图
- 新增主机增加导入和导出功能
- 攻击日志里面点击详情返回时候保持原有的页码和搜索条件
- 增加扫描工具识别

##  20230911(v1.0.116) 

- 新版本支持远程升级
- 修正websocket重连机制


##  20230830(v1.0.113) 

- 重构waf引擎加载过程
- 修正主机修改及时生效 
- 攻击日志增加响应编码的查询
- 改进配置数据的提取方式和备注
- 修正写入日志的时候乱码问题

##  20230828(v1.0.111) 

- 优化和处理resp内容

##  202308271(v1.0.108) 
 
- 新增添加编辑主机时候检测端口可用性
- 新增全局网站配置
- 配置项的动态处理
- 修正规则没有实时更新问题

##  20230825(v1.0.106) 
 
- 增加日志直接添加规则的连带操作
- 增加优化日志列表
- 增加日志快速增加黑名单IP
- 增加响应编码
- 增加删除的天数，从数据库提取

##  20230824(v1.0.105) 
 
- 增加通知频率控制
- 增加自定义Cache
- 修正规则或的情况
- （实验）系统防火墙：linux和windows分离
- 重新整理城市信息汇总
- 
##  20230728(v1.0.103) 
 
- 解决之前无法屏蔽掉特定url日志的问题

##  20230711(v1.0.102) 
 
- 增加新打包编译方式
- 增加如果是特定url记录包含情况
- 增加判断静态资源

##  20230619(v1.0.101) 
 
- 自动启动服务形式，避免服务挂了，无法启动
- 修正删除历史日志的问题
- 新增系统配置
- 重新规划消息通知模板

##  20230601(v1.0.100) 

- 记录最大body的长度，改成全局的
- 
##  20230530(v1.0.100) 

- 修正间隔时间导致cpu和内存长期占用，系统被kill的问题
- 新增内存异常排查

##  20230525(v1.0.99) 

- 优化攻击日志的显示
- 其他地方优化
- 修正规则检测是否存在代码和调整逻辑
- 升级前端框架版本
- 升级数据库ORM版本

##  20230524(v1.0.98) 
- 修正提示错误没有及时return导致 后续还能正常使用的情况
- 修正队列数据可能是为空 导致保存异常

##  20230403(v1.0.97) 
- 修正多项问题
- 增加websocket实时通讯
- 删除主机时候，顺便删掉所有的关联保护信息

##  20230330(v1.0.96) 

- 将耗时信息转入队列
- 登录信息进行消息通知

##  20230329(v1.0.95) 

- 增加系统编译打包版本号
- 增加系统日志

##  20230210(v1.0.94) 

- 日志库独立

##  20230206(v1.0.93) 

- 增加url白名单前缀匹配等比较模式

##  20230204(v1.0.92) 

- 自定义服务器名称

##  20230203(v1.0.91) 

- 初始化账号信息为默认值
- 优化waf引擎
- 增加微信公众号通知推送
- 完善登录和鉴权

##  20230202(v1.0.90) 

- 登录部分的处理
- 增加账号管理和日志的基本内容

##  20221226(v1.0.89) 

- 增加跨站检测
- 增加sql注入检测

##  20221211(v1.0.88) 

- 增加linux相关配置
- 修复host80时候不带端口导致异常问题

##  20221209(v1.0.87) 

- 增加日志查询
- 升级前端版本 

##  20221203(v1.0.86) 

- 增加Windows下文件压缩
- 增加规则访问变量值

##  20221202(v1.0.85) 

- 增加时间区域支持
- 修正主机删除提示错误的问题
- 增加首页看盘IP相关IP情况处理
- 增加首页看盘统计区间数据的处理

##  20221201(v1.0.84) 

- 优化处理消息逻辑
- 修复删除问题
- 增加黑名单IP、限制URL
- 前端增加主机的选择
- 增加ip、url白名单
- 增加url隐私保护
- 增加anticc
- waf引擎升级

##  20221122(v1.0.83) 

- 隐私保护增加：包含、开始、结尾、完全匹配
- 优化waf引擎处理结构
- 增加CC引擎防御保护

##  20221119(v1.0.82) 

- 增加隐私保护url
- 修正url ip新建时候没有置空的bug
- 增加url白名单控制

##  20221111(v1.0.81)

- 增加全局租户处理

##  20221104(v1.0.80)

- 调整目录结构并增加参数

##  20221102(v1.0.79)  
  
- 调整前端增加面包屑
- 整体代码调整	

##  20221101(v1.0.78)  
  
- 整体业务接口重新梳理封装

##  20221031(v1.0.77)  
  
- 增加日志库时间索引

##  20221028(v1.0.76)  
  
- 增加部分脱敏处理，待完善脱敏管理部分
- 增加数据统计累计到天

##  20221027(v1.0.75)  
  
- 增加数据统计部分代码 
- 增加定时器
- 增加前端看板内容处理

##  20221027(v1.0.75)  
  
- 增加数据统计部分代码 
	
##  20221026(v1.0.74)  
  
- 日志倒排
- 重新编译前端

##  20221025(v1.0.73)  
  
- 增加linux版本
- 增加ip限制频率
- 修正无法打包的问题
- 增加手工编写规则的方式
- 增加重启功能 

 