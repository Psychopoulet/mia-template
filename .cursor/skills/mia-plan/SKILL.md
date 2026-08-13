---
name: mia-plan
description: >-
  MIA product owner: creates or updates a timed plugin PLAN.md (OpenAPI, back,
  front SDK, UI, tests, review) with a frozen Step status section. Use when
  planning development or revising an existing plan.
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

## Expected output

1. Clarify needs with the user (via orchestrator) until a coherent draft exists.
2. Produce a markdown plan with time-boxed steps:
   - **a)** OpenAPI (`lib/data/Descriptor.json`)
   - **b)** Back-office (Mediator; Server if events)
   - **c)** Front-office SDK
   - **d)** Front-office components
   - **e)** Unit tests
   - **f)** Review
3. Save as **`PLAN.md`** at the plugin root.
4. Include a frozen **`## Step status`** section (checkboxes a→f). Later agents may only edit this section for progress.

Template:

```markdown
# PLAN — <plugin name>

## Context
…

## Steps

### a) OpenAPI — ~Xh
…

### b) Back-office — ~Xh
…

### c) Front SDK — ~Xh
…

### d) Front components — ~Xh
…

### e) Unit tests — ~Xh
…

### f) Review — ~Xh
…

## Step status
- [ ] a) OpenAPI
- [ ] b) Back-office
- [ ] c) Front SDK
- [ ] d) Front components
- [ ] e) Unit tests
- [ ] f) Review
```

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
- Open points: **…**

## Proposed next step
Validate, then **mia-openapi**.
```
