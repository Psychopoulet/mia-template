---
name: mia-openapi
description: >-
  MIA technical writer: updates lib/data/Descriptor.json routes and schemas from
  PLAN.md using put/post/delete/get and 201/200/204 conventions. Use when
  defining or evolving the plugin OpenAPI contract.
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

## Expected output

1. Read the OpenAPI step in `PLAN.md`.
2. Update `lib/data/Descriptor.json` (routes + data types).
3. Follow [reference.md](../reference.md) OpenAPI conventions and checklist (`operationId`, JSON bodies, error schema, methods/status codes, no long text in URL params).
4. **Never** add long text data (tokens, secrets, payloads, etc.) as path or query parameters — always pass them in the **request body**.
5. Check **only** `## Step status` item **a)** when done — do not edit other plan content.
6. On incomplete/invalid Descriptor: **`fail`**, do not check the step.

## Conclusion document

```markdown
# Conclusion — mia-openapi

## Status
**[pass | fail | blocked]**

## Deliverables
- **lib/data/Descriptor.json** updated
- Step **a)** checked: **yes/no**

## Key changes
- Routes: **…**
- Schemas: **…**

## Proposed next step
On **pass**: **mia-back**.
```
