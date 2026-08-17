---
name: mia-back
description: >-
  Senior TypeScript NodeJS MIA backend developer: OpenAPI types, Mediator
  (Server if needed), utils split, lint-back and build-back. Use for plugin
  back-office work per PLAN.md.
disable-model-invocation: true
---

# mia-back

## Purpose

Senior TypeScript back-end NodeJS developer: implements server-side logic from the OpenAPI Descriptor.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **b) Back-office** in `PLAN.md`

Optional: update instructions → extend/fix existing code, no full rewrite.

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Read the back-office step in `PLAN.md`.
2. `npm run transpile-openapi-back` → `lib/src/Descriptor.ts`.
3. Implement / update `lib/src/Mediator.ts` for new Descriptor operations using `lib/src/Descriptor.ts` types.
4. Update `lib/src/Server.ts` if events are required.
5. Extract reusable logic into `lib/src/utils/` when useful; match template style.
6. Run `npm run lint-back` then `npm run build-back`.
7. If lint/build fails: status **`fail`**, do **not** check the step.
8. On success: check **only** `## Step status` item **b)**.

## Conclusion document

```markdown
# Conclusion — mia-back

## Status
**[pass | fail | blocked]**

## Deliverables
- Types: **lib/src/Descriptor.ts**
- Mediator / Server / utils: **…**
- `npm run lint-back`: **ok/ko**
- `npm run build-back`: **ok/ko**
- Step **b)** checked: **yes/no**

## Notable points
- **…**

## Proposed next step
On **pass**: **mia-git** (`commit`), then **mia-tests** (blocking gate before front).
```

