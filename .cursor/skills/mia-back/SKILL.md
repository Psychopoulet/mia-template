---
name: mia-back
description: >-
  Senior TypeScript NodeJS MIA backend developer: OpenAPI types, Mediator
  (all logic + documented events), Server as event pass-through only; split
  into lib/src/utils (runtime) vs lib/src/@types (typing-only); autonomous
  helpers as separate utils files not private methods; lint-back and
  build-back. Does not validate request parameters or authentication
  (handled by the host). Use for plugin back-office work per PLAN.md.
disable-model-invocation: true
---

# mia-back

## Purpose

Senior TypeScript back-end NodeJS developer: implements **Mediator** logic from the OpenAPI Descriptor. **Server is an event pass-through only.**

Shared conventions: [reference.md](../reference.md) · [openapi.md](../openapi.md).

## Expected input

Required:
- Plugin root as **cwd**
- Read step **b) Back-office** in `PLAN.md`

Optional: update instructions → extend/fix existing code, no full rewrite.

Gate: see [reference.md](../reference.md).

## Expected output

1. Read step **b)** in `PLAN.md` (**read-only** — never write `PLAN.md`) and execute its **numbered items in order**.
2. `npm run transpile-openapi-back` → `lib/src/Descriptor.ts`.
3. Implement / update `lib/src/Mediator.ts` for new Descriptor operations using `lib/src/Descriptor.ts` types. **All business logic lives in Mediator** (including when to emit).
4. Plugin events: **emit from Mediator**; **document** them in `lib/data/DescriptorEvents.json` (add matching `$ref` under `Descriptor.json` `components.schemas`; re-transpile). **`lib/src/Server.ts` has no own logic** — it is a pass-through only: bind those documented Mediator events to `this.push` (same `command` / payload as the schema). No API methods, mapping, validation, or helpers on Server.
5. Split helpers when useful; match template style:
   - **Runtime code** (functions, classes, value exports) → `lib/src/utils/`
   - **Typing-only** files (`type` / `interface` / type aliases, no runtime) → `lib/src/@types/`
   - Mixed file (code + co-located types) stays in `utils`; never put runtime in `@types`
   - **Autonomous** helpers (no `this` / instance state): **own file** under `utils/` when possible (one function per file, named after the export). **Do not** implement them as `private` methods on Mediator or Server. Keep class methods on Mediator for OpenAPI operations, lifecycle, and logic that must use instance state. Server methods: event bind/unbind only.
6. **Explanatory comments** in `lib/src/Mediator.ts` (and `utils/` it calls) when a method body is ≥ **25 lines**. English `//` above the method (purpose + main flow), not every line. Methods under 25 lines **may** still be commented when useful. Missing comments do **not** cause **`fail`**.
7. **Do not** validate incoming request parameters in the Mediator — `checkParameters` / OpenAPI validation are handled by the **host**.
8. **Do not** re-implement host **authentication** (login, JWT verification as a gate). If the plugin’s PLAN requires **authorization** rules (e.g. self-or-admin), implement those as domain logic in **Mediator** (resolve caller identity from the already-authenticated request context / token + Container services as needed).
9. **`pass`** requires green `npm run lint-back` then `npm run build-back`.
10. Build fails → **`fail`**. Lint fails but build passes, work incomplete, or an attention point remains → **`warning`**.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: Mediator/`utils`/`@types`; DescriptorEvents for emitted events; Server = event pass-through only; autonomous helpers as files not `private` methods; no param validation; no host-auth reimplementation; comments ≥ 25 lines. Checks: `lint-back`, `build-back`. Heading: `n/a`. Next: `mia-git` commit then `mia-tests`.
