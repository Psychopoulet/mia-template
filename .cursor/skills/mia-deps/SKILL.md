---
name: mia-deps
description: >-
  MIA dependency maintainer: updates engines/dependencies when check-node-engine
  or check-updates fail (exit code 1). Use when mia-init or later checks are
  blocked on outdated versions.
disable-model-invocation: true
---

# mia-deps

## Purpose

Dependency maintainer: unblocks the routine when Node engine or package versions are outdated.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Path to the project (template and/or plugin)
- Report from `npm run check-node-engine` and/or `npm run check-updates`

Called by the orchestrator when those checks return exit code `1`.

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Summarize outdated engines / packages.
2. Propose updates; apply only after user validation via the orchestrator.
3. Re-run `npm run check-node-engine` and `npm run check-updates`.
4. Repeat until both pass, otherwise remain **`blocked`**.
5. Do not invent unrelated refactors.

## Conclusion document

```markdown
# Conclusion — mia-deps

## Status
**[pass | fail | blocked]**

## Project
**[path]**

## Changes applied
- **…**

## Re-checks
- `check-node-engine`: **ok/ko**
- `check-updates`: **ok/ko**

## Proposed next step
Resume **mia-init** checks / orchestrator routine, or wait for user if **blocked**.
```
