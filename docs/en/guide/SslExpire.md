# SSL Certificate Bulk Expiration Check

## 1 SSL Certificate Bulk Expiration Check  
Supported since v1.3.9-beta.9, this feature automatically checks expiration status every day at 6 AM. It supports manually adding domains and ports, and allows one-click synchronization of SSL domains that are already under protection.

### 1.1 View Expiration Status  
View the expiration status of SSL certificates for registered domains.

![View SSL certificate expiration status for registered domains](/images/ssl_expire_check.png)

### 1.2 Synchronize Existing Host Information  
Click "Synchronize Existing Host Information"  
This will automatically import HTTPS domains under protection into the check list. If they already exist, they will be ignored; if not, they will be added.

### 1.3 Manual Check  
Click "Check" to initiate a manual SSL expiration check. 