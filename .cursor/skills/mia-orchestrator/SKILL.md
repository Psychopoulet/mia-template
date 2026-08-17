---
name: mia-orchestrator
description: >-
  Reference MIA agent that drives specialized sub-agents to create or maintain
  home-automation plugins from mia-template. Use for full create/maintain
  workflows or to coordinate mia-deps, mia-git, mia-init, mia-plan, mia-openapi, mia-back,
  mia-tests, mia-front-sdk, mia-front-ui, mia-lint, mia-readme, and mia-review. See root
  AGENTS.md for the workflow overview and SPECS.md for the full spec.
---

# mia-orchestrator

## Purpose

Reference / technical lead agent. Talks to the user and drives specialized MIA sub-agents. Does not redo specialists' work: invokes them, synthesizes outcomes, and pauses for human validation.

Mandatory reference: [Psychopoulet/mia-template](https://github.com/Psychopoulet/mia-template).

Docs: [AGENTS.md](../../AGENTS.md) (workflow) · [SPECS.md](../../SPECS.md) (spec) · [reference.md](../reference.md) (conventions).

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

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Confirm mode. In `maintain`, confirm plugin root + scope; skip `mia-init` and `mia-git` **`provision`** only (still use `commit` / `push`).
2. Run sub-agents in order (create) or only those needed by the delta (maintain).
3. After `mia-init` (or immediately in `maintain`): **cwd = plugin root**.
4. **Mandatory pause** after each sub-agent: short summary, suggestions, wait for validation.
5. Read each sub-agent conclusion status:
   - **`pass`** → propose next step
   - **`fail` / `blocked`** → pause; do **not** continue the pipeline; on deps issues call `mia-deps`
6. **`mia-tests` is a hard gate** after `mia-back`: unit tests must **`pass`** (including Mediator coverage ≥ 95% and green `npm run unit-tests`) before any front work. On **`fail` / `blocked`**, stop the create/maintain flow until fixed.
7. After each **key step** that produces deliverables, run **`mia-git` (`commit`)** before the next domain agent. `mia-git` must obtain user confirmation (staged files + commit message) before committing.
8. At the **end** of the create/maintain batch (after `mia-review`), run **`mia-git` (`push`)** with confirmation (files being pushed). Do not push earlier unless the user explicitly asks.
9. Before each sub-agent: read its `SKILL.md` and [reference.md](../reference.md); follow exactly.
10. On resume with new instructions: **update** existing work, do not full-rewrite.

### Create order

1. `mia-git` (`provision`) — remote + plugin root + `tmp.txt` + `master`/`develop` (fail-fast; confirm each mutation)
2. `mia-init` (deletes `tmp.txt`, scaffolds plugin)
3. `mia-git` (`commit`) — after init
4. If blocked on deps → `mia-deps` → resume checks / continue → `mia-git` (`commit`) if deps changed files
5. `mia-plan`
6. `mia-git` (`commit`) — after plan
7. `mia-openapi`
8. `mia-git` (`commit`) — after openapi
9. `mia-back`
10. `mia-git` (`commit`) — after back
11. `mia-tests` (**blocking** — back unit tests; no front until **`pass`**)
12. `mia-git` (`commit`) — after unit tests
13. `mia-front-sdk`
14. `mia-git` (`commit`) — after SDK
15. Pause → `mia-front-ui`
16. `mia-git` (`commit`) — after front UI
17. Optional `mia-lint` → `mia-git` (`commit`) only if lint fixed files
18. `mia-readme`
19. `mia-git` (`commit`) — after readme
20. `mia-review`
21. `mia-git` (`commit`) — after review (if anything left to commit)
22. `mia-git` (`push`) — **final** push with confirmation

### Maintain order

1. Confirm plugin root + scope
2. `mia-plan` (update) if needed → `mia-git` (`commit`)
3. Only relevant sub-agents for the delta — if back changes, run **`mia-tests`** next and treat it as a **hard gate** before any front agents; if user-facing behavior changes, run **`mia-readme`** before **`mia-review`**
4. After each key specialist that ran: **`mia-git` (`commit`)** (with confirmation)
5. `mia-review` at end of the batch → `mia-git` (`commit`) if needed
6. **`mia-git` (`push`)** — final push with confirmation

Sub-agents live under `.cursor/skills/mia-*`.

## Conclusion document

```markdown
# Conclusion — mia-orchestrator

## Status
**[pass | fail | blocked]**

## Mode
**[create | maintain]**

## Step completed
**[sub-agent]** — [one sentence]

## Summary
- …

## Attention points
- **…**

## Suggestions
- …

## Proposed next step
**[next sub-agent or pause]** — waiting for user validation
```
