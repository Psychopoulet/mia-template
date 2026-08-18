---
name: mia-plan
description: >-
  MIA product owner: creates or updates a timed plugin PLAN.md (OpenAPI, back,
  unit tests, front SDK, UI, README, review) with numbered implementation items
  in each step and a frozen Step status section. Use when planning development
  or revising an existing plan.
disable-model-invocation: true
---

# mia-plan

## Purpose

Product owner: turns plugin requirements into an actionable, time-boxed plan.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin specifics (what it does, what is expected)
- Plugin project root (where `PLAN.md` is written)
- Mode context: `create` or `maintain`

In **maintain**: existing `PLAN.md` + instructions / scope → **update**, no full rewrite unless asked.

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Clarify needs with the user (via orchestrator) until a coherent draft exists.
2. Produce a markdown plan with time-boxed steps **a→g**:
   - **a)** OpenAPI (`lib/data/Descriptor.json`)
   - **b)** Back-office (Mediator; Server if events)
   - **c)** Unit tests (back; blocking before front)
   - **d)** Front-office SDK
   - **e)** Front-office components
   - **f)** README (user-facing; no technical details)
   - **g)** Review
3. **Numbered implementation items (mandatory):** the body of **every** a→g step **must** be an **ordered list** (`1.` `2.` `3.` …). Each item is one discrete, implementable action (one route, schema, function, file, test case, component, README paragraph, or review check). Specialists execute these items **in order**.
   - **Do not** replace the list with a prose paragraph or bullet soup.
   - Keep a→g headings stable. In **maintain**, **do not renumber** existing items; append new ones.
   - Vague items (`implement the API`, `update the back`) are **`fail`** — rewrite until a later agent can execute without guessing.
4. Save as **`PLAN.md`** at the plugin root (**local only** — never committed).
5. Ensure the plugin **`.gitignore`** contains **`PLAN.md`** (append if missing).
6. Include a frozen **`## Step status`** section (checkboxes a→g). Later agents may only edit this section for progress.

Template:

```markdown
# PLAN — <plugin name>

## Context
…

## Steps

### a) OpenAPI — ~Xh

1. …
2. …
3. …

### b) Back-office — ~Xh

1. …
2. …
3. …

### c) Unit tests — ~Xh

1. …
2. …
3. …

### d) Front SDK — ~Xh

1. …
2. …

### e) Front components — ~Xh

1. …
2. …
3. …

### f) README — ~Xh

1. …
2. …

### g) Review — ~Xh

1. …
2. …

## Step status
- [ ] a) OpenAPI
- [ ] b) Back-office
- [ ] c) Unit tests
- [ ] d) Front SDK
- [ ] e) Front components
- [ ] f) README
- [ ] g) Review
```

Item granularity examples (adapt to the plugin; do not copy blindly):

- OpenAPI: `1. Add put /devices (operationId: createDevice) with JSON body { name, type }; success 201; default Error.`
- Back: `1. Implement createDevice in Mediator using Descriptor types; persist via Container service X.`
- Tests: `1. Add test/1_createDevice.ts covering success and default-error paths.`
- Front SDK: `1. Expose createDevice on SDK using public/src/Descriptor.ts types.`
- UI: `1. Add DeviceForm.tsx (exports DeviceForm) calling SDK.createDevice.`
- README: `1. Describe who can create a device and what they see after success.`
- Review: `1. Check OpenAPI ↔ Mediator ↔ tests ↔ SDK ↔ UI ↔ README for createDevice.`

If any a→g step lacks an ordered list, or items are too vague to implement: status **`fail`**, fix the plan before concluding **`pass`**.

## Conclusion document

```markdown
# Conclusion — mia-plan

## Status
**[pass | fail | blocked]**

## Deliverable
**PLAN.md** at plugin root.

## Plan synopsis
- Scope: **…**
- Total estimate: **…**
- Numbered items a→g: **yes / no**
- Open points: **…**

## Proposed next step
Validate, then **mia-openapi** (no git commit for `PLAN.md`).
```
