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

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Read step **e)** in `PLAN.md` and execute its **numbered items in order**.
2. Rely on SDK + `public/src/Descriptor.ts`; re-run `npm run transpile-openapi-front` if needed.
3. Create / update components under `public/src` (preferably `public/src/components/`) with a coherent workflow.
4. **File naming**: a `.tsx` component file **must** have the same name as the component it exports (e.g. `StatusCard.tsx` exports `StatusCard`). Rename file and component together; never mismatch.
5. Ensure code quality / structure.
6. **Success condition:** `npm run lint-front` then `npm run build-front` must pass.
7. If either fails: **`fail`**, do not mark the heading.
8. On success: mark **only** the step **e)** heading (`### [x] e) …`).

## Conclusion document

```markdown
# Conclusion — mia-front-ui

## Status
**[pass | fail | blocked]**

## Deliverables
- Components: **…**
- UI workflow: **…**
- `npm run lint-front`: **ok/ko**
- `npm run build-front`: **ok/ko**
- Step **e)** checked: **yes/no**

## Proposed next step
On **pass**: **mia-git** (`commit`), then **mia-readme**.
```

