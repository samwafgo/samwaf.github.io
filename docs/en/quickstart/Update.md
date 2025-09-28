# Version Releases 

## 2025-09-28 (v1.3.16)

- Optimized access performance

- Added support for customizing SSL maximum and minimum versions

- Added support for custom title and content in capjs

- Added batch deletion of disabled IPs

- Added display of CPU, memory, and disk usage

- Added option to show remarks in host list

- Added batch deletion of sensitive words

- Added batch deletion of whitelist entries

- Added batch deletion of URL access restrictions

- Added batch deletion of rules

- Added support for custom ACME Endpoint to be compatible with ZeroSSL and self-hosted ACME-compatible CAs such as StepCA

- Added “log-only mode” to test protection effectiveness without blocking

- Added query by access identifier

- Added option to store access logs into the database

```
New config parameter:  

log_persist_enable   Enable log persistence (1 = enabled, 0 = disabled)  
```

- Added rule engine support to extract and evaluate specific header values

- Added support for Proxy Protocol v1/v2

```
New config parameter:  

enable_proxy_protocol   Enable Proxy Protocol (1 = enabled, 0 = disabled)  
```

- Fixed issue with `Content-Encoding: br`

- Fixed backend login detection logic

```
New config parameters:  

enable_device_fingerprint   Enable device fingerprint authentication (1 = enabled, 0 = disabled)  
enable_strict_ip_binding    Enable strict IP binding (1 = enabled, 0 = disabled; recommended disabled when fingerprint is enabled)  
```

- Fixed timestamp display issue in attack logs

- Fixed abnormal APK download issue

- Fixed TCP connection closing bug

- Fixed handling of `Content-Encoding` in requests (thanks to @Cycloctane)
 
## 20250623 (v1.3.15) 
- Added support for applying SSL certificates under the same provider with different accounts  
- Added batch import functionality for sensitive words  
- Added support for pure static web sites  
- Added configuration option to enable debug logs  
- Added support for importing `.crt` and `.key` files from certificate folders  
- Added ability to delete large log files online  
- Added support for HTTP to HTTPS redirection on the same port  
- Fixed issue where `event_stream` could not respond properly  
- Fixed memory leak issue in health check  
- Fixed corrupted attachment download issue  
- Fixed issue where forced HTTP to HTTPS redirection used default port 80  
- Optimized SSL certificate file verification method  
- Optimized quick Linux deployment process  
- Optimized batch import with manual and scheduled execution support  

## 20250527 (v1.3.14) 
- Added WAF management interface whitelist access  
You can add whitelist access control in System Settings -> Management Configuration. By default, all access is allowed. If specific IPs or IP ranges are configured, only those will be allowed access.  
![Management Interface Whitelist Access](/images/management_whiteip.png)

- Added DNS-based SSL certificate application method  
![DNS-based SSL Certificate Application](/images/dns_apply.png)

- Added cache support for both memory and file  
![Cache Configuration](/images/cacheconfig.png)

- Added whitelist and blacklist support for tunnel management  
![Tunnel](/images/tunnel1.png)  
![Tunnel Connection](/images/tunnel3.png)

- Added log library partitioning by size

- Added support for wildcard domains without specific domain IPs  
![Wildcard Domain without Specific IP](/images/unhost.png)

- Added meta encoding extraction

- Added default encoding setting  
![Default Encoding Setting](/images/default_encoding.png)

- Added Alipay payment callback IP

- Fixed logic handling for health check disable

- Fixed slow performance issue when importing over 100,000+ IPs in batch

- Fixed delayed index creation for new user databases

- Optimized configuration file writing logic

- Optimized import for latest Excel library

## 20250504 (v1.3.13)  
- Added crawler access analysis  
- Added whitelist processing for WeChat Pay and Alipay  
- Optimized upgrade strategy: added beta version, reduced engine restart time, and enabled automatic backup of old versions

## 20250423 (v1.3.12)
- Added anti-leech (hotlink protection) feature  
- Fixed issue with host editing not working properly  
- Fixed WebSocket communication failure  
- Fixed conflict between CAPTCHA and certificate application  
- Fixed issue with certificate selection for hosts  

## 20250407 (v1.3.11)
**Important Update: v1.3.11 fixes a certificate application bug. Please check your site. If the bound certificate appears as a string of code instead of a valid certificate, please reissue or reapply for the certificate.**

- Added human-machine graphical verification (adaptive to Chinese and English)
- Added website health check
- Added logging of time consumption for each processing stage
- Added configuration to hide the Server response header (1 to hide, 0 to show)
- Added directory traversal vulnerability detection
- Added configuration for mandatory 2Fa binding
- Added option to enable or disable backend HTTPS certificate validity verification (no validation of backend certificate)
- Added one-click bulk switch to enable website defense
- Added logging of response header information
- Fixed SSL certificate application issue
- Fixed SQL detection issue
- Fixed slow single IP query issue
- Fixed issue with handling 301 and 302 redirects from backend during automatic certificate request (well-known)
- Fixed misleading success message when default port is already in use
- Fixed response encoding issue
- Fixed case-sensitivity issue when detecting URLs in whitelist, blacklist, and privacy protection
- Fixed frontend parameter passing error with AI assistant feature in Firefox
- Fixed abnormal traffic statistics issue
- Optimized unified log display
- Optimized rule code and added automatic rule generation by bot
- Optimized Docker with new `beta` tag to indicate the latest version


## 20250303 (v1.3.10)
::: warning
  Important Update: v1.3.10 introduces security enhancements - 
  1. Default token validity period set to 5 minutes (adjustable)
  2. Added Two-Factor Authentication (2FA) for login
:::
- Enhanced security
- Added attack log page
- Added token expiration time configuration
```
System Settings - Parameter Configuration

token_expire_time Management console token validity period, in minutes (default 5 minutes)
```
- Added Two-Factor Authentication (2FA)
![Two-Factor Authentication Binding](/images/otp_bind.png)
- Added online debugging toggle
- Added custom interception interface
![Custom Blocking Page](/images/blocking_page.png)
- Added bulk import of IP blacklist
- Initial integration with Deepseek
- Added sensitive word filtering for request/response content (block/replace)
- Fixed inaccurate statistics on the dashboard
- Resolved compilation issues
- Optimized crawler handling logic
- Improved log query performance
- Upgraded to latest libinjection library

## 20250116 (v1.3.9)  
::: warning  
**Important Update:** v1.3.9 introduces access timeout control. Previously, there was no limit, allowing for infinite waits, which could lead to resource locking issues. The new version defaults to 60 seconds. If set to 0, there will be no limit. Please adjust according to your needs.  
:::  

- Enhanced stability.  
- Added support for binding multiple domains simultaneously.  
  ![Bind Multiple Domains](/images/bind_more_domain.png)  
- Added the ability to sort protected hosts by creation time.  
- Added the option to copy logs with sensitive data masked.  
- Added support for automatic SSL certificate requests and renewal before expiration.  
  [SSL Auto Request Operation Manual](https://doc.samwaf.com/guide/SSLOrder.html)  
- Added bulk SSL certificate expiration checks.  
  [Bulk SSL Certificate Expiration Check](https://doc.samwaf.com/guide/SslExpire.html)  
- Added support for website account and password access.  
  ![Website Account and Password Access](/images/password_visit.png)  
- Added support for timeout configuration.  
  ![Timeout Configuration](/images/response_timeout.png)  
- Added internal task management interface.  
- Fixed website import and export functionality.  
  ![Website Import](/images/import_host.png)  
- Optimized Docker release strategy: latest for stable releases, separate tags for the latest test versions.  

## 20241204 (v1.3.8)
- Enhanced stability
- Added IP ranking display on the homepage

![Homepage IP Ranking Display](/images/iprank.png)

- Added CC defense lock time

![CC Defense Lock Time](/images/cclocktime.png)

![CC Unlock IP Restriction](/images/ccunlock.png)

- Added wildcard domain support for protected websites
- Added backend IP support for domain names to solve the issue of frequently changing DDNS public IP addresses
- Added option to hide SamWaf identification
- Added support for Linux Arm64 architecture/Docker Arm64 architecture
- Added bulk import of IPs from files or remote URLs to the IP whitelist
- Added OWASP rule set
```
System Settings -> Parameter Settings: Added a new configuration:
enable_owasp Enable OWASP data detection (1 to enable, 0 to disable)
```
- Added real-time viewing of website QPS/active connections
- Added support for IPv6 country-level recognition
- Fixed issue where IP country recognition showed as 0
- Fixed multi-language issue with URLs
- Fixed issue preventing the deletion of newly added management accounts
- Fixed logic issue with IP whitelist and URL whitelist
- Fixed frontend search layout display issue
- Optimized PHP URL decoding function

## 20241105 (v1.3.7)
- Improved stability
- Added restrictions on incorrect login passwords and log recording.
```
System Settings -> Parameter Settings added 1 configuration:
login_max_error_time Maximum number of errors allowed during the login period: default 3
login_limit_minutes Login error recording period in minutes: default 1 minute
```
- Added WebLog access records can be sent to Kafka
```
System Settings -> Parameter Settings added 3 configurations:
kafka_enable Whether to activate Kafka transfer (0: not activated; 1: activated)
kafka_url   Kafka URL address
kafka_topic   Kafka topic  
```
- Added Windows 2008 R2 dedicated version release
```
SamWaf64ForWin7Win8Win2008.exe
```
- Added log library indexing to improve log viewing speed
- Added default robots.txt to block crawlers for the management side
- Fixed the issue where Docker timezone settings do not take effect
- Fixed the issue of not being able to distinguish between the same domain but different ports when viewing logs
- Added default forced redirection from 80 to 443
![80 jump 443](/images_en/jumpsslen.png)
```
System Settings -> Parameter Settings added 1 configuration:
redirect_https_code Default HTTP redirect code: 301.
```
- Fixed the issue of not being able to access the site properly when the backend is HTTPS
- Optimized the SSL certificate loading mechanism
- Optimized the custom locations for SSL certificate and key files

- Fixed the issue of not staying on the current page after modifying or deleting a website
- Fixed the issue where the website could still be accessed if the startup status was closed


## 20241011 (v1.3.6)
- Added IP database definition 
[https://gitee.com/samwaf/SamWaf/blob/main/docs/ipmodify.md](https://gitee.com/samwaf/SamWaf/blob/main/docs/ipmodify.md)
- Added SSL certificate folder and automatic loading of the latest certificate information

![Certificate Loading Location](/images/sslconfig_auto.png)

- Added Docker script for SSL folder directory mapping 
- Fixed background color issue in data analysis
- Fixed select all issue in data analysis
- Fixed page size loss issue in attack logs

## 20241008 (v1.3.5)
- Fixed access issue when upstream is CDN or NGINX
You can enable or disable strict source port in host editing as needed.

## 20241006 (v1.3.4)
- 1. Added load balancing

![Load Balancing List](/images/loadbalanceindex.png)

- 2. Running supports Windows 2008r2 environment
## 20240925 (v1.3.3)
- 1. Feedback information will be written back after the service is installed, started, stopped, or uninstalled.
- 2. Display management endpoint address after SamWaf starts.
- 3. Custom upstream Proxy IP retrieval
- 4. Fixed click page closure logic issue
- 5. Performed UPX compression to reduce file size

## 20240920 (v1.3.2)
- 1. Fixed several multilingual issues
- 2. Adapted for pipeline compilation
- 3. Added interception of sensitive words

![Sensitive Words](/images/Sensitive.png)

- 4. Added log export to SQLite DB file

 ![Log Export](/images/export_log_db.png)
 
- 5. Officially open-sourced

## 20240903(v1.3.1)
- 1. Added multilingual environment
- 2. Added Docker environment
```
https://hub.docker.com/r/samwaf/samwaf
```
- 3. Refactored to provide normal feedback when upstream server fails
- 4. Fixed abnormal issues when writing fails
- 5. Added administrator reset password feature in command line

```
If the login password is lost, you can use the command line to reset it;


SamWaf64.exe resetpwd

SamWafLinux64 resetpwd
```
- 6. Fixed issue where no 403 was returned for denied cases
- 7. Fixed issue where SSL must be restarted to take effect
- 8. Fixed issue where internal modified weblog detection is invalid
 
 ## 20240729(v1.2.2)
- Fixed the issue in ThinkPHP where the message "This form is not secure, therefore, the system has disabled the auto-fill feature" was displayed.
 
 ## 20240712 (v1.2.1)
 
- Fixed important security issues
- Added centralized management

 ## 20240705 (v1.1.10)
 
- Issue with buttons being too close when adding a host
- Added functionality for hosts to configure and exclude certain URLs from logging
- Corrected the problem of incorrect content being returned during host addition validation

 ## 20240704 (v1.1.9)
- Enhanced program stability
- Optimized operational procedures
- Fixed host export and import exception issues

 ## 20240703 (v1.1.8)
- Added a one-click option to modify the default web port of Nginx installed by BT
- Simplified operations to remove unnecessary content from the host

 ## 20240603 (v1.1.7)
- Fixed the issue of Ubuntu 20.04 LTS not running on Tencent Cloud
- Optimized some code

## 20240506 (v1.1.6)
- Independent control of host for search engine bot detection, XSS, RCE, scanning, and SQL injection 
- Added request information desensitization preservation
- Fixed CIDR judgment issue
 
## 20240124 (v1.1.5)
- Windows upgrade logic adjustment.
- Linux upgrade logic adjustment.
- Configuration loading adjustment.

## 20240118 (v1.1.3)
- Automatic backup of core data upon each restart.
- Log addition of visitor identity and header filtering.
- Encryption processing of real-time communication data.
- Fixed logic issue during host maintenance.
- Improved robustness of host running status.

## 20240112 (v1.1.2)
- Reduced Linux file size.
- Added search engine crawler verification.
- Whitelist and blacklist IP now support IP range types.
- Log time can be sorted.
- Log now includes time-consuming records.

## 20231230 (v1.1.1)
This version update is significant.
- Refactored initialization configuration information.
- Refactored dates and encapsulated information.
- Homepage information exception handling now includes carousel processing.
- Added communication encryption.
- Added online documentation.
- Added queries for major interfaces.
- Improved log insertion efficiency.
- Added runtime status information.
- Added log archiving for 1 million entries.

## 20231128 (v1.0.128)
- Local information is now encrypted.
- Fixed date loss issue when returning from details to the list.
- Default deletion of data older than 180 days.
- Completed country word cloud.
- Added world map.
- Added host import and export functions.
- Maintained page and search conditions when returning from attack log details.
- Added scan tool recognition.

## 20230911 (v1.0.116)
- New version supports remote upgrade.
- Fixed WebSocket reconnection mechanism.

## 20230830 (v1.0.113)
- Refactored WAF engine loading process.
- Host modifications now take effect immediately.
- Attack log now includes response code query.
- Improved extraction method and remarks for configuration data.
- Fixed encoding issue when writing logs.

## 20230828 (v1.0.111)
- Optimized and processed resp content.

## 202308271 (v1.0.108)
- Added check for port availability when adding or editing hosts.
- Added global website configuration.
- Dynamic handling of configuration items.
- Fixed the issue of rules not updating in real-time.

## 20230825 (v1.0.106)
- Added direct rule addition from logs.
- Added optimization of log list.
- Added quick addition of blacklist IPs from logs.
- Added response code.
- Added deletion days, extracted from the database.

## 20230824 (v1.0.105)
- Added notification frequency control.
- Added custom cache.
- Fixed the issue of rules using "or" logic.
- (Experimental) System firewall: separated for Linux and Windows.
- Reorganized city information summary.

## 20230728 (v1.0.103)
- Fixed the issue of not being able to block specific URL logs.

## 20230711 (v1.0.102)
- Added new packaging and compilation method.
- Added recording of content if it is a specific URL.
- Added detection of static resources.

## 20230619 (v1.0.101)
- Automatic startup service to avoid inability to start if the service is down.
- Fixed the issue of deleting historical logs.
- Added system configuration.
- Restructured message notification templates.

## 20230601 (v1.0.100)
- Recorded maximum body length, changed to global.

## 20230530 (v1.0.100)
- Fixed the issue of CPU and memory being occupied for a long time due to interval time, causing the system to be killed.
- Added memory exception troubleshooting.

## 20230525 (v1.0.99)
- Optimized the display of attack logs.
- Other optimizations.
- Fixed the issue of rules not being updated in real-time.
- Upgraded frontend framework version.
- Upgraded database ORM version.

## 20230524 (v1.0.98)
- Fixed the issue of delayed deletion causing the system to still function normally.
- Fixed the issue of queue data possibly being empty, causing save exceptions.

## 20230403 (v1.0.97)
- Fixed multiple issues.
- Added real-time communication through WebSocket.
- When deleting hosts, also delete all associated protection information.

## 20230330 (v1.0.96)
- Moved time-consuming information to the queue.
- Message notification for login information.

## 20230329 (v1.0.95)
- Added system compile and package version number.
- Added system logs.

## 20230210 (v1.0.94)
- Independent log library.

## 20230206 (v1.0.93)
- Added URL whitelist prefix matching and other comparison modes.

## 20230204 (v1.0.92)
- Custom server name added.

## 20230203 (v1.0.91)
- Initialized account information to default values.
- Optimized WAF engine.
- Added WeChat public account notification push.
- Improved login and authentication.

## 20230202 (v1.0.90)
- Handling of login section.
- Added basic content for account management and logs.

## 20221226 (v1.0.89)
- Added cross-site detection.
- Added SQL injection detection.

## 20221211 (v1.0.88)
- Added Linux-related configuration.
- Fixed the issue of host80 without a port causing an exception.

## 20221209 (v1.0.87)
- Added log query.
- Upgraded frontend version.

## 20221203 (v1.0.86)
- Added file compression for Windows.
- Added rule access variable values.

## 20221202 (v1.0.85)
- Added time zone support.
- Fixed the issue of incorrect deletion prompts.
- Added overview of IP-related situations on the homepage.
- Added processing of interval data statistics on the homepage.

## 20221201 (v1.0.84)
- Optimized message logic processing.
- Fixed deletion issue.
- Added blacklist IPs, restricted URLs.
- Added host selection in the frontend.
- Added IP and URL whitelists.
- Added URL privacy protection.
- Added anti-CC.
- Upgraded WAF engine.

