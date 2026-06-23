# AI Intelligent Detection

AI Intelligent Detection uses a lightweight machine learning model to identify anomalous requests. It acts as a **supplementary layer** to the existing rule engine (SQL injection, XSS, OWASP, etc.), specifically filling blind spots that rules miss: obfuscated bypasses, encoding tricks, and unknown payloads.

> The model is **trained locally using your own logs** — training data never leaves your machine, consistent with SamWaf's private-deployment principle. Inference runs inside SamWaf in pure Go with no Python, GPU, or external service dependency.

## Overall Workflow

```
Accumulate logs → Export sanitized training data → Train & package locally (.swai) → Upload model → Observe mode to verify false positives → Switch to block mode
```

## Step 1 — Set Up the Training Tool (SamWafAI)

Training is done in the standalone `SamWafAI` toolchain. You only need [uv](https://docs.astral.sh/uv/) installed:

```bash
cd SamWafAI
uv sync          # Creates an isolated environment in one shot
```

## Step 2 — Export Training Data

> ⚠️ **Important: Fix rule false positives before exporting**
> The export uses rule hits as weak training labels by default, but rules can produce false positives — legitimate requests incorrectly blocked — which get mislabeled as "attacks" in the export and bake those errors into the model. To address this:
> - The export uses **conservative trust**: without manual confirmation, only high-precision detectors (SQLi/XSS via libinjection, OWASP, RCE, path traversal) are trusted as attack samples. Sources prone to false positives — scanners (UA-based, which flags curl/python-requests and other legitimate tools) and custom rules — **are not counted as attacks without explicit confirmation** (they won't enter the positive training set).
> - In **Defense Logs**, you can **annotate** individual records: click the "AI Label" button in the actions column → choose "False Positive (Normal)", "Confirmed Attack", or "Ignore (exclude from training)". Manual labels **take priority** over rule-based weak labels at export time.
> - For **bulk annotation**, go to **AI Model Management → Training Annotations**: a centralized annotation workbench where you can filter by site / time / label status (Unlabeled…) / score, select multiple records, and batch-label them as Normal / Confirmed Attack / Ignore. Click a row's "Detail" to view the full request (Query/Body/UA) and annotate individually (press 1/2/3 on keyboard for quick labeling when detail is open). Recommended: set "Label Status" to "Unlabeled" and clear batches progressively.
> - Suggested workflow: use the annotation workbench to batch-mark obvious false positives as "Normal" and confirmed attacks (especially scanners, which aren't auto-trusted by default) as "Confirmed Attack", then export.

Two options — choose either:

1. **Management UI export (recommended)**: Go to **AI Model Management → Export Training Data**, select the number of days and record limit, and click Export. The system writes sanitized training data to `data/ai_export/train_*.jsonl` on the server. Weak labels are applied automatically based on rule hits, with a second sanitization pass on sensitive parameters.
2. **Read the log database directly**: Use SamWafAI to read SamWaf's SQLite log database:
   ```bash
   uv run samwafai export-data --sqlite samwaf_log.db --out build/train.jsonl
   ```

If you don't have enough logs yet, you can train a baseline model using public datasets (see `examples/` in SamWafAI).

### What's Inside an Export File (Important)

Each export produces **one** `train_*.jsonl` file containing **two merged parts** — it's not just your manually labeled records:

| Part | Source | Subject to export limits (days/count)? | How labels are assigned |
|------|---------|:--------------------------------------:|------------------------|
| Part 1 | Logs you have **not** annotated | ✅ Yes | Rule weak labels + **conservative trust**: rule-passed → normal sample; rule-flagged → only high-confidence detectors (SQLi/XSS/OWASP/RCE/traversal) are accepted; low-confidence (scanner/custom) without confirmation are discarded |
| Part 2 | **All** your manual annotations | ❌ No | Uses the **request snapshot captured at annotation time**: Confirmed Attack → positive sample (with your chosen category), False Positive → negative sample, Ignore → discarded. Labeled with `source=manual` |

Key points:

- **It's not only your annotations** — the file merges "automatic weak labels (records you haven't touched) + all your manual annotations".
- **Manual labels win on conflict**: any record you've annotated is skipped in Part 1 and only processed via Part 2, so your corrections are never overwritten by rule weak labels.
- Part 2 uses the **snapshot frozen at annotation time**, so it is **not subject to the export window (days/count)**. Even if the original log has been purged or falls outside the export window, your annotations still produce samples — nothing is lost.

## Step 3 — Train and Package

> 💡 **Don't want to install Python?** Download the Python-free trainer from [SamWafAI Releases](https://github.com/samwafgo/SamWafAI/releases) (Windows64 / Linux64 single binary). Replace `uv run samwafai` in the commands below with `./samwafai` (or `samwafai.exe`) — usage is identical and data stays on your machine.

```bash
uv run samwafai train   --train build/train.jsonl --out build/model_lgbm.txt
uv run samwafai eval    --model build/model_lgbm.txt --test build/train.jsonl --json-out build/eval.json
uv run samwafai package --model build/model_lgbm.txt --version myorg-v1 --eval-json build/eval.json --out build/model.swai
```

`eval` prints recall and recommended thresholds at different **false-positive rates** — WAF deployments care most about false positives, so set the block threshold at the ≤ 0.1% false-positive mark (`package` adopts `eval`'s recommended threshold automatically).

You can also run the full pipeline in one command:

```bash
uv run samwafai pipeline --train build/train.jsonl --test build/test.jsonl --version myorg-v1 --out build/model.swai
```

## Step 4 — Upload the Model and Enable

1. Go to **AI Model Management**, upload `model.swai`. The upload verifies the feature version and file integrity; once passed, the model **hot-reloads immediately — no restart required**.
2. In **System Settings**, set `ai_enable` to `1` and `ai_mode` to `observe`.
3. In the **Site Settings → Protection Config** for each site you want to protect, enable "AI Intelligent Detection".

## Step 5 — Observe → Block

- **Observe mode**: hits are annotated in Defense Logs with a category label (`AI Detection:<category>`, e.g. `AI Detection:SQL Injection`) and the score is recorded in a dedicated **"AI Score" column**; requests pass through normally. Run this for **1–2 weeks**.
  - To review: filter Defense Logs by "Log Only = Yes" to isolate AI observation hits, then sort by "AI Score" descending and review from the top.
- Verify whether AI hits are real attacks or false positives. False-positive samples can be annotated, re-exported, and used to train a new model version.
- Once the false-positive rate is acceptable, switch `ai_mode` to `block` — only requests reaching the block threshold will be blocked.

## Step 6 — Threshold Reference (Block / Observe)

The model management page shows two thresholds for the loaded model, e.g. "Block 0.974 / Observe 0.6818". These come from `manifest.json` inside the `.swai` package, computed by `samwafai eval` on the test set and written by `samwafai package`. The engine uses them to determine hits.

- **Block threshold**: corresponds to the score at a false-positive rate ≤ 0.1%. Calculated by sorting all **normal requests** in the test set by model score and taking the 99.9th percentile. Meaning: at this threshold, only ~0.1% of normal requests would be misclassified as attacks. WAF deployments prioritize not blocking legitimate traffic, so the default block line is set at this acceptable false-positive rate.
- **Observe threshold**: defaults to block threshold × 0.7 — lower than the block line, allowing more "suspicious but below block" requests into the observation log for easier pre-production review.

The engine evaluates each request by score:

| Condition | Behavior |
|-----------|----------|
| `score < observe threshold` | Treated as normal, not logged |
| `observe threshold ≤ score < block threshold` | Observation hit (logged + AI score, not blocked) |
| `score ≥ block threshold` and `ai_mode=block` | Blocked (in observe mode, only logged) |

To adjust thresholds:

- Specify manually at package time: `uv run samwafai package --block-threshold 0.9 --observe-threshold 0.6 ...` — omit to use `eval`'s recommended values.
- To make detection globally stricter/looser: edit `RECOMMEND_FP_RATE` in `samwafai/train/evaluate.py` (default `0.001` = 0.1% false-positive rate; lower = stricter) and the `× 0.7` observe-threshold coefficient, then re-run `eval` + `package`.

> Note: The example `demo` model is trained on synthetic data, so its thresholds will be high (synthetic data is too easy to separate). After training on real logs from your own site, these values will be more realistic and typically more spread out.

## Fail-Safe

If the model is missing, fails to load, or throws an inference error, AI detection **automatically skips and passes the request** — normal traffic forwarding is never affected. AI only adds protection, never removes it — enabling it does not weaken your existing rule-based defenses.

## FAQ

- **Upload error "Feature version mismatch"**: The SamWafAI version used to train the model doesn't match the current SamWaf engine's feature version. Retrain and repackage using the matching SamWafAI version.
- **No hits in observe mode**: Confirm that global `ai_enable=1`, "AI Intelligent Detection" is enabled on the site, and the model is loaded (status shows "Ready" in the AI Model Management page).
- **Worried about blocking legitimate traffic**: Always run observe mode for a period first, confirm the false-positive rate is acceptable, then switch to block.
