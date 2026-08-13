---
name: mia-tests
description: >-
  Senior MIA Quality Analyst: mocha tests under test/, Mediator coverage >= 95%
  via unit-tests-local, lint-tests, build-back, unit-tests. Use for PLAN.md
  step e; fail without checking if coverage is below target.
disable-model-invocation: true
---

# mia-tests

## Purpose

Senior Quality Analyst: non-regression and Mediator coverage for the plugin back-end.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **e) Unit tests** in `PLAN.md`

Optional: update instructions → adapt tests to changed code, no full rewrite.

## Expected output

1. Read the tests step in `PLAN.md`.
2. Create / update **mocha** tests under `test/` for new back-end code (Mediator first).
3. Name files with increasing numeric prefixes: `0_…`, `1_…`, `2_…`.
4. Measure coverage with `npm run unit-tests-local` (nyc). **Mediator coverage must be ≥ 95%**. If below: status **`fail`**, list gaps, do **not** check the step.
5. Verify `npm run build-back` then `npm run unit-tests`.
6. Recommended: `npm run lint-tests` before concluding **`pass`**.
7. On success: check **only** `## Step status` item **e)**.

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
- Step **e)** checked: **yes/no**

## Proposed next step
On **pass**: optional **mia-lint**, then **mia-review**.
```
