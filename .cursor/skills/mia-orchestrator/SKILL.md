---
name: mia-orchestrator
description: >-
  Reference MIA agent that drives specialized sub-agents to create or maintain
  home-automation plugins from mia-template. Use for full create/maintain
  workflows or to coordinate mia-deps, mia-git, mia-init, mia-plan, mia-openapi, mia-back,
  mia-front-sdk, mia-front-ui, mia-tests, mia-lint, and mia-review. See root
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

1. Confirm mode. In `maintain`, confirm plugin root + scope; skip `mia-init` and `mia-git`.
2. Run sub-agents in order (create) or only those needed by the delta (maintain).
3. After `mia-init` (or immediately in `maintain`): **cwd = plugin root**.
4. **Mandatory pause** after each sub-agent: short summary, suggestions, wait for validation.
5. Read each sub-agent conclusion status:
   - **`pass`** → propose next step
   - **`fail` / `blocked`** → pause; on deps issues call `mia-deps`
6. Before each sub-agent: read its `SKILL.md` and [reference.md](../reference.md); follow exactly.
7. On resume with new instructions: **update** existing work, do not full-rewrite.

### Create order

1. `mia-git` (remote first; fail-fast)
2. `mia-init`
3. If blocked on deps → `mia-deps` → resume checks / continue
4. `mia-git` again if local link / `master`+`develop` still pending
5. `mia-plan`
6. `mia-openapi`
7. `mia-back`
8. `mia-front-sdk`
9. Pause → `mia-front-ui`
10. `mia-tests`
11. Optional `mia-lint`
12. `mia-review`

### Maintain order

1. Confirm plugin root + scope
2. `mia-plan` (update) if needed
3. Only relevant sub-agents for the delta
4. `mia-review` at end of the batch

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
