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

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- Plugin root (cwd)
- Read step **a) OpenAPI** in `PLAN.md`

Optional: update instructions → evolve existing Descriptor, no needless rewrite.

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Read step **a)** in `PLAN.md` and execute its **numbered items in order**.
2. Update `lib/data/Descriptor.json` (routes + data types).
3. Follow [reference.md](../reference.md) OpenAPI conventions and checklist (`operationId`, JSON bodies, methods/status codes, no long text in URL params).
4. **Responses**:
   - For **new** operations: document **only** success (`201` / `200` / `204`) + **`default`** with `#/components/schemas/Error`.
   - **Never** add dedicated error responses (`401`, `403`, `404`, `409`, etc.) on agent-created routes.
   - **Preserve** template-specific error responses on scaffold operations (`getPluginStatus` `404`, and any other codes already present from the template on front / descriptor / status paths). Do not remove them when updating the Descriptor.
5. **Schemas / components**:
   - **Do not** create `components.schemas` entries used only once.
   - Declare one-off objects **inline** in the operation (requestBody / response schema / array `items`).
   - Extract a component **only** when the same schema is referenced in **multiple** places (or it already comes from the template, e.g. `Error`, `PluginName`, push events).
6. **Never** add long text data (tokens, secrets, payloads, etc.) as path or query parameters — always pass them in the **request body**.
7. Check **only** the step **a)** heading when done (`### [x] a) …`) — do not edit other plan content.
8. On incomplete/invalid Descriptor (including stripping template errors, adding forbidden dedicated codes on new routes, or single-use components): **`fail`**, do not mark the heading.

## Conclusion document

```markdown
# Conclusion — mia-openapi

## Status
**[pass | fail | blocked]**

## Deliverables
- **lib/data/Descriptor.json** updated
- Step **a)** checked: **yes/no**
- Responses: success + **default** only (new ops): **yes/no**
- Template-specific errors preserved: **yes/no**
- No single-use components: **yes/no**

## Key changes
- Routes: **…**
- Schemas: **…**

## Proposed next step
On **pass**: **mia-git** (`commit`), then **mia-back**.
```
