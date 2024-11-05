# Version Releases
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

