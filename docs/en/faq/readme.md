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


::: tabs

@tab Linux

```
./SamWaf64 resetpwd  
```

@tab Windows

```
SamWaf64.exe resetpwd  
```
:::
 

### 2.2 Token Expiration  
For security reasons, starting from v1.3.10-beta.4, the token has an expiration time.

You can modify it according to your needs:  
```
Menu Path: System Settings -> Parameter Settings

token_expire_time  
The validity period of the management platform token, in minutes (default is 5 minutes)
```

There are two scenarios for token expiration:  
1. The token expires after the set time.  
2. The token becomes invalid when the account is logged in from a different IP address.  


### 2.3 2FA Secret Code cannot Login

::: tabs

@tab Linux

```
./SamWaf64 resetotp  
```

@tab Windows

```
SamWaf64.exe resetotp  
```
:::

## 3 Admin Console  

### 3.1 How to Change the Default Port  

Go to the `config.yml` file in the root directory's `conf` folder:  
```yaml
local_port: 26666  // Local management port  
