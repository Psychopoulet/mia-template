---
name: mia-front-sdk
description: >-
  Senior TypeScript MIA front developer focused on the SDK: transpile-openapi-front,
  update public/src/SDK.ts with public/src/Descriptor.ts types, lint-front.
  Use for PLAN.md step d (front SDK) after mia-tests pass. Orchestrator pauses
  before UI.
disable-model-invocation: true
---

# mia-front-sdk

## Purpose

Senior TypeScript front-end developer — **SDK specialty**: expose OpenAPI operations to the UI layer.

Runs only after **`mia-tests`** has **`pass`** (back unit-test hard gate).

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **d) Front SDK** in `PLAN.md`

Optional: update instructions → evolve SDK, no full rewrite.

Gate: see [reference.md](../reference.md).

## Expected output

1. Read step **d)** in `PLAN.md` and execute its **numbered items in order**.
2. `npm run transpile-openapi-front` → `public/src/Descriptor.ts`.
3. Update `public/src/SDK.ts` (and helpers if needed) for new operations, using `public/src/Descriptor.ts` types.
4. Ensure code quality / structure.
5. **Success condition:** `npm run lint-front` must pass (SDK scope). Run `npm run build-front` if needed to validate compile.
6. If lint/build fails: **`fail`**, mark the heading **❌**.
7. On success: mark **only** the step **d)** heading with trailing **✅** (`### d) … ✅`).
8. Orchestrator **must pause** before `mia-front-ui`.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: `public/src/Descriptor.ts`; SDK files. Checks: `lint-front`; `build-front` if run. Next: `mia-git` commit, pause, then `mia-front-ui`.
