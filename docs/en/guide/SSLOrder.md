# Automatic Certificate Application  

## 1. Automatic Certificate Application  
The system automatically applies for certificates. Since version **v1.3.9-beta.7**, it supports automatic renewal within 30 days before expiration.  

### 1.1 Adding Port 80 to the Host Configuration  
Currently, file verification is used, requiring **port 80** to be available. Both **port 443** and **port 80** should be enabled simultaneously.  

![Add Port 80 Configuration](/images/ssl_auto_1.png)  

### 1.2 Initiating the First Application  
Click **"Automatic SSL Certificate Application"** in the list.  

![Automatic SSL Certificate Application](/images/ssl_auto_2.png)  

### 1.3 Click "New"  

![Click New](/images/ssl_auto_3.png)  

### 1.4 Fill in the Required Information  
The primary required input is **email**, while other fields are automatically populated. Currently, only **file verification** is supported, with **DNS verification** planned for future updates.  

![Fill in the Required Information](/images/ssl_auto_4.png)  

After clicking **Confirm**, check the list a few times to see if the application was successful.  

**Note:** The default renewal threshold is **30 days**, configurable via `sslorder_expire_day` in the system settings.