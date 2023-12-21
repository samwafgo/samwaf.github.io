# 防护规则
 
## 1 脚本编辑 

### 1.1 从日志进行快速处理

![日志详情](/images/logdetail.png)
选中需要处理的特征值，打开开关 ”快捷加入规则“，选择后点击空白处即可。

### 1.2 选中特征值
![选中特征值](/images/log_select.png)

### 1.3 自动创建规则脚本
![自动创建规则脚本](/images/log_add_rule_script.png)


当前可以针对一下数据进行识别:

```

主机
HOST

网址
URL

网站来路(referrer)
REFERER

用户代理(User-Agent)
USER_AGENT

访问方法
METHOD

访问COOKIES
COOKIES

访问BODY
BODY

请求端口
PORT

访客IP
SRC_IP

访客归属国家
COUNTRY

访客归属省份
PROVINCE

访客归属城市
CITY
```
## 2 界面编辑
当前操作便捷性还不是太方便使用, 推荐使用脚本方式
![界面编辑](/images/manual_rule.png)


## 3 深度学习引擎

待开发