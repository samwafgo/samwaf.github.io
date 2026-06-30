# SQL Query Tool

## Overview

The SQL Query Tool runs query statements directly against SamWaf's local databases and lets you inspect the database table structure. It is the UI equivalent of the command-line `execsql`, convenient for troubleshooting data, verifying statistics, or ad-hoc record lookups.

The tool is intended for **read-only queries**: enter a `SELECT` statement (the input placeholder reads "Enter a SELECT query"). Running statements directly against the database carries risk — use it carefully to avoid impacting core data.

The page has two tabs: **SQL Query** and **Database Structure**. Three databases are available: Local database (local), Log database (log), and Stats database (stats).

<!-- Image: SQL query tool page -->

## Steps

### 1. Run a SQL query

1. Open the **SQL Query Tool** page and stay on the **SQL Query** tab.
2. In the **Select Database** dropdown, choose the target database (Local / Log / Stats).
3. Enter a `SELECT` statement in the **SQL Query** text area.
4. Click **Execute Query**. Results are shown in a table with a "Total N records" count. The result area supports pagination, and null values are shown as `NULL`.

<!-- Image: Query result table -->

### 2. Inspect the database structure

1. Switch to the **Database Structure** tab.
2. Choose the target database in the dropdown and click **Refresh** to load all user tables.
3. The top shows **Table count** and **Total rows** summaries; the table lists each table's name, row count, column count, and index count (sorted by row count descending by default; click a column header to sort).
4. For each table you can:
   - **Query Top100**: auto-fills `SELECT * FROM <table> LIMIT 100`, switches to the query tab, and runs it.
   - **Detail**: opens a dialog showing the table's column info (cid, name, type, not null, default, primary key) and index info (name, unique, type, columns).

<!-- Image: Database structure and table detail -->

## Field Reference

### SQL Query

| Field / Button | Description |
|----------------|-------------|
| Select Database | Target database: Local / Log / Stats database. |
| SQL Query | The SQL to run; enter a `SELECT` query. |
| Execute Query | Submits and runs the query; results appear in the table below. |
| Query Result / Total N records | Result-area title and the total number of matched records; null values shown as `NULL`. |

### Database Structure

| Column | Description |
|--------|-------------|
| Table name | Name of the data table. |
| Row count | Number of records in the table (shown with thousands separators). |
| Column count | Number of columns in the table. |
| Index count | Number of indexes in the table. |
| Action | Query Top100 / Detail. |

The table detail dialog shows column info columns: cid, name, type, not null, default, primary key; and index info columns: name, unique, type, columns.

## FAQ

- **Can I run UPDATE / DELETE statements?** The tool is designed for read-only queries — enter `SELECT` statements. Running statements directly against the database is risky; proceed carefully to avoid damaging core data.
- **Which databases can I query?** The Local, Log, and Stats databases.
- **Is there a limit on result size?** Results are paginated for browsing large record sets; to avoid returning too much data at once, use `LIMIT` in your SQL.
- **How does it relate to the command line?** It is the UI equivalent of the command-line `execsql`, with similar capabilities, allowing direct queries from the admin panel.
