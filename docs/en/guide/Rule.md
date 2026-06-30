# Protection Rules

## 1 Script Editing

### 1.1 Quick Handling from Logs

![Log Details](/images/logdetail.png)
Select the desired feature value, turn on the "Quick Add Rule" switch, and click on a blank space.

### 1.2 Selecting Feature Values
![Selecting Feature Values](/images/log_select.png)

### 1.3 Automatically Create Rule Script
![Automatically Create Rule Script](/images/log_add_rule_script.png)

Currently, the following data can be identified:

```
Host
HOST

URL
URL

Referrer
REFERER

User-Agent
USER_AGENT

Request Method
METHOD

Access COOKIES
COOKIES

Access BODY
BODY

Request Port
PORT

Visitor IP
SRC_IP

Visitor Country
COUNTRY

Visitor Province
PROVINCE

Visitor City
CITY
```

## 2 Interface Editing
The current ease of use is not very convenient, it is recommended to use the script method.
![Interface Editing](/images/manual_rule.png)

## 3 Deep Learning Engine

To be developed.

## 4 Overview

Protection Rules are SamWaf's custom defense capability, letting you write flexible blocking logic for a specific protected website. Rules support two editing modes: **Manual Code (script, recommended)** and **Interface (visual) editing**. The banner at the top of the page reads: **SamWaf protection rules support script editing (preferred) and interface editing**.

## 5 Rule List

After opening the "Protection Rules" page, you can see the list of configured rules.

### 5.1 Toolbar and Search

- **Add Rule**: opens the rule edit page to add a rule.
- **Batch Delete**: deletes multiple selected rules at once (disabled when nothing is selected).
- **Clear All**: removes all rules under the current filter (a second confirmation appears).
- The top-right area supports searching by **Website**, **Rule Name**, and **Rule Code**; enter values and click **Search**.

<!-- Image: Protection rule list -->

### 5.2 List Columns

| Field | Description |
| --- | --- |
| Website | The protected site this rule applies to |
| Rule Name | The name of the rule |
| Rule Code | The unique rule code (system-generated) |
| Rule Version | The rule's version number |
| Rule Status | Rule toggle, `Enabled` / `Disabled`; can be switched directly in the list |
| Update Time | Last modification time of the rule |
| Create Time | Creation time of the rule |
| Operation | Edit, Delete |

## 6 Rule Editing

Click **Add Rule** or **Edit** on a rule to open the rule edit page.

### 6.1 Base Information

| Field | Description |
| --- | --- |
| Rule Name | A readable name for the rule |
| Protected Website | The protected site the rule applies to |
| Rule Salience | The salience (priority) value; a higher value means higher priority |
| Editing Mode | Choose `Interface` or `Manual Code` |
| Rule Status | Rule toggle, `Enabled` / `Disabled` |

### 6.2 Interface Editing

Add conditions one by one through a visual UI without writing scripts — suitable for users not familiar with the script syntax.

- Click **New** to add a condition.
- Each condition contains: **Scope**, **Judgment**, and **Value**; when the judgment is a function type (Contains/HasPrefix/HasSuffix), a **Function Result** field (true / false) also appears.
- A **Relation** can be set between multiple conditions: `AND` (&&) / `OR` (||).
- A live **Rule Script Content** preview is shown below while editing.

**Available scopes** include: Host (HOST), URL, Referrer (REFERER), User-Agent (USER_AGENT), METHOD, Cookies (COOKIES), Body (BODY), Request Port (PORT), Visitor IP (SRC_IP), Visitor Country (COUNTRY), Province (PROVINCE), City (CITY); plus function types: get a request header value `GetHeaderValue("HeaderKeyName")`, get IP failure count `GetIPFailureCount(5)`, and check whether it is a safe bot `IsSafeBot()`.

**Judgment symbols** include: equals (==), not equals (!=), greater than (>), less than (<), greater or equal (>=), less or equal (<=); plus function types: Contains, HasPrefix, HasSuffix.

<!-- Image: Interface editing -->

### 6.3 Manual Code Editing (Recommended)

Write the rule script directly for full capability. The edit page provides reference tables on the right (**System Variables**, **System Judgment Symbols**, **System Relation Symbols**) and categorized examples on the left (Basic, IP address, String, Number).

Basic script example:

```
rule R80798f795d7947419ba6f593708b40d9 "Block visitors outside China" salience 10 {
    when
        MF.COUNTRY != "中国"
    then
        Retract("R80798f795d7947419ba6f593708b40d9");
}
```

Common function examples (excerpted from the built-in examples):

- `MF.GetHeaderValue("Accept").Contains("text/plain") == True` — inspect a request header
- `MF.GetIPFailureCount(5) > 10` — more than 10 failures within 5 minutes
- `RF.IPInRange(MF.SRC_IP, "172.16.0.0", "172.20.255.254") == true` — IP range check
- `RF.IPInRanges(MF.SRC_IP, "10.0.0.0/8", ...) == true` — multiple ranges
- `RF.IPInCIDR(MF.SRC_IP, "192.168.1.0/24") == true` — CIDR check
- `RF.In(MF.METHOD, "GET", "POST") == true` — value-in check
- `RF.ContainsAnyIgnoreCase(MF.USER_AGENT, "bot", "spider", "crawler") == true` — string contains check
- `RF.EndsWithAny(MF.URL, ".php", ".asp") == true` — suffix check
- `RF.IntInRange(MF.STATUS_CODE, 400, 499) == true` — numeric range check

The page also provides an **online tutorial (video + AI agent auto-generation)** link to generate rules online.

### 6.4 Testing a Rule

Click **Test Rule** at the bottom of the edit page to simulate a request and verify whether the rule matches, without affecting production. You can fill in: simulated IP, Host, URL, Method, User-Agent, Referer, Header, Cookies, and Body. The result shows **Rule Matched (will be blocked)** or **Rule Not Matched (will not be blocked)**, along with the matched rules and the parsed location (country/province/city).

<!-- Image: Rule test dialog -->

::: tip
It is recommended to auto-generate a defense script by selecting feature values from **Log Details** with one click (see Section 1 of this page) — faster and more accurate than writing by hand.
:::