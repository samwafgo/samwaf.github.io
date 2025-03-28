# 常见问题
  
## 1 端口80 被占用情况
常见于当SamWaf和web应用服务器在同一台服务器下。

### 1.1 集成环境

#### 1.1.1 使用宝塔创建的

需要修改两处位置
```
文件1: /www/server/panel/vhost/nginx/0.default.conf （首次可能没有，等创建了一个网站就有了）

文件2：/www/server/panel/vhost/nginx/phpfpm_status.conf
```

#### 1.1.2 使用PhpStudy创建的

### 1.2 原生Web环境

#### 1.2.1 Nginx
修改80或者443为其他端口

#### 1.2.2 IIS
修改80或者443为其他端口

#### 1.2.3 Apache
修改80或者443为其他端口

## 2 登录相关
### 2.1 密码忘记了

```
SamWaf64.exe resetpwd  
```

### 2.2 口令失效
为了安全自v1.3.10-beta.4版本，将token增加实效性。

可以依据实际情况更改：
```
菜单路径：系统设置->参数设置

token_expire_time
管理平台令牌有效期，单位分钟（默认5分钟）  

```
 

令牌有两种失效情况：第一种是令牌到期失效， 第二种是帐号使用不同IP登录

### 2.3 2FA安全码无法登录

```
SamWaf64.exe resetotp  
```

## 3 管理端相关

### 3.1 如何切换默认的端口端口

根目录 conf，文件config.yml
```
local_port: 26666 // 本地管理端口 
```
 