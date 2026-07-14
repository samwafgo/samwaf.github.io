# IP Database Management

## Overview

IP Database Management configures and manages SamWaf's IP geolocation capability. Based on the offline IP databases you upload, SamWaf resolves the source IP of incoming visits into location information such as country, province, city, and ISP. This page lets you configure data sources for IPv4 and IPv6 separately, upload database files, and test the lookup result for a specific IP online.

Supported data sources:

- **ip2region**: an xdb-format offline database, usable for both IPv4 and IPv6, with several field formats.
- **GeoLite2**: an mmdb-format offline database, usable for IPv6.
- **IPDB**: an ipdb-format offline database that covers both IPv4 and IPv6 lookups.

::: tip Works out of the box, no upload required
SamWaf ships with two built-in IP databases: **ip2region for IPv4** (legacy format) and **GeoLite2 for IPv6**. After a fresh install, IP geolocation works right away without uploading anything; these two sources are marked as "Built-in" on the page.

Uploading a file of the same type overrides the built-in data. The remaining sources have no built-in data and must be uploaded before use: **ip2region for IPv6** (requires `ip2region_v6.xdb`) and **IPDB** (requires a `.ipdb` file).
:::

<!-- Image: IP Database Management main page -->

## Steps

### 1. Test an IP lookup

An IP lookup test area is pinned at the top of the page so you can verify the current database at any time:

1. Enter the IP to look up in the **Test IP Address** field (IPv4 or IPv6). You can also click an example IP in the help icon next to the field (e.g. Google IPv4 `8.8.8.8`, IPv6 `2001:4860:4860::8888`) to fill it in automatically.
2. Click **Query**.
3. The result shows the IP type, the data source actually used (ip2region also shows the format used), and the country, province, city, ISP, region, and district.

### 2. Upload database files

Switch to the **Upload Database** tab:

1. Upload a `.xdb` or `.mmdb` file under **Upload IPv4 Database** / **Upload IPv6 Database**; or upload a `.ipdb` file under **Upload IPDB File** (covering both IPv4 and IPv6).
2. After a successful upload, click **Reload Database** to make the new file take effect immediately.
3. The ip2region field format reference table at the bottom of the page helps you pick the correct format for your xdb file version.

### 3. Configure the data source

Switch to the **Config & Status** tab:

1. Under **IPv4 Database Configuration**, choose a data source (ip2region / IPDB). If the source is ip2region, also choose the matching **Field Format**.
2. Under **IPv6 Database Configuration**, choose a data source (ip2region / GeoLite2 / IPDB). If the source is ip2region, also choose the **Field Format**.
3. A data status is shown under each source, with three possible values:

   | Status | Meaning |
   | --- | --- |
   | ✓ File ready | A database file for this source has been uploaded and is in use. |
   | ✓ Using built-in data (upload a file to override) | No file uploaded, but this source has built-in data and works as is; uploading a file overrides the built-in data. |
   | ⚠ File not found, please upload first | This source has neither an uploaded file nor built-in data; upload one on the "Upload Database" tab first. |

4. The **Current Status** panel below each card shows the data source, field format, file size, and load time. When built-in data is in use, the data source is followed by a "Built-in" tag and "File Create Time" is hidden (built-in data has no local file).
5. Click **Save Configuration**. A dialog prompts you to either save anyway or upload the file first only when the selected source has neither an uploaded file nor built-in data.

<!-- Image: Config & Status tab -->

## Field Reference

| Field | Description |
| --- | --- |
| Data Source | The IP database source used for that protocol (IPv4/IPv6): ip2region / GeoLite2 / IPDB. A "Built-in" tag means the built-in data shipped with SamWaf is in use rather than a file you uploaded. |
| Field Format | Required only for ip2region; matches the field structure of your xdb file (see table below). |
| File Size | The size of the currently loaded database (the size of the built-in data when built-in data is in use). |
| File Create Time | The creation time of the database file; hidden when built-in data is in use. |
| Load Time | The time the database was last loaded into memory. |
| Test IP Address | The IP address used for the lookup test; supports IPv4 and IPv6. |

### ip2region Field Format Description

Different versions of ip2region xdb files contain different fields. Please choose the format that matches your xdb file version:

| Version | Field Structure | Description |
| --- | --- | --- |
| Legacy Format | Country\|Region\|Province\|City\|ISP | Built-in legacy format with a region field. |
| Open Source Format | Country\|Province\|City\|ISP | ip2region open source standard format, 4 fields. |
| Full Format | Continent\|Country\|Province\|City\|District\|ISP\|Other | Full format with the most complete geographic information, 7 fields. |
| Standard Format | Country\|Province\|City\|District\|ISP\|Other | Standard format with district information, 6 fields. |
| Compact Format | Country\|Province\|City\|ISP\|Other | Compact format, 5 fields. |

## FAQ

- **Do I have to upload a database after a fresh install?** No. The default IPv4 (ip2region) and IPv6 (GeoLite2) sources both have built-in data and work immediately; the page shows "Using built-in data". Upload a file only when you want a newer or more detailed database.
- **The lookup result didn't change after uploading?** Click **Reload Database** after uploading to make the new file take effect.
- **Saving the configuration says the file does not exist?** The selected source has neither an uploaded file nor built-in data (this applies to ip2region for IPv6 and to IPDB). Upload it on the "Upload Database" tab first, then save.
- **Which file formats are supported?** IPv4/IPv6 databases support `.xdb` (ip2region) and `.mmdb` (GeoLite2); IPDB supports `.ipdb`.
- **Want to contribute another database format?** Send the database name, format description, and a sample file to `samwafgo@gmail.com`; the team will review and integrate more formats.
