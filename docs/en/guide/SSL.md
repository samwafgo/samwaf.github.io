# SSL Certificate Management

All SSL certificate features are gathered here: the certificate folder (batch management), automatic application/renewal, bulk expiration check, and CA server configuration.

## 1 Certificate Folder

Batch management of certificates.

![Certificate Folder](/images/sslconfig.png)

### 1.1 Automatic Certificate Loading

![Certificate Loading Location](/images/sslconfig_auto.png)

## 2 Automatic Certificate Application

Starting with v1.3.9-beta.7, automatic certificate renewal is supported. When the remaining validity period of a certificate falls below 30 days, the system will automatically initiate renewal based on the information from the last successful application.

### 2.1 Adding Port 80 to Host Configurations

Currently, file-based validation requires port 80 to be available, allowing both ports 443 and 80 to be used simultaneously.

![Configure Port 80](/images/ssl_auto_1.png)

### 2.2 Initiate the First Application

Click the "Automatic SSL Certificate Application" button.

![Automatic SSL Certificate Application](/images/ssl_auto_2.png)

### 2.3 Click "New"

![Click New](/images/ssl_auto_3.png)

### 2.4 Fill in the Application Information

You must manually enter the applicant's email address; the domain name(s) have already been automatically populated. Currently, certificates can be issued via file verification or DNS verification. When adding additional domain names, separate them with commas. Domain names containing wildcards must be listed first.

![Fill in the relevant application information](/images/ssl_auto_4.png)

After clicking "Confirm," the system will automatically process the certificate application. After a short wait, click the "Query" button to view the result (whether the certificate application was successful) in the list.

> Note: The default number of days is 30. You can configure this setting within the system by adjusting `sslorder_expire_day`.

## 3 SSL Certificate Bulk Expiration Check

Supported since v1.3.9-beta.9, this feature automatically checks expiration status every day at 6 AM. It supports manually adding domains and ports, and allows one-click synchronization of SSL domains that are already under protection.

### 3.1 View Expiration Status

View the expiration status of SSL certificates for registered domains.

![View SSL certificate expiration status for registered domains](/images/ssl_expire_check.png)

### 3.2 Synchronize Existing Host Information

Click "Synchronize Existing Host Information". This imports HTTPS domains under protection into the check list: existing ones are ignored, missing ones are added.

### 3.3 Manual Check

Click "Check" to initiate a manual SSL expiration check.

## 4 CA Server

Manage CA server information used when requesting certificates (ACME). During automatic certificate application, you can choose a CA server registered here as the issuing authority.

<!-- Image: CA server list (Add button, list, Edit/Delete actions) -->

### 4.1 Add a CA Server

1. Click the "Add CA Server" button at the top left to open the dialog.
2. Fill in the "CA Server Name" (required) and the "CA Server Address", and optionally add "Remarks".
3. Click "Confirm" to save.

<!-- Image: Add CA Server dialog -->

### 4.2 Edit and Delete

- Click "Edit" on a row to modify the CA server name, address, and remarks.
- Click "Delete" and confirm to remove the CA server entry.

### 4.3 Field Reference

| Field | Description |
| --- | --- |
| CA Server Name | A label for the CA server. Required, used to identify and select it when requesting certificates |
| CA Server Address | The ACME directory URL of the CA server; certificate requests are sent to this address |
| Remarks | Optional additional notes |
