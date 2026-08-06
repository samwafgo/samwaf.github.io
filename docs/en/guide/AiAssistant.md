# AI Assistant

## Overview

The AI Assistant is a chat entry that stays available across the admin console, via the floating **AI** button in the **bottom-right corner** (present in all three layouts: side, top and mix). You can use it to:

- ask questions about using SamWaf (protection settings, how to write rules, how to get a certificate, how to troubleshoot a 403, and so on);
- send a specific request from the **attack log detail** page for a security-risk analysis;
- ask AI to explain a CRS rule in **OWASP rule set management**.

The AI capability comes from **the model service you configure yourself** — SamWaf ships no model and never relays your chat through any official service.

::: warning Before you start
The assistant calls the third-party model API you configured. Everything in the conversation (including the request payload sent for log analysis) goes to that provider. Never paste keys, passwords or other secrets into the chat.
:::

<!-- Image: floating AI entry and the chat drawer -->

## Prerequisites

You must configure the AI API first. Until then, opening the assistant shows an "AI key not configured yet" guide and the input box stays disabled.

There are three entries, and **all of them edit the same settings and take effect immediately**:

| Entry | Location |
|-------|----------|
| AI Assistant | The gear icon **AI Settings** at the top-right of the drawer |
| Protection Rule | **AI Settings** at the top-right of the "AI Generate Rule" panel on the manual code editing page (see [Protection Rule](/en/guide/Rule.md)) |
| System Config | The `gpt_url` / `gpt_model` / `gpt_token` items (see [System Config](/en/guide/SystemConfig.md)) |

Settings:

| Field | Description |
|-------|-------------|
| API URL | An OpenAI-compatible endpoint, e.g. `https://api.deepseek.com`. A URL ending with `/v1` also works — `/chat/completions` is appended automatically. |
| Model | The provider's model id, e.g. `deepseek-chat`. |
| API Key (Token) | The provider's API key. For security it is **never echoed back**; leave it blank to keep the existing key. |

The dialog ships presets for common providers (DeepSeek, OpenAI, Kimi, Zhipu, Qwen, SiliconFlow, OpenRouter, Groq, Ollama, etc.) with their API URLs and representative models — click a model name or **Use** to fill them in. Get the key from the provider's own console.

<!-- Image: AI settings dialog -->

## Steps

### 1. Just ask a question

1. Click the floating **AI** button in the bottom-right corner to open the chat drawer.
2. On first open (or after clearing the chat) a welcome page appears with several **suggested questions** — click one to send it right away, or type your own in the box below.
3. **Enter** sends, **Shift + Enter** inserts a new line; answers stream in token by token.
4. While generating, the button turns into **Stop**; hover an answer to reveal **Copy**.
5. The **Clear chat** icon in the title bar ends the current round and returns to the welcome page.

### 2. Analyse an attack log entry

1. Go to "Protection Logs → Attack Log" and open the **detail** of any record.
2. In the **AI** card, click **AI Analysis**.
3. A confirmation dialog appears with the **masked** request payload (common sensitive headers such as `Authorization`, `Token`, `Api-Key`, `Secret`, `Set-Cookie`, and cookies such as `sessionid`, `auth`, `token`, `key`, `secret` are removed automatically). You can edit it further here.
4. After you confirm, the content goes to the assistant, a **Log risk analysis** tag appears next to the title, and the answer follows a fixed structure: risk level / risk type / explanation.

### 3. Explain an OWASP rule

1. Go to "System Settings → OWASP Rule Set Management", **Rules** or **Sandbox** tab.
2. Open a rule and click **AI Analysis**, then confirm the content to be sent.
3. An **OWASP rule explainer** tag appears next to the title, and the answer covers what the rule blocks, what its conditions mean, typical false positives and how to handle them.

## Field Description

Drawer elements:

| Element | Description |
|---------|-------------|
| Scene tag (next to the title) | The scene used by the current conversation. Shown only for "Log risk analysis" and "OWASP rule explainer"; hidden for free-form questions. |
| Clear chat | Clears the current conversation and returns to the welcome page. |
| AI Settings | Opens the API URL / model / key dialog — the same dialog used on the protection rule page. |
| Suggested questions | Example questions on the welcome page; click to send. |
| Documentation / Known issues | Opens the online documentation and GitHub Issues so you can search them yourself. |
| Copy | Copies the raw text of that answer. |
| Send / Stop | Sends your question; turns into Stop while streaming. |

The three scenes use different system prompts, so the answers read differently:

| Scene | Entry | Answer style |
|-------|-------|--------------|
| General Q&A | Floating button | Normal answers, no fixed template |
| Log risk analysis | Attack log detail → AI Analysis | Fixed output: risk level / risk type / explanation |
| OWASP rule explainer | OWASP rule set management → AI Analysis | Rule intent, condition meaning, false positives and how to handle them |

## FAQ

- **The assistant says "AI key not configured yet".**
  Follow the guide, click "Configure now" and fill in the API URL, model and key. You can also edit `gpt_url` / `gpt_model` / `gpt_token` in System Config.

- **I sent a message but got no answer.**
  The assistant now shows the failure reason right inside the chat bubble (wrong API URL or key, provider-side error, and so on). If it looks network or API related, try "Protection Rule → AI Generate Rule" once to confirm the settings themselves work.

- **Does the AI browse the documentation or GitHub Issues for me?**
  **No.** The model has no web access. It only gives you documentation and Issues search URLs to open yourself. The welcome page also links to "Documentation" and "Known issues / Report" directly.

- **Where does my conversation go?**
  Only to the provider endpoint you configured in the AI settings. SamWaf neither stores nor uploads the conversation; it disappears when you clear the chat or reload the page.

- **How does this relate to "AI Generate Rule" and "AI Detection"?**
  "AI Generate Rule" shares the same AI settings and produces custom rule scripts — see [Protection Rule](/en/guide/Rule.md). [AI Detection](/en/guide/AIDetection.md) is engine-side anomaly detection running a local model, unrelated to this chat assistant.
