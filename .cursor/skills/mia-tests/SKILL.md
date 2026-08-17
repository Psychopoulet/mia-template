---
name: mia-tests
description: >-
  Senior MIA Quality Analyst: mocha back unit tests under test/, Mediator
  coverage >= 95% via unit-tests-local, lint-tests, build-back, unit-tests.
  Runs immediately after mia-back; hard gate before front. Use for PLAN.md
  step c; fail without checking if coverage is below target or tests fail.
disable-model-invocation: true
---

# mia-tests

## Purpose

Senior Quality Analyst: design and run **back-end unit tests** (mocha) right after `mia-back`.

**Hard gate**: status must be **`pass`** before the orchestrator may start any front work (`mia-front-sdk` / `mia-front-ui`). On **`fail`** / **`blocked`**, the workflow stops.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **c) Unit tests** in `PLAN.md`
- Back-office from `mia-back` already implemented

Optional: update instructions → adapt tests to changed code, no full rewrite.

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Read the unit-tests step in `PLAN.md`.
2. Create / update **mocha** tests under `test/` for new back-end code (Mediator first).
3. Name files with increasing numeric prefixes: `0_…`, `1_…`, `2_…`.
4. Measure coverage with `npm run unit-tests-local` (nyc). **Mediator coverage must be ≥ 95%**. If below: status **`fail`**, list gaps, do **not** check the step.
5. Verify `npm run build-back` then `npm run unit-tests`. Any failure → **`fail`** (blocking).
6. Recommended: `npm run lint-tests` before concluding **`pass`**.
7. On success: check **only** `## Step status` item **c)**.

## Conclusion document

```markdown
# Conclusion — mia-tests

## Status
**[pass | fail | blocked]**

## Deliverables
- Test files: **…**
- Mediator coverage: **…%** (target **≥ 95%**)
- Coverage gaps (if any): **…**
- `npm run lint-tests`: **ok/ko/n/a**
- `npm run build-back`: **ok/ko**
- `npm run unit-tests`: **ok/ko**
- Step **c)** checked: **yes/no**

## Proposed next step
On **pass**: **mia-git** (`commit`), then **mia-front-sdk**.
On **fail** / **blocked**: stop — do **not** start front work until tests pass.
```
