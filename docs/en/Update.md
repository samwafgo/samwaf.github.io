# Version Releases

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

