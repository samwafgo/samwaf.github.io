#  双因素认证
 
## 1 双因素认证
 双因素认证（ Two-Factor Authentication、缩写 2FA）是一种安全的登录验证技术。要求用户登录时除密码外，需要额外的身份验证信息从而提升帐号的安全性。可以使用得软件有1Password、 Authy、Microsoft Authenticator 等。
### 1.1 绑定

![双因素绑定](/images/otp_bind.png)
 
- 打开支持的软件进行扫码，扫码后会生成 6位安全码，输入即可完成首次绑定。
 
### 1.2 绑定后登录时候需要输入安全码

![双因素登录](/images/otp_login.png)
 
- 打开支持的软件，看到6位安全码，输入即可，登录即可。

### 1.3 解绑

![双因素解绑](/images/otp_unbind.png)
 
- 打开支持的软件进行扫码，扫码后会生成 6位安全码，输入即可完成解绑原有的信息随之失效。

PS:如果admin设置了2FA登录，但是丢失了，SamWaf策略为可以在程序目录下执行：

```
SamWafLinux64 resetotp
```

执行后即可清除2fa原有绑定信息。