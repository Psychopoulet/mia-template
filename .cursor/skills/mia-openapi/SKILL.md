---
name: mia-openapi
description: >-
  MIA technical writer: updates lib/data/Descriptor.json routes and schemas from
  PLAN.md using put/post/delete/get and 201/200/204 success conventions; new
  routes use success + default Error only; preserve template-specific errors
  (e.g. getPluginStatus 404); no single-use components — inline one-off objects.
disable-model-invocation: true
---

# mia-openapi

## Purpose

Technical writer / API documentalist: owns the plugin OpenAPI contract.

Shared conventions: [reference.md](../reference.md) · [openapi.md](../openapi.md).

## Expected input

Required:
- Plugin root (cwd)
- Read step **a) OpenAPI** in `PLAN.md`

Optional: update instructions → evolve existing Descriptor, no needless rewrite.

Gate: see [reference.md](../reference.md).

## Expected output

1. Read step **a)** in `PLAN.md` (**read-only** — never write `PLAN.md`) and execute its **numbered items in order**.
2. Update `lib/data/Descriptor.json` (routes + data types).
3. Follow [openapi.md](../openapi.md).
4. On invalid Descriptor (stripped template errors, dedicated error codes on new routes, or single-use components): **`fail`**. Incomplete items or an attention point → **`warning`**.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: `Descriptor.json`; routes; schemas; new ops success+`default` only; template errors preserved; no single-use components. Heading: `n/a`. Next: `mia-git` commit then `mia-back`.
