# Automatic Certificate Application
 
## 1 Automatic Certificate Renewal 
Starting with v1.3.9-beta.7, automatic certificate renewal is supported. When the remaining validity period of a certificate falls below 30 days, the system will automatically initiate renewal based on the information from the last successful application.

### 1.1 Adding Port 80 to Host Configurations
Currently, file-based validation requires port 80 to be available, allowing both ports 443 and 80 to be used simultaneously.

![Configure Port 80](/images/ssl_auto_1.png)
 

### 1.2 Initiate the First Application
Click the “Automatic SSL Certificate Application” button

![Automatic SSL Certificate Application](/images/ssl_auto_2.png)

### 1.3 Click “New”
 
![Click New](/images/ssl_auto_3.png)

### 1.4 Fill in the Application Information
You must manually enter the applicant’s email address; the domain name(s) have already been automatically populated. Currently, certificates can be issued via file verification or DNS verification. When adding additional domain names, separate them with commas. Domain names containing wildcards must be listed first.
 
![Fill in the relevant application information](/images/ssl_auto_4.png)

After clicking “Confirm,” the system will automatically process the certificate application. After a short wait, click the “Query” button to view the result (whether the certificate application was successful) in the list.

Note: The default number of days is 30. You can configure this setting within the system by adjusting `sslorder_expire_day`.
