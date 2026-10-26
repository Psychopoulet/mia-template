---
name: mia-front-ui
description: >-
  Senior TypeScript React/Bootstrap/Fontawesome MIA UI developer: components
  under public/src (preferably components/), coherent workflows, lint-front and
  build-front. Use for PLAN.md step e after mia-front-sdk.
disable-model-invocation: true
---

# mia-front-ui

## Purpose

Senior TypeScript front-end developer (React / Bootstrap / Fontawesome) — **UI specialty**: coherent component workflows on top of the SDK.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **e) Front components** in `PLAN.md`
- Existing SDK from `mia-front-sdk`

Optional: update instructions → evolve components, no full rewrite.

Gate: see [reference.md](../reference.md).

## Expected output

1. Read step **e)** in `PLAN.md` (**read-only** — never write `PLAN.md`) and execute its **numbered items in order**.
2. Rely on SDK + `public/src/Descriptor.ts`; re-run `npm run transpile-openapi-front` if needed.
3. Create / update components under `public/src` (preferably `public/src/components/`) with a coherent workflow.
4. **File naming**: a `.tsx` component file **must** have the same name as the component it exports (e.g. `StatusCard.tsx` exports `StatusCard`). Rename file and component together; never mismatch.
5. Ensure code quality / structure.
6. **`pass`** requires green `npm run lint-front` then `npm run build-front`.
7. Build fails → **`fail`**. Lint fails but build passes, work incomplete, or an attention point remains → **`warning`**.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: components; UI workflow. Checks: `lint-front`, `build-front`. Heading: `n/a`. Next: `mia-git` commit then `mia-readme`.

