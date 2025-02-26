# Two-Factor Authentication (2FA)

## 1 Two-Factor Authentication
Two-Factor Authentication (2FA) is a secure login authentication technology. It requires users to provide additional authentication information beyond their password during login to enhance account security. Supported applications include 1Password, Authy, Microsoft Authenticator, etc.

### 1.1 Binding

![2FA Binding](/images/otp_bind.png)

- Open a supported application to scan the QR code. A 6-digit security code will be generated after scanning. Enter the code to complete initial binding.

### 1.2 Post-Binding Login

![2FA Login](/images/otp_login.png)

- Open the supported application to view the 6-digit security code. Enter the code to log in.

### 1.3 Unbinding

![2FA Unbinding](/images/otp_unbind.png)

- Open a supported application to scan the QR code. A 6-digit security code will be generated after scanning. Enter the code to unbind, which will invalidate the original binding information.

PS: If an admin has enabled 2FA login but lost access, the SamWaf policy allows executing the following command in the program directory:


```
SamWafLinux64 resetotp
```

This command will clear all existing 2FA binding information.
