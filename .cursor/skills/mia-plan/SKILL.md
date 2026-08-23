---
name: mia-plan
description: >-
  MIA product owner: creates or updates a timed plugin PLAN.md (OpenAPI, back,
  unit tests, front SDK, UI, README, review) with numbered implementation items
  in each step. Progress is marked at the end of the step heading (`### a) … ✅`
  or `❌`), never in a separate status table. Use when planning or revising an
  existing plan. Read template.md when writing PLAN.md.
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
4. Save as **`PLAN.md`** at the plugin root (**local only** — never committed).
5. Ensure the plugin **`.gitignore`** contains **`PLAN.md`** (append if missing).
6. **No `## Step status` section.** Later agents mark progress **at the end of the step heading only** (see [reference.md](../reference.md)). If an older plan still has `## Step status` or a `[x]` / `[ ]` heading prefix, delete that section and convert prefixes to a trailing **✅** / no mark.
7. When writing the file, read [template.md](template.md) (shape + granularity examples). Do not inline that template here.

If any a→g step lacks an ordered list, or items are too vague to implement: status **`fail`**, fix the plan before concluding **`pass`**.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: `PLAN.md`; scope; estimate; numbered items a→g yes/no; open points. Heading: `n/a`. Next: validate, then `mia-openapi` (no commit for `PLAN.md`).
