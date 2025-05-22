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

* **Start Status**
  Whether to enable the tunnel on startup: `true` (enabled) or `false` (disabled).

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

* View current tunnel connection status.
 
### 1.4 Example

**How to Protect Remote Desktop Port (e.g., 3389):**

1. **Create a new port (e.g., 3399)** to provide external access;
2. **Hide the actual Remote Desktop port (3389)** behind this new port;
3. **Set up an IP whitelist on port 3399**, allowing only trusted IP addresses to connect;

In this way, only authorized IPs can access port 3399, which then forwards to 3389, effectively securing your Remote Desktop connection.