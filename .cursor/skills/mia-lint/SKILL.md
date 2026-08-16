---
name: mia-lint
description: >-
  MIA lint guardian: runs lint-back, lint-front, lint-tests, or full lint for a
  given scope. Optional before readme/review; pass only when all selected lints are green.
disable-model-invocation: true
---

# mia-lint

## Purpose

Guardian of lint consistency across the plugin.

Shared conventions: [reference.md](../reference.md).

Optional: skip if specialized agents already linted successfully; orchestrator may force this step before `mia-review`.

## Expected input

Required:
- Plugin root as **cwd**
- Scope: `back` | `front` | `tests` | `all`

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Run the matching scripts:
   - `back` → `npm run lint-back`
   - `front` → `npm run lint-front`
   - `tests` → `npm run lint-tests`
   - `all` → `npm run lint`
2. Status **`pass`** only if every selected lint is green; otherwise **`fail`** with error list.
3. Do not modify application source except for clear lint fixes if the user asked to fix; default is report (and fix only when instructed).

## Conclusion document

```markdown
# Conclusion — mia-lint

## Status
**[pass | fail | blocked]**

## Scope
**[back | front | tests | all]**

## Results
- Commands run: **…**
- Errors (if any): **…**

## Proposed next step
On **pass**: **mia-readme**. On **fail**: fix then re-run **mia-lint**.
```
