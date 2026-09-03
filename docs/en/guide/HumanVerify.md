# Human verification

## Three things to keep apart

Human verification has three layers. They live in different places, and mixing them up is where
most confusion comes from:

| Layer | Question it answers | Where it lives |
|---|---|---|
| **Capability** | What the challenge **looks like**, how long clearance lasts | Website settings -> Human verification -> Capability |
| **Never challenge these paths** | Which paths are **never** challenged, whatever asked for it | Same place |
| **Trigger sources** | **Who** asked for this challenge | The site-wide switch (same place) + CC rules and others |

**The capability settings are independent of the site-wide switch.** With the switch off, verification
triggered by a CC rule still uses them - which is why these fields stay visible and editable instead of
disappearing with the switch.

## Capability

| Field | Description |
|---|---|
| Verification type | Classic image captcha / capJs proof of work. Decides what the challenge page looks like |
| Verification path | Used to hide system fingerprints; a random value is recommended |
| Clearance lifetime | How long the clearance issued by the **site-wide captcha** stays valid. Verification triggered by a CC rule uses that rule's own Duration as its challenge-free period instead |
| capJs parameters | Available with capJs: challenge count / size / difficulty / expiry |

## Never challenge these paths

One path prefix per line, applying to **every trigger source** - not just the site-wide captcha;
verification requested by CC rules and other sources is skipped as well.

Use it for endpoints that **break when challenged**: payment callbacks, webhooks, health checks, pure
APIs. Such endpoints never render a challenge page, so being challenged simply fails them.

> When this list skips a challenge, the attack log's Rule column carries
> `命中验证码排除URL，本次未挑战`, so it is never silent.

## Trigger sources

- **Site-wide human verification**: when on, every request to this website must pass verification first.
  Turning it off does **not** affect CC rules or other sources - it is only one of several triggers.
- **CC protection rules**: triggered when the action is Human verification; the scope comes from the rule
  conditions. The rule editor shows this website's verification settings inline and warns when the paths a
  rule covers are on the never-challenge list.

  A rule attached to the **global website** has no single website to show: the global website is not a real
  site, the verification settings live on the real websites, and the engine uses the settings of whichever
  website was visited. Such a rule's summary is therefore listed per website - which websites configured
  "Never challenge these paths", which paths, and a settings link for each. Only those websites skip the
  challenge this rule asks for; the rest are challenged as usual.

When a challenge is issued, the attack log records who asked for it, for example
`人机验证来源:CC规则 全局测试[CC-EJ2GJ5]`.

## Leave a contact on the challenge page

The challenge page is a dead end for visitors: once blocked, they can neither get in
nor ask anyone about it.

Under **Website editor - Human verification** there is a **Contact shown on the challenge
page** field. It is rendered on the verification page only when filled in; left empty, the
whole block is omitted rather than leaving a blank line.

Write whatever fits: an email address, a phone number, a ticket URL or a sentence of
explanation. Line breaks are preserved, 200 characters maximum. Visitors see
"Contact admin: <your text>", with the label following the visitor's language.

It works best together with the **Reference ID** at the bottom of the page: ask the visitor
to quote that code, then filter the attack log by **Access reference** to see the rule,
time, source IP and URL behind the block.

::: warning This is a public page shown to visitors
Everyone who gets challenged sees this field, including whoever is attacking you. Keep
internal system addresses, personal phone numbers and similar details out of it. The text
is HTML-escaped before rendering, so it is displayed literally and never executed as markup.
:::
