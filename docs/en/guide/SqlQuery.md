# SQL Query Tool

## Overview

The SQL Query Tool runs **read-only queries** against SamWaf's local databases and lets you inspect the database table structure — handy for troubleshooting data, verifying statistics, or ad-hoc lookups.

For security, the tool **does not accept raw SQL input**. Instead you build a query by "select a table → choose columns → set conditions" (the page notes: *"For security, raw SQL input is disabled. Build your query by selecting a table, columns and conditions."*). Tables and columns that hold sensitive data (accounts, secrets, keys, etc.) do not appear in the selectable lists.

The page has two tabs: **SQL Query** (the structured query wizard) and **Database Structure**. Three databases are available: Local (local), Log (log), and Stats (stats).

<!-- Image: SQL query tool page -->

## Steps

### 1. Structured query

1. Open the **SQL Query Tool** page and stay on the **SQL Query** tab.
2. **Select Database**: Local / Log / Stats.
3. **Query Mode**:
   - **List** — returns matching data rows;
   - **Count** — returns only the number of matching rows.
4. **Table**: pick the table to query from the dropdown (only queryable tables are listed).
5. (List mode) **Columns**: multi-select the columns to return; **empty = all visible columns**.
6. **Filters** (optional): click **Add Filter** to add conditions one by one, each being "Column + operator + value", combined with AND.
   - Operators: `=`, `!=`, `>`, `>=`, `<`, `<=`, `like`, `in`;
   - for `in`, separate multiple values with commas.
7. (List mode) **Row Limit**: caps the number of returned rows, range 1–1000.
8. Click **Execute Query**:
   - List mode shows results in a table with "Total N records", supports pagination, and null values are shown as `NULL`;
   - Count mode shows "N rows match".

<!-- Image: Structured query and results -->

### 2. Inspect the database structure

1. Switch to the **Database Structure** tab.
2. Choose the target database in the dropdown and click **Refresh** to load all user tables.
3. The top shows **Table count** and **Total rows** summaries; the table lists each table's name, row count, column count, and index count (sorted by row count descending by default; click a column header to sort).
4. For each table you can:
   - **Top 100**: switches to the **SQL Query** tab and runs a list-mode query for the table's first 100 rows.
   - **Detail**: opens a dialog showing the table's column info (cid, name, type, not null, default, primary key) and index info (name, unique, type, columns).

<!-- Image: Database structure and table detail -->

## Field Reference

### SQL Query (structured wizard)

| Field / Button | Description |
|----------------|-------------|
| Select Database | Target database: Local / Log / Stats. |
| Query Mode | List (returns data rows) or Count (returns only the row count). |
| Table | The table to query; only queryable tables are listed. |
| Columns | In List mode, multi-select the columns to return; empty = all visible columns. |
| Filters | Structured conditions "Column + operator + value", combined with AND; operators `= != > >= < <= like in`, `in` values comma-separated. |
| Row Limit | Cap on returned rows in List mode, 1–1000. |
| Execute Query | Submits the query. List results show "Total N records"; Count results show "N rows match". |

### Database Structure

| Column | Description |
|--------|-------------|
| Table name | Name of the data table. |
| Row count | Number of records in the table (shown with thousands separators). |
| Column count | Number of columns in the table. |
| Index count | Number of indexes in the table. |
| Action | Top 100 / Detail. |

The table detail dialog shows column-info columns: cid, name, type, not null, default, primary key; and index-info columns: name, unique, type, columns.

## FAQ

- **Why can't I type raw SQL?** For security, the tool is now a structured query wizard: it accepts no arbitrary SQL and instead builds the query from your selected table, columns, and conditions, eliminating SQL-injection and unauthorized-read risks at the source.
- **Can I run UPDATE / DELETE?** No. The tool supports read-only queries only (List / Count).
- **Why are some tables / columns missing?** Tables and columns holding sensitive data (accounts, secrets, keys, etc.) are excluded from the queryable lists and cannot be selected.
- **Which databases can I query?** The Local, Log, and Stats databases.
- **Is there a result size limit?** In List mode you can set a **Row Limit** (1–1000); results are paginated.
- **How does it relate to the command-line `execsql`?** The command-line `execsql` targets the local administrator and is broader (it can run SELECT/UPDATE/DELETE, etc.); the admin-panel page is deliberately narrowed to a **structured read-only query**. They serve different purposes.
