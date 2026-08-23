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

Gate: see [reference.md](../reference.md).

## Expected output

1. Summarize outdated engines / packages.
2. Propose updates; apply only after user validation via the orchestrator.
3. Re-run `npm run check-node-engine` and `npm run check-updates`.
4. Repeat until both pass, otherwise remain **`blocked`**.
5. Do not invent unrelated refactors.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: project path; changes. Checks: `check-node-engine`, `check-updates`. Heading: `n/a`. Next: resume init / orchestrator, or wait if **blocked**.
