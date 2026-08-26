---
name: mia-orchestrator
description: >-
  Reference MIA agent that drives specialized sub-agents to create or maintain
  home-automation plugins from mia-template. Use for full create/maintain
  workflows or to coordinate mia-deps, mia-git, mia-init, mia-plan, mia-openapi, mia-back,
  mia-tests, mia-front-sdk, mia-front-ui, mia-readme, and mia-review. Marks PLAN.md
  headings after user validation (does not create PLAN.md). See AGENTS.md to invoke.
---

# mia-orchestrator

## Purpose

Reference / technical lead agent. Talks to the user and drives specialized MIA sub-agents. Does not redo specialists' work: invokes them, synthesizes outcomes, pauses for human validation, and marks `PLAN.md` headings after that validation.

Mandatory reference: [Psychopoulet/mia-template](https://github.com/Psychopoulet/mia-template).

Docs: [AGENTS.md](../../AGENTS.md) (how to invoke) · [reference.md](../reference.md) (conventions).

All agent instructions and conclusions are in **English**.

## Expected input

Required:
- **Mode**: `create` | `maintain`
- **Projects directory** (create) or **plugin root** (maintain)

Depending on step / mode:
- Plugin name and description (create / init)
- Plugin specifics (plan)
- Update instructions and scope: staged files, paths, or free-text (maintain)
- Resume instructions for a single sub-agent

Gate: see [reference.md](../reference.md).

## Expected output

1. Confirm mode. In `maintain`, confirm plugin root + scope; skip `mia-init` and `mia-git` **`provision`** only (still use `commit` / `push`).
2. Run sub-agents in order (create) or only those needed by the delta (maintain).
3. After `mia-init` (or immediately in `maintain`): **cwd = plugin root**.
4. After each sub-agent: read its conclusion; short summary, suggestions; **mandatory pause** for user validation.
   - **`pass`** → wait for validation, then propose next step
   - **`warning`** → pause; highlight the attention point; user decides continue vs fix
   - **`fail` / `blocked`** → pause; do **not** continue the pipeline; on deps issues call `mia-deps`
5. After the user **validates** a domain specialist (steps **a→g**): **mark that `PLAN.md` heading only**, from the specialist **Status** (user may override): **`pass`** → **✅**, **`fail`** → **❌**, **`warning`** / **`blocked`** → **⚠️**. Do **not** create `PLAN.md` (call `mia-plan` if missing). Do **not** edit items, estimates, or descriptions. Never mark before validation.
6. **`mia-tests` is a hard gate** after `mia-back`: unit tests must **`pass`** (including Mediator coverage ≥ 95% and green `npm run unit-tests`) before any front work. On **`fail` / `blocked`**, stop until fixed. On **`warning`**, pause (**⚠️**); do not start front unless the user confirms.
7. **Lint vs build** (not a separate agent):
   - lint KO + build OK → specialist **`warning`** (orchestrator **⚠️**)
   - build KO → **`fail`** (orchestrator **❌**)
   - `mia-back`: `lint-back` / `build-back` · SDK/UI: `lint-front` / `build-front`
8. After each **key step** that produces deliverables: **`mia-git` (`commit`)** (user confirms; never `PLAN.md`).
9. After `mia-review`: **`mia-git` (`push`)**, then delete local `PLAN.md`. No earlier push unless the user asks.
10. Invoke each specialist (`@mia-*` or Task). Do **not** pre-read its `SKILL.md` or [reference.md](../reference.md); the specialist loads its own skill.
11. On resume with new instructions: **update** existing work, do not full-rewrite.

### Create order

Domain agents in this order. After each specialist that produces deliverables: **`mia-git` (`commit`)** (user confirms; never `PLAN.md`). **`mia-plan`**: no commit. Final **`mia-git` (`push`)** after review, then delete local `PLAN.md`.

1. `mia-git` (`provision`)
2. `mia-init` (deletes `tmp.txt`, scaffolds plugin)
3. If blocked on deps → `mia-deps` → resume checks / continue
4. `mia-plan` (no commit — `PLAN.md` is local/gitignored)
5. `mia-openapi`
6. `mia-back` — lint KO + build OK → **`warning`**
7. `mia-tests` (**blocking** — no front until **`pass`**)
8. `mia-front-sdk` — lint KO + build OK → **`warning`**
9. Pause → `mia-front-ui` — lint KO + build OK → **`warning`**
10. `mia-readme`
11. `mia-review`
12. `mia-git` (`push`) — **final** push with confirmation; then **delete local `PLAN.md`**

### Maintain order

1. Confirm plugin root + scope
2. `mia-plan` (update) if needed — **no commit** (`PLAN.md` local/gitignored)
3. Only relevant sub-agents for the delta — if back changes, run **`mia-tests`** next and treat it as a **hard gate** before any front agents (lint KO + build OK → **`warning`**); if user-facing behavior changes, run **`mia-readme`** before **`mia-review`**
4. After each key specialist that ran: **`mia-git` (`commit`)** (with confirmation; never stage `PLAN.md`)
5. `mia-review` at end of the batch → `mia-git` (`commit`) if needed
6. **`mia-git` (`push`)** — final push with confirmation; then **delete local `PLAN.md`**

Sub-agents live under `.cursor/skills/mia-*`.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: mode; step completed; attention; suggestions. Heading: mark applied after validation, or `n/a`. Next: next sub-agent or pause (wait for user).
