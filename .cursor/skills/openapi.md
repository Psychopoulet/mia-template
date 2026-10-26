# OpenAPI conventions (MIA)

Read from `mia-openapi`, `mia-back`, and `mia-review` only.

## Methods / success

- `put` = create → `201`
- `post` = update → `200` with body, else `204`
- `delete` = delete → `200` with body, else `204`
- `get` = read → `200` with body, else `204`

## Errors

- **New** operations: success + **`default`** (`#/components/schemas/Error`) only. No dedicated `401` / `403` / `404` / `409`.
- **Preserve** template-specific errors on scaffold routes (`getPluginStatus` `404`, front / descriptor / status paths).

## Params

Never put long text (tokens, secrets, payloads) in path or query — use the **request body**.

## Checklist

- Stable `operationId`
- JSON bodies as `application/json` when a body exists
- No single-use `components.schemas`: inline one-offs; extract only when reused (or template-provided: `Error`, `PluginName`, events)
- Error schema aligned with the template Descriptor (`#/components/schemas/Error`)
- Types: `npm run transpile-openapi-back` → `lib/src/Descriptor.ts`; `npm run transpile-openapi-front` → `public/src/Descriptor.ts`
