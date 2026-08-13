# MIA agents — shared reference

Shared conventions for all `mia-*` skills. Read this before executing specialized work.

Workflow overview: [AGENTS.md](../AGENTS.md) · Full spec: [SPECS.md](../SPECS.md)

## Repository

- Template reference: https://github.com/Psychopoulet/mia-template
- After init (or from the start in `maintain` mode), **cwd = plugin root**, never the template (except `mia-init` / `mia-deps` when operating on the template).

## npm scripts

Always use `npm run`:

| Script | Purpose |
|--------|---------|
| `npm run check-node-engine` | Validate Node engine |
| `npm run check-updates` | Validate dependency freshness |
| `npm run transpile-openapi-back` | OpenAPI → `lib/src/Descriptor.ts` |
| `npm run transpile-openapi-front` | OpenAPI → `public/src/Descriptor.ts` |
| `npm run lint-back` | Lint back-end |
| `npm run lint-front` | Lint front-end |
| `npm run lint-tests` | Lint tests |
| `npm run lint` | Lint all |
| `npm run build-back` | Build back-end |
| `npm run build-front` | Build front-end |
| `npm run unit-tests` | Mocha unit tests |
| `npm run unit-tests-local` | Mocha + nyc coverage |
| `npm run tests` | Full suite (lint, checks, build, unit tests) |

## OpenAPI conventions

Methods:
- `put` = create
- `post` = update
- `delete` = delete
- `get` = read

Status codes:
- `201` for `put`
- `200` when there is a response body
- `204` on success with no body

URL parameters:
- **Never** put long text values (tokens, secrets, payloads, etc.) in path or query parameters
- Always pass such data in the **request body**

Checklist (Descriptor):
- Stable clear `operationId`
- Request/response schemas as `application/json` when a body exists
- Error schema aligned with the template Descriptor
- Methods and status codes as above
- No long text (token, secret, etc.) in path/query — use the body

## Plugin PLAN.md

- Written by `mia-plan` at the plugin root
- Progress tracking: **only** update `## Step status` checkboxes
- **Do not** edit plan goals, estimates, or descriptions when marking progress

## Mandatory inputs gate

**Before any other work**, every `mia-*` agent must verify that each **Required** input from its skill is present and usable.

- If any required input is missing → status **`fail`** immediately; do **no** other work
- Explanation must be **hyper-concise**; put each missing field in **bold**

Example:

```markdown
# Conclusion — mia-<name>

## Status
**fail**

Missing: **plugin root**, **scope**.
```

## Agent exit status

Every conclusion document must include:

- **`pass`**: safe to continue
- **`fail`**: errors to fix; do not check the step
- **`blocked`**: needs human action (e.g. outdated deps)

Orchestrator continues only on `pass`.
