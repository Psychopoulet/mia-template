---
name: mia-plan
description: >-
  MIA product owner: creates or updates a timed plugin PLAN.md (OpenAPI, back,
  unit tests, front SDK, UI, README, review) with a frozen Step status section.
  Use when planning development or revising an existing plan.
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
2. Produce a markdown plan with time-boxed steps:
   - **a)** OpenAPI (`lib/data/Descriptor.json`)
   - **b)** Back-office (Mediator; Server if events)
   - **c)** Unit tests (back; blocking before front)
   - **d)** Front-office SDK
   - **e)** Front-office components
   - **f)** README (user-facing; no technical details)
   - **g)** Review
3. Save as **`PLAN.md`** at the plugin root (**local only** — never committed).
4. Ensure the plugin **`.gitignore`** contains **`PLAN.md`** (append if missing).
5. Include a frozen **`## Step status`** section (checkboxes a→g). Later agents may only edit this section for progress.

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

### c) Unit tests — ~Xh
…

### d) Front SDK — ~Xh
…

### e) Front components — ~Xh
…

### f) README — ~Xh
…

### g) Review — ~Xh
…

## Step status
- [ ] a) OpenAPI
- [ ] b) Back-office
- [ ] c) Unit tests
- [ ] d) Front SDK
- [ ] e) Front components
- [ ] f) README
- [ ] g) Review
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
Validate, then **mia-openapi** (no git commit for `PLAN.md`).
```
