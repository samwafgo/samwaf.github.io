# Tunnel Protection

## 1 Tunnel Protection

Tunnel protection is currently an experimental feature designed to provide external protection for specific ports such as remote connections, database connections, and Redis connections.

### 1.1 Tunnel Management

![Tunnel Management](/images/tunnel1.png)

* View all tunnel configuration information.

### 1.2 Tunnel Maintenance

![Tunnel Maintenance](/images/tunnel2.png)

* **Tunnel Name**
  Custom name of the tunnel used for identification.

* **Port**
  Local listening ports. Multiple ports should be separated by commas, e.g., `3389,22,6379,1433`.

* **Protocol**
  Communication protocol type, commonly `tcp` or `udp`.

* **Remote Port**
  Port number on the remote server.

* **Remote IP**
  IP address of the remote server, e.g., `192.168.1.100`.

* **Allowed IP List**
  List of allowed client IPs, comma-separated. CIDR format is supported.

* **Denied IP List**
  List of denied client IPs, comma-separated. Takes precedence over allowed IPs.

* **Allowed Time Ranges**
  Time ranges during which the port is accessible, in the format `08:00-10:00;11:00-12:00`. Separate multiple ranges with a semicolon `;`; leave empty for 24/7 access.

* **IP Version Support**
  The IP version the tunnel listens on: `IPv4 Only`, `IPv6 Only`, or `IPv4 & IPv6` (default supports both).

* **SSL Status** (TCP protocol only)
  Whether to enable SSL/TLS on this tunnel port. When enabled, clients must connect to this port via TLS.

* **SSL Certificate / SSL Certificate Key** (required when SSL is enabled)
  The **absolute paths** to the certificate and private key files on the server, e.g. `/home/nginx/cert/test.com.pem`, `/home/nginx/cert/test.com.key`.

* **SSL Protocols** (required when SSL is enabled)
  Allowed TLS protocol versions, e.g. `TLSv1.2 TLSv1.3`.

* **Start Status**
  Whether to enable the tunnel on startup: `On` (enabled) or `Off` (disabled).

* **Connection Timeout**
  Timeout for establishing a connection, in seconds. For example, `10` means 10 seconds.

* **Read Timeout**
  Maximum wait time for reading data from a connection, in seconds.

* **Write Timeout**
  Maximum wait time for writing data to a connection, in seconds.

* **Max Inbound Connections**
  Maximum number of inbound connections allowed. `0` means unlimited.

* **Max Outbound Connections**
  Maximum number of outbound (remote) connections allowed. `0` means unlimited.

* **Remark**
  Optional description or notes for this configuration.

### 1.3 Tunnel Connection Status

![Tunnel Connection Status](/images/tunnel3.png)

* Click **Connections** on a tunnel row to view its current connection status (such as TCP/UDP source connections, target connections, peer IP and region).
 
### 1.4 Example

**How to Protect Remote Desktop Port (e.g., 3389):**

1. **Create a new port (e.g., 3399)** to provide external access;
2. **Hide the actual Remote Desktop port (3389)** behind this new port;
3. **Set up an IP whitelist on port 3399**, allowing only trusted IP addresses to connect;

In this way, only authorized IPs can access port 3399, which then forwards to 3389, effectively securing your Remote Desktop connection.