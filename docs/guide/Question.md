# 常见问题
  
## 1 端口80 被占用情况
常见于当SamWaf和web应用服务器在同一台服务器下。

### 1.1 集成环境

### 1.1.1 使用宝塔创建的

需要修改两处位置
```
文件1: /www/server/panel/vhost/nginx/0.default.conf （首次可能没有，等创建了一个网站就有了）

文件2：/www/server/panel/vhost/nginx/phpfpm_status.conf
```

### 1.1.2 使用PhpStudy创建的

### 2.1 原生Web环境

### 2.1.1 Nginx
修改80或者443为其他端口

### 2.1.2 IIS
修改80或者443为其他端口

### 2.1.3 Apache
修改80或者443为其他端口