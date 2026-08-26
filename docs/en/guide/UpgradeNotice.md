# Upgrade Notes

## Overview

Upgrade Notes answers one question: **"I just upgraded - what actually changed in this version, and is there anything I should go and switch on?"**

That information used to live only in the "Important Notes" section of the [release log](../quickstart/Update.md), and nothing in the upgrade path pointed you there. Now, on startup, SamWaf compares the version it ran last time against the version running now, lists the notes introduced in between, and surfaces a prompt on the dashboard.

Every note spells out three things:

- **What this is** - the change or the recommendation itself
- **Doing it vs. not doing it** - what happens if you enable it, and what it costs you if you don't
- **How to undo it** - how to get back to where you were if you change your mind

::: tip
Upgrade Notes only informs and points you in the right direction. It **never changes any setting on your behalf** - every switch still has to be flipped by you, on its own page, after you have read what it does.
:::

## Prerequisites

- Nothing to configure; it appears automatically after an upgrade.
- Every signed-in role can see it, both the dashboard prompt and the **System Settings → Upgrade Notes** page.
- Notes are only generated when the **version actually changes**. Restarting on the same version, or running a development build, produces nothing.

## Where you will see it

### 1. Dashboard prompt bar

After upgrading and signing in, a blue bar appears at the top of the dashboard:

> Upgraded from v1.3.23 to v1.3.24. 3 upgrade note(s) need your attention. **Review**

- **Review** takes you straight to the Upgrade Notes page.
- The bar **disappears on its own** once everything has been handled.
- The **×** on the right dismisses it. Dismissal applies only to this upgrade - **the bar comes back on the next upgrade**, it is not a permanent mute.

### 2. Important-notes dialog

If the upgrade includes any note marked **Important** (typically something touching passwords, authentication, or rollback compatibility), a dialog appears once when you land on the dashboard, listing only those items.

::: warning
This dialog appears **exactly once, ever**. Whether you click "Got it" or "See all items", it will not come back - the prompt bar and the Upgrade Notes page take over from there. So read it before you close it.
:::

### 3. The Upgrade Notes page

Go to **System Settings → Upgrade Notes** to revisit every item at any time.

## How to use it

### 1. Browse and filter

Three tabs at the top:

| Tab | Contents |
|-----|----------|
| Pending | Items you have not acknowledged yet, with a count |
| Done | Items you have marked as handled |
| All | Everything, including ignored items, with a total |

Below them are two filters: **type** (Heads-up / Suggested / Check) and **version** (which release introduced the note).

### 2. Expand for the details

Click any row (or the expand arrow at its start) to reveal three blocks:

1. **What this is** - the full description of the note.
2. **Doing it vs. not doing it** - green on the left for "if you do", grey on the right for "if you don't". The right-hand side always spells out the cost: disk usage, performance, possible false blocks, possible lockouts, and so on.
3. **How to undo it** - how to get back to the previous state.

At the bottom you also get **Open settings** (a direct link to the relevant configuration page) and **Read the docs**.

::: tip
Read the "doing it vs. not doing it" block before you decide. Do not enable something just because it says "recommended" - every switch has a cost, and that block exists specifically to state it.
:::

### 3. Act on an item

| Button | What it does |
|--------|--------------|
| Open settings | Jumps to the configuration page for that note, where you make the change yourself |
| Got it | Marks the note as done and moves it out of Pending |
| Ignore | Drops it from Pending while keeping it under All, so you can always come back |
| Reopen | Moves a done or ignored note back to Pending (your way back from a mis-click) |

Done and ignored notes record **who** handled them and **when**.

## Note types

| Type | Meaning | What you need to do |
|------|---------|---------------------|
| **Heads-up** | Behaviour changed, but no action is required from you | Read it, click "Got it" |
| **Suggested** | There is a capability that ships disabled and is worth enabling | Read "doing it vs. not doing it", then decide for yourself |
| **Check** | Only some deployments are affected; you have to judge whether yours is one | Compare the description against your setup and act if it applies |

The **Important** tag marks the notes that trigger the sign-in dialog - usually security, authentication, or rollback compatibility.

## Special cases

### Fresh installs

A brand-new instance has no previous version to compare against, so what you get is **getting-started advice** rather than upgrade notes, typically:

- Change the initial login password right away
- Declare trusted proxy ranges if the console sits behind a reverse proxy
- Turn on two-factor authentication for the console
- Configure at least one notification channel

Existing instances that upgrade will **not** receive these.

### Downgrade mode

If the running binary is **older** than the highest version the database has ever seen running (common with containers: an in-app upgrade is followed by a container rebuild, so the binary reverts to whatever the image ships while the database cannot roll back), a **red banner** appears at the top of both the dashboard and the Upgrade Notes page:

> Downgrade detected: the highest version ever recorded is vX while the running binary is vY...

In this state **no upgrade notes are generated** - only the banner. The fix is to update the image to at least the version named in the banner and rebuild the container.

::: warning
The banner **does not go away on restart**. The check is based on the highest version ever run, a record that only ever moves up - so as long as the running binary is older than that, every startup shows the warning. This is deliberate: in the container-rebuild scenario, warning only the first time is the same as not warning at all.
:::

If you are **deliberately** staying on an older build, click the **×** on the banner and it will stop bothering you. Should another "upgrade then roll back" happen later and push the highest-ever version up again, the banner returns, because that is fresh evidence of an inconsistency.

### Pre-release (beta) builds

Beta and stable builds go through exactly the same logic, ordered by version number, so running a beta neither skips nor duplicates notes. Typical cases:

- Stable to beta (v1.3.23 → v1.3.24-beta.15): you see the notes introduced in between.
- Beta to the matching stable (v1.3.24-beta.15 → v1.3.24): **anything you already saw during the beta does not reappear**; only what was added after beta.15 shows up.
- Stable back **down** to a beta (v1.3.24 → v1.3.24-beta.15): by version order this is a rollback, so it is treated as downgrade mode and you get the red banner.

## FAQ

**I upgraded and got no notes at all. Why?**

Because the versions you moved between genuinely had nothing that needs your attention. Not every release produces notes - a pure bug-fix release usually requires nothing from you.

**I run a development build and never see anything.**

Development builds are always versioned `v1.0.0`, which can never catch up with real release numbers, so no notes are ever generated. That is deliberate: it keeps development quiet.

**I skipped several versions. Will I still see the notes from each of them?**

Yes. Going straight from v1.3.21 to v1.3.24 lists everything introduced in v1.3.22, v1.3.23 and v1.3.24 - nothing is lost by skipping releases.

**Can the same note appear twice?**

No. Each note has a unique identifier and is generated only once, and a later upgrade will never overwrite a status you have already set.

**Can I get an ignored note back?**

Yes. Switch to the **All** tab and click **Reopen**. Ignoring is not deleting.

**I dismissed the downgrade banner and it came back.**

The highest-ever-run version has moved above the value you dismissed - meaning another "upgrade to a newer version, then roll back" happened in between. That is fresh evidence of an inconsistency, so the banner returns; it is not a failed dismissal.

**Does this feature need internet access?**

No. The note content is compiled into the release alongside the program, no outbound request is made, and air-gapped or intranet deployments work exactly the same.

**I closed the dialog before reading it.**

Go to **System Settings → Upgrade Notes**; everything is still there. The dialog is a prompt, not the only way in.

**I handled the notes but the dashboard bar is still there.**

The bar tracks the **pending** count. Check whether the Pending tab has actually reached zero; note that ignoring items also removes them from Pending, which lowers the count as well.
