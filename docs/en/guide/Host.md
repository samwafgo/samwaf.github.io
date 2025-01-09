 
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

Let me know if you need any changes!