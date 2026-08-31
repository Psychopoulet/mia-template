---
name: mia-plan
description: >-
  MIA product owner: sole author of plugin PLAN.md (create / maintain content).
  Timed steps (OpenAPI, back, unit tests, front SDK, UI, README, review) with
  numbered items. Headings start with `[ ]`. Other skills are read-only; only
  mia-orchestrator marks progress after user validation. Use when planning or
  revising an existing plan. Read template.md when writing PLAN.md.
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

In **maintain**: existing `PLAN.md` + instructions / scope → **update** content, no full rewrite unless asked. Preserve existing heading marks (**✅** / **❌** / **⚠️** / `[ ]`) unless the user reopens a step.

Gate: see [reference.md](../reference.md).

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
4. **MUST write `<plugin-root>/PLAN.md` to disk.** Never leave the plan only in chat or conversation memory — this file is the cross-session tracking document (local only — never committed). Deliverables **must** include that absolute path.
5. Ensure the plugin **`.gitignore`** contains **`PLAN.md`** (append if missing).
6. **This skill is the only one that creates or rewrites `PLAN.md` content.** Every a→g heading **starts with `[ ]`** (`### [ ] a) OpenAPI — ~Xh`). Do **not** mark progress. After user validation, **`mia-orchestrator`** replaces `[ ]` (see [reference.md](../reference.md)). **No `## Step status` section.** If an older plan has that section or trailing **✅** / **❌**, convert to a prefix when writing.
7. When writing the file, read [template.md](template.md) (shape + granularity examples). Do not inline that template here.

If any a→g step lacks an ordered list, or items are too vague to implement: status **`fail`**, fix the plan before concluding **`pass`**.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: `PLAN.md`; scope; estimate; numbered items a→g yes/no; open points. Heading: `n/a`. Next: validate, then `mia-openapi` (no commit for `PLAN.md`).
