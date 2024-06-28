
[![Release](https://img.shields.io/github/release/samwafgo/SamWaf.svg)](https://github.com/samwafgo/SamWaf/releases)

# Introduction

SamWaf Website Firewall is a free lightweight website firewall suitable for small companies, studios, and individual websites. It features complete private deployment, data encryption, and local storage only. It can be launched with a single click and supports Linux and Windows 64-bit.

![SamWaf Website Firewall Overview](/images/overview.png)

## Key Features:

- Fully independent engine, protection functions do not depend on IIS, Nginx
- Customizable protection rules, supports script and interface editing
- Supports whitelist access
- Supports IP blacklist
- Supports URL whitelist
- Supports restricting URL access
- Supports specifying interface data privacy output
- Supports CC frequency access
- Supports global one-click configuration
- Supports separate protection strategies for different websites

## Tested Supported Platforms:

- CentOS 64-bit
- Windows 2008r2 64-bit
- Windows 10 64-bit

## Download Latest Version:

[https://github.com/samwafgo/SamWaf/releases](https://github.com/samwafgo/SamWaf/releases)

- Windows 

SamWaf64.exe

- Linux

SamWafLinux64

## Quick Start:

The startup can be done in the background service mode and non-background service mode.

### Service Mode:

Service mode can automatically register for restart and start automatically.

1. **Install:**

For Windows environment:
```shell script
SamWaf64.exe install
```

For Linux environment:
```shell script
SamWafLinux64 install
```

2. **Start:**

For Windows environment:
```shell script
SamWaf64.exe start
```

For Linux environment:
```shell script
SamWafLinux64 start
```

3. **Stop:**

For Windows environment:
```shell script
SamWaf64.exe stop
```

For Linux environment:
```shell script
SamWafLinux64 stop
```

### Non-Service Mode:

For Windows environment, double-click to start:
```shell script
 SamWaf64.exe
```

For Linux environment, execute:
```shell script
./SamWafLinux64 
```

## Access After Start:

http://127.0.0.1:26666

Default account: admin Default password: admin868 (Note: Please change the default password on first login)

## Issue Feedback:

- Access GitHub issues [here](https://github.com/samwafgo/SamWaf/issues)
- Email feedback: samwafgo@gmail.com
