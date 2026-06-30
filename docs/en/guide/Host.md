 
# Website Configuration

## 1 Deployment Architecture:
Please layout the SamWaf firewall according to the architecture below.

### 1.1 Deployed on the Same Server (Common)
::: important
Important: Deploying on the same server may encounter situations where ports 80 and 443 are already in use. Please perform operations when the machine or website business is not busy. [Modify and view common issues](../faq/readme.md#_1-端口80-被占用情况)

:::

```mermaid
---
title: Deployed on the Same Server
---
flowchart TB
    A[Client Browser]
	B(SamWaf)
	C(Web Server)
	A --> B  
	B --> A
	subgraph Server1
    B --> C
    C --> B
    end
```

### 1.2 Deployed on Different Servers
This deployment method is suitable for servers with abundant resources, allowing SamWaf to be deployed separately, and the domain name should be resolved to the server where SamWaf is located. Other website servers can then be connected, exposing only the server where SamWaf is located.

```mermaid
---
title: Deployed on Different Servers
---
flowchart TB
    A[Client Browser]
	B(SamWaf)
	C(Web Server)
	A --> B  
	subgraph Server1
    B 
    end  
	B --> C
	subgraph Server2 
    C
    end
	C --> B
	B --> A 
```

## 2 Adding Websites Protected by the Firewall:

Key configuration; set it up once for future use.

### 2.1 Add Website
![Add a website protected by SamWaf firewall](/images/add_host.png)
- Website:
    - Enter the website domain name correctly, avoiding prefixes like https, http, or suffixes like /.
    
	For example: www.baidu.com, pan.baidu.com
	
- Port:
    - Enter the port of the website that needs protection.
	http is 80 and https is 443. (If you have already installed Baota, Nginx, IIS, etc., you need to manually change the port to a non-80 or non-443 port.) [Modify and view common issues](../faq/readme.md#_1-端口80-被占用情况) 
- Encryption Certificate:
    1. If it's https, you need to select an encryption certificate. The 80 port does not require one.
	You need to click "Add New Certificate" to add a new certificate.
	
	![Add SSL Certificate](/images/add_ssl.png)
	```
	Typical filename: *.key Content format: -----BEGIN RSA PRIVATE KEY----- ... Copy and paste all the contents here.
	```
	- Certificate String
	```
	Typical filename: *.crt Content format: -----BEGIN CERTIFICATE----- ... Copy and paste all the contents here.
	```
	
	2. Select the corresponding certificate from the certificate folder.

     ![Select Certificate](/images/add_host_select_ssl.png)
	
- Startup Status:
	Automatic startup: After adding, it normally provides services; manual startup: after adding, it will not occupy ports and will not provide services.

- Strict Source Port:
    The strict source port is enabled by default. If disabled, it is suitable for outer Nginx or CDN situations.
	
- Backend System Type and Backend Application Type:
     Not necessary; you can select the actual type or keep the default (adaptations may be made for different backend access later).

- Backend Domain:
     Defaults to the same as the primary domain (requires http/https protocol prefix). Exception: If the frontend domain and backend domain configured in samwaf differ, you must enable the "Pass Backend Domain" option to ensure proper access.
	  
- Backend IP:
     If SamWaf and the website are on the same server, fill in 127.0.0.1. If on different servers, please fill in the actual IP.	
- Backend Port:
     Situation 1: If SamWaf and the website are on the same server, then the port needs to be changed to something like 81 or other ports. Situation 2: If they are on different servers, you can keep the original port.
	
## 3 Load Balancing:
Load balancing supports: Weighted Round Robin (WRR), IP Hash.
 
- Weighted Round Robin (WRR): Distributes requests to different servers in order based on the weights of the backend servers. Servers with higher weights are polled more frequently (higher probability).

- IP Hash: Uses the source IP address of the request to find the corresponding server from a hash table, ensuring that the same IP always accesses the same server.

### 3.1 Load Balancing Configuration
Click on the protected website to enable "Load Balancing."

![Load Balancing List](/images/loadbalanceindex.png).

### 3.2 Add Backend Load
![Load Configuration](/images/loadbalance_edit.png).

- IP: Enter the backend IP that can be accessed.
- Port: Enter the backend port that can be accessed.
- Weight: Enter the weight; for the Weighted Round Robin (WRR) mode, this increases the chance of customer access to that server.

## 4 Website Password Access  
Supported since v1.3.9-beta.11 , Add or edit the last tab for website password access.  
Website password access is disabled by default and can be enabled manually.
### 4.1 Website Password Access List

![Website Password Access List](/images/password_visit.png)

Here, you can view, add, edit, or delete.

The effect is as follows:

![Website Password Access Effect](/images/password_visit2.png)

## 5. Other Configurations  

### 5.1 Exclude URLs When Logging  

Enter one URL per line.

### 5.2 Access Timeout Settings  

Supported since v1.3.9-beta.13, Default is 60 seconds. Unit: seconds. If set to 0, there is no limit.  

![Access Timeout Settings](/images/response_timeout.png)   

Here is the translation:

## 6. Export and Import  
### 6.1 Export  
The export function allows you to export all host information. If this is your first time, it can be used as the template for initialization imports.

### 6.2 Import  
There are two options for importing host information:
- Import new host codes (for new data)
- Import retained host codes (for old data)  
![Import Parameters](/images/import_host.png)

PS: SamWaf is lightweight. For migrating old data, we recommend shutting down the service and directly copying all the data from the directories to the new server.
  
## 7. Bind Multiple Domains Simultaneously

Multiple domains can be supported, one per line. Wildcard domains are also supported.

![Bind Multiple Domains Simultaneously](/images/bind_more_domain.png) 

## 8. Health Check
The system performs health checks every 5 seconds. Invalid connections will be removed when load balancing is configured.

### 8.1 Custom Configuration
![Custom Configuration](/images/healthy_config.png)

- Enable Health Check (manually configurable)
- Detection Methods: GET/HEAD (confirm backend supports HEAD)
- Check Path: Default root directory /
- Expected Status Code: 200 (customizable HTTP response codes)
- Response Timeout: 5 seconds
- Consecutive Failure Threshold: 3
- Consecutive Success Threshold: 3

### 8.2 Health Status Display
![Status Display](/images/healthy_loadbalance.png)

## 9 Website List Page

After opening the "Website Configuration" page, you can see the list of all protected websites and a set of management actions.

### 9.1 Toolbar Buttons

| Button | Description |
| --- | --- |
| New Protection | Opens the add-website form to add a protected site |
| Export Data | Exports all website information to Excel (can be used as an import template, see Section 6) |
| Import Data | Imports website information from Excel, supporting two strategies: "import new host codes" / "import retained host codes" (see Section 6) |
| Batch Protection Switch | Changes the protection status of all sites at once; choose `Protected` or `Unprotected` (a second confirmation appears) |
| Batch Copy Configuration | Copies selected configuration modules from a source site to multiple target sites (see 9.4) |

The top-right area supports filtering by **Website** and clicking **Search**; the website, main port, backend IP, backend port, and remarks columns also support in-column input filtering.

<!-- Image: Website list -->

### 9.2 List Display

Each row shows: Website (with nickname, SSL tag, bound multi-domains/multi-ports), Main Port, Stats, Status, Backend IP, Backend Port, Remarks, Create Time, and Operation.

The **Stats** column shows in real time: PV, UV, Blocked (today's attacks), Inbound/Outbound traffic, QPS, and Connections.

The **Status** column contains several switches and tags:

| Item | Description |
| --- | --- |
| Health Status | Backend health (shows normal/abnormal when health check is enabled) |
| Guard Status | Protection toggle, `Protected` / `Unprotected`; a confirmation appears when toggled |
| Start Status | Startup toggle, `Auto Start` / `Manual Start`; a confirmation appears when toggled |
| Static Service | Shows an "On" tag if the static website feature is enabled |
| Strict Source Port | Shows a tag if strict source port is disabled |

### 9.3 Row Actions

The **Operation** column of each row provides: **Copy** (quickly create a new site based on this one; SSL and bindings are cleared), **Edit**, **Delete** (after deletion the site info and rules are cleared and cannot be recovered), and **SSL Auto Apply**.

> Note: The global website can only have its guard status configured — it cannot be copied, edited, deleted, or issued certificates.

### 9.4 Batch Copy Configuration

After clicking **Batch Copy Configuration**:

1. Select the **Source Site** (an already configured site).
2. Tick the **Copy Modules**; currently supported: Cache Configuration, Response compression.
3. In the **Target Sites** list, tick one or more sites (Select All is available); the source site is automatically excluded.
4. Click **One-Click Copy**. The dialog shows the copy progress and reports success on completion.

<!-- Image: Batch copy config dialog -->

## 10 Built-in Engine Protection

In the "Engine Protection" tab of the add/edit website form, you can toggle the built-in detections per site:

| Detection | Description |
| --- | --- |
| Bot Detection | Detects whether search engines are spoofed |
| SQL Injection Detection | Detects SQL injection |
| XSS Detection | Detects XSS attacks |
| Scanner Detection | Detects scanning tools |
| RCE Detection | Remote code execution detection |
| Sensitive Word Detection | Sensitive word detection |
| Directory Traversal Detection | Directory traversal detection |
| OWASP Set Detection | OWASP rule set detection |
| AI Detection (Beta) | Detects anomalous requests with a machine-learning model; requires uploading a model package and enabling the global AI switch first. Use observation mode to verify false positives before switching to blocking. |

### 10.1 Log-only Mode

When "Log-only Mode" is enabled, SamWaf records attack logs but does not block attack requests — useful for observing false positives early after going live.

### 10.2 IP Extraction Mode

Selects how the client IP is extracted from a request; this setting applies to all features such as CC protection, CAPTCHA, and IP whitelist:

- **NIC Mode**: gets the client IP directly from the network connection (for direct-connection scenarios).
- **Proxy Mode**: gets the real IP from HTTP headers (X-Forwarded-For, etc.) (for scenarios using CDN, Nginx, and other proxies).
