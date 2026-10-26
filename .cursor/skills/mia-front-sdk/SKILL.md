---
name: mia-front-sdk
description: >-
  Senior TypeScript MIA front developer focused on the SDK: transpile-openapi-front,
  update public/src/SDK.ts with public/src/Descriptor.ts types, lint-front and
  build-front. Use for PLAN.md step d (front SDK) after mia-tests pass. Orchestrator
  pauses before UI.
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

1. Read step **d)** in `PLAN.md` (**read-only** — never write `PLAN.md`) and execute its **numbered items in order**.
2. `npm run transpile-openapi-front` → `public/src/Descriptor.ts`.
3. Update `public/src/SDK.ts` (and helpers if needed) for new operations, using `public/src/Descriptor.ts` types.
4. **Method naming**: each new SDK method that wraps an OpenAPI operation **must** be named exactly after that operation's `operationId` (e.g. `createDevice` → `SDK.createDevice`, typed `operations["createDevice"]`). Do not invent aliases or HTTP-verb names. Leave non-API methods (`connect`, `disconnect`, `isLoggedIn`) unchanged.
5. Ensure code quality / structure.
6. **`pass`** requires green `npm run lint-front` then `npm run build-front`.
7. Build fails → **`fail`**. Lint fails but build passes, work incomplete, or an attention point remains → **`warning`**.
8. Orchestrator **must pause** before `mia-front-ui`.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: `public/src/Descriptor.ts`; SDK files. Checks: `lint-front`, `build-front`. Heading: `n/a`. Next: `mia-git` commit, pause, then `mia-front-ui`.
