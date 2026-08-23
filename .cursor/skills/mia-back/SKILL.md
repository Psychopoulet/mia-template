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

Shared conventions: [reference.md](../reference.md) · [openapi.md](../openapi.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **b) Back-office** in `PLAN.md`

Optional: update instructions → extend/fix existing code, no full rewrite.

Gate: see [reference.md](../reference.md).

## Expected output

1. Read step **b)** in `PLAN.md` and execute its **numbered items in order**.
2. `npm run transpile-openapi-back` → `lib/src/Descriptor.ts`.
3. Implement / update `lib/src/Mediator.ts` for new Descriptor operations using `lib/src/Descriptor.ts` types.
4. Update `lib/src/Server.ts` if events are required.
5. Split helpers when useful; match template style:
   - **Runtime code** (functions, classes, value exports) → `lib/src/utils/`
   - **Typing-only** files (`type` / `interface` / type aliases, no runtime) → `lib/src/@types/`
   - Mixed file (code + co-located types) stays in `utils`; never put runtime in `@types`
6. **Explanatory comments** in `lib/src/Mediator.ts` (and `utils/` it calls) when a method body is ≥ **25 lines**. English `//` above the method (purpose + main flow), not every line. Methods under 25 lines **may** still be commented when useful. Missing comments do **not** cause **`fail`** and do not block marking the heading.
7. **Do not** validate incoming request parameters in the Mediator — `checkParameters` / OpenAPI validation are handled by the host / Server elsewhere.
8. **Do not** re-implement host **authentication** (login, JWT verification as a gate). If the plugin’s PLAN requires **authorization** rules (e.g. self-or-admin), implement those as domain logic (resolve caller identity from the already-authenticated request context / token + Container services as needed).
9. **Success condition:** `npm run lint-back` must pass, then `npm run build-back`.
10. If lint/build fails: status **`fail`**, mark the heading **❌**.
11. On success: mark **only** the step **b)** heading with trailing **✅** (`### b) … ✅`).

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: Mediator/Server/`utils`/`@types`; no param validation; no host-auth reimplementation; comments ≥ 25 lines. Checks: `lint-back`, `build-back`. Next: `mia-git` commit then `mia-tests`.
