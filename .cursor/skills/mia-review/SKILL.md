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

Shared conventions: [reference.md](../reference.md) · [openapi.md](../openapi.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **g) Review** in `PLAN.md` when present

Scope:
- Default: **entire project**
- If already reviewed or changes are staged: propose a limited scope and **ask confirmation**

Optional: re-review instructions → focus on deltas / open points.

Gate: see [reference.md](../reference.md).

## Expected output

1. Confirm scope (global vs limited) when ambiguous. If step **g)** lists numbered items, execute them **in order** as the review checklist.
2. Assess quality, security, maintainability, OpenAPI ↔ back ↔ front ↔ tests ↔ README consistency (OpenAPI: [openapi.md](../openapi.md)). On the Mediator: may **suggest** comments on methods ≥ 25 lines that lack them; this is not a blocker.
3. If Snyk and/or SonarQube MCP/tools are available: run them and summarize **critical** findings.
4. Ensure `npm run tests` passes.
5. Mark **only** the step **g)** heading with trailing **✅** (`### g) … ✅`) if verdict is ready; on **`fail`** mark **❌**; on **`blocked`** leave the heading unmarked.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: scope confirmed; verdict; critical / suggestion / nice-to-have; Snyk/Sonar. Checks: `npm run tests`. Next: `mia-git` commit if needed then `push`, or fix criticals and re-run.
