---
name: mia-review
description: >-
  Senior fullstack MIA reviewer: quality, security, improvements on full project
  or confirmed limited scope; optional Snyk/Sonar; npm run tests; checks PLAN
  step g only when ready.
disable-model-invocation: true
---

# mia-review

## Purpose

Senior fullstack developer: quality, security, and improvement review before delivery.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **g) Review** in `PLAN.md` when present

Scope:
- Default: **entire project**
- If already reviewed or changes are staged: propose a limited scope and **ask confirmation**

Optional: re-review instructions → focus on deltas / open points.

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Confirm scope (global vs limited) when ambiguous. If step **g)** lists numbered items, execute them **in order** as the review checklist.
2. Assess quality, security, maintainability, OpenAPI ↔ back ↔ front ↔ tests ↔ README consistency.
3. If Snyk and/or SonarQube MCP/tools are available: run them and summarize **critical** findings.
4. Ensure `npm run tests` passes.
5. Check **only** `## Step status` item **g)** if verdict is ready; on blockers use **`fail`** / **`blocked`** and do not check.

## Conclusion document

```markdown
# Conclusion — mia-review

## Status
**[pass | fail | blocked]**

## Scope
**[global | limited: …]** — confirmed: **yes**

## Verdict
**[ready / fixes required]**

## Quality & security
- 🔴 **Critical**: …
- 🟡 **Suggestion**: …
- 🟢 **Nice to have**: …

## External scans
- Snyk: **… / n/a**
- SonarQube: **… / n/a**

## Tests
- `npm run tests`: **ok/ko**

## Step **g)** checked: **yes/no**

## Proposed next step
**mia-git** (`commit`) if needed, then **mia-git** (`push`) with confirmation — or fix criticals and re-run **mia-review**.
```
