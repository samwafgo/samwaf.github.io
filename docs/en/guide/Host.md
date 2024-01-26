# Website Configuration

## 1 Deployment Architecture:
Please layout the SamWaf firewall according to the architecture below.

### 1.1 Deployment on the Same Server (Common)
::: important
Important: Deploying on the same server may result in port 80 and 443 being occupied. Please perform the operation when the local machine or website is not busy. [Modify and view common issues](./Question.md#_1-端口80-被占用情况)
:::

```mermaid
---
title: Deployment on the Same Server
---
flowchart TB
    A[Client Browser]
	B(SamWaf)
	C(Web Server)
	A --> B  
	B --> A
	subgraph Server 1
    B --> C
    C --> B
    end
```

### 1.2 Deployment on Different Servers
This deployment method is suitable for servers with abundant resources. SamWaf is deployed separately, and the domain is resolved to the server where SamWaf is located. Subsequently, various website servers are connected, exposing only the server where SamWaf is located.

```mermaid
---
title: Deployment on Different Servers
---
flowchart TB
    A[Client Browser]
	B(SamWaf)
	C(Web Server)
	A --> B  
	subgraph Server 1
    B 
    end  
	B --> C
	subgraph Server 2 
    C
    end
	C --> B
	B --> A 
```

## 2 Adding a Website Protected by the Firewall:
![Add a website protected by SamWaf Firewall](/images/add_host.png)
Configure once and use it anytime.

1. Website:
    - Simply fill in the website domain, pay attention to the prefixes such as https, http. Do not include / or other suffixes.
	
	For example: www.baidu.com, pan.baidu.com
	
2. Port:
    - Enter the port of the website that needs protection. HTTP is 80, and HTTPS is 443 (if you have installed control panels like Baota, Nginx, IIS, you need to manually change the port to a non-80 or non-443 port). [Modify and view common issues](./Question.md#_1-端口80-被占用情况)
3. Encryption Certificate:
    - If it is HTTPS, choose the encryption certificate; port 80 does not require it.
	- Key String
	```
	Usually file name: *.key. The content format is like: -----BEGIN RSA PRIVATE KEY----- ... Copy and paste the entire content.
	```
	- Certificate String
	```
	Usually file name: *.crt. The content format is like: -----BEGIN CERTIFICATE----- ... Copy and paste the entire content.
	```
	
4. Backend System Type, Backend Application Type:
    - Not necessary; you can choose the same as the actual system, or leave it as default (adaptations may be made later for different backend integrations).
5. Backend Domain:
    - The backend domain is usually the same as the first item, the website domain.
6. Backend IP:
    - If SamWaf and the website are on the same server, enter 127.0.0.1. If they are on different servers, enter the actual IP.
7. Backend Port:
    - Scenario 1: If SamWaf and the website are on the same server, the port should be set to a different value like 81. Scenario 2: If they are on different servers, use the original port here.