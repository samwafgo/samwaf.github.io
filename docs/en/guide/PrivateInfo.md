# Key Management

## Overview

Key Management centrally stores various sensitive credentials (such as DNS provider API keys / secrets) and lets you organize them by **Key Group**. All key values are stored encrypted locally — never persisted in plaintext, and never uploaded to any remote service.

The most common use case is **automatic SSL certificate issuance via the DNS-01 challenge**: when you choose DNS validation in "SSL Auto Apply", you must provide the API credentials of the corresponding cloud (DNS) provider. Those credentials are organized and stored through "Key Group + Key Management". One group holds one provider's credential set, making it easy to manage multiple accounts and multi-cloud environments.

This page combines two parts:

- **Key Group**: create a group first, specifying its name and the cloud it belongs to.
- **Key Management**: maintain the actual key/value pairs under a group.

<!-- Image: Key management list page -->

## Steps

### 1. Manage Key Groups

1. Open the **Key Group** page and click **Add Key Group**.
2. Fill in the **Group Name** and **Cloud Provider**.
3. Click **Confirm** to save. The list also supports **Edit** and **Delete** for existing groups.

> Tip: When configuring DNS-01 validation in "SSL Auto Apply", you will be asked to select a key group; once selected, you can add / edit the keys required by that DNS provider under the group.

### 2. Manage Keys

1. Open the **Key Management** page and click **New**.
2. Fill in the **Key**, **Value**, and an optional **Remarks**.
3. Click **Confirm** to save. The list also supports **Edit** and **Delete** for existing keys.

<!-- Image: New key dialog -->

## Field Reference

### Key Group

| Field | Description |
|-------|-------------|
| Group Name | Custom name of the group, used when selecting it in scenarios such as SSL issuance. Required. |
| Cloud Provider | The cloud (DNS) provider this group belongs to, used to distinguish credentials across platforms. |

### Key

| Field | Description |
|-------|-------------|
| Key | The key name (e.g. the API Key field name required by a DNS provider). Required. |
| Value | The value of the key (e.g. the actual API Key / Secret content), stored encrypted locally. |
| Remarks | Optional description to help identify the key's purpose. |

## FAQ

- **Are keys stored in plaintext?** No. Key values are encrypted before being persisted locally, consistent with SamWaf's private-deployment principle that data never leaves your machine.
- **How are key groups and keys related?** A group is used for classification (typically one group per cloud provider); a key is a concrete key/value pair under a group. For DNS-01 certificate issuance, select a group first, then fill in the specific credentials under it.
