# Common Issues

## 1 Port 80 Occupied Situation
Common when SamWaf and the web application server are on the same server.

### 1.1 Integrated Environments

#### 1.1.1 Created with Baota

Need to modify two locations:
```
File 1: /www/server/panel/vhost/nginx/0.default.conf (may not exist initially, wait until a website is created)

File 2: /www/server/panel/vhost/nginx/phpfpm_status.conf
```

#### 1.1.2 Created with PhpStudy

### 1.2 Native Web Environments

#### 1.2.1 Nginx
Change 80 or 443 to another port.

#### 1.2.2 IIS
Change 80 or 443 to another port.

#### 1.2.3 Apache
Change 80 or 443 to another port.
 
## 2 Login-related  
### 2.1 Forgot Password

```
SamWaf64.exe resetpwd  
```