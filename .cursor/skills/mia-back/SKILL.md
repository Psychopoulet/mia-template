---
name: mia-back
description: >-
  Senior TypeScript NodeJS MIA backend developer: OpenAPI types, Mediator
  (Server if needed), split into lib/src/utils (runtime) vs lib/src/@types
  (typing-only), lint-back and build-back. Does not validate request parameters
  or authentication (handled by the host / Server). Use for plugin back-office
  work per PLAN.md.
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
5. Split helpers when useful; match template style:
   - **Runtime code** (functions, classes, value exports) → `lib/src/utils/`
   - **Typing-only** files (`type` / `interface` / type aliases, no runtime) → `lib/src/@types/`
   - Mixed file (code + co-located types) stays in `utils`; never put runtime in `@types`
6. **Do not** validate incoming request parameters in the Mediator — `checkParameters` / OpenAPI validation are handled by the host / Server elsewhere.
7. **Do not** re-implement host **authentication** (login, JWT verification as a gate). If the plugin’s PLAN requires **authorization** rules (e.g. self-or-admin), implement those as domain logic (resolve caller identity from the already-authenticated request context / token + Container services as needed).
8. Run `npm run lint-back` then `npm run build-back`.
9. If lint/build fails: status **`fail`**, do **not** check the step.
10. On success: check **only** `## Step status` item **b)**.

## Conclusion document

```markdown
# Conclusion — mia-back

## Status
**[pass | fail | blocked]**

## Deliverables
- Types: **lib/src/Descriptor.ts**
- Mediator / Server / `utils` / `@types`: **…**
- `npm run lint-back`: **ok/ko**
- `npm run build-back`: **ok/ko**
- Step **b)** checked: **yes/no**

## Notable points
- No param validation in Mediator: **yes**
- No host-auth reimplementation; domain authorization if PLAN requires: **yes**
- Runtime in `utils`, typing-only in `@types`: **yes**
- **…**

## Proposed next step
On **pass**: **mia-git** (`commit`), then **mia-tests** (blocking gate before front).
```
