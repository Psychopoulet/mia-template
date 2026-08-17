# MIA agents — shared reference

Shared conventions for all `mia-*` skills. Read this before executing specialized work.

Workflow overview: [AGENTS.md](../AGENTS.md) · Full spec: [SPECS.md](../SPECS.md)

## Repository

- Template reference: https://github.com/Psychopoulet/mia-template
- After init (or from the start in `maintain` mode), **cwd = plugin root**, never the template (except `mia-init` / `mia-deps` when operating on the template).

## Git / GitHub (mia-git)

- Tools: `git` + `gh` (logged-in GitHub user when needed)
- Operations: **`provision`** | **`commit`** | **`push`**
- **Always confirm** with the user before any mutating operation:
  - **commit**: synthetic summary = **staged files** + **commit message**
  - **push**: synthetic summary = branch + **file names** being sent
- `provision` (create only, before `mia-init`): checks + remote + plugin root + placeholder **`tmp.txt`** + push **`master`**, then **`develop`**; checkout **`develop`** locally and delete local **`master`** (keep remote `master`); `mia-init` deletes `tmp.txt`
- Remote repo name = plugin name; fail if it already exists for the logged-in user (`provision`)
- Visibility: **public** by default; override to `private` only if requested
- `commit` after key steps (init, plan, openapi, back, tests, sdk, front, readme, review if needed, …)
- `push` **only at the end** of create/maintain (after review), with confirmation
- In `maintain`: no `provision`; still use `commit` / `push`

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
- Success: `201` for `put`; `200` when there is a response body; `204` on success with no body
- Errors for **new** operations: **only** the `default` response (Error schema) — do **not** add dedicated codes (`401`, `403`, `404`, `409`, etc.)
- **Preserve** template-specific error responses on scaffold routes (`getPluginStatus` `404`, and any other codes already present from the template on front/descriptor/status paths). Do not strip them when editing the Descriptor.

URL parameters:
- **Never** put long text values (tokens, secrets, payloads, etc.) in path or query parameters
- Always pass such data in the **request body**

Checklist (Descriptor):
- Stable clear `operationId`
- Request/response schemas as `application/json` when a body exists
- New operations: **success response(s)** + **`default`** error only
- Keep existing template-specific error responses on template operations
- **No single-use components**: inline one-off object schemas in context; extract to `components.schemas` only when reused (or template-provided: `Error`, `PluginName`, events, …)
- Error schema aligned with the template Descriptor (`#/components/schemas/Error`)
- Methods and status codes as above
- No long text (token, secret, etc.) in path/query — use the body

## Front UI (mia-front-ui)

- A `.tsx` component file **must** be named the same as the component it exports (`StatusCard.tsx` → `export … StatusCard`)
- Rename file and component together; never leave a mismatch

## Plugin PLAN.md

- Written by `mia-plan` at the plugin root
- Steps: **a)** OpenAPI → **b)** Back → **c)** Unit tests → **d)** Front SDK → **e)** Front components → **f)** README → **g)** Review
- Create execution: `mia-tests` (step **c**) runs immediately after `mia-back` and is a **hard gate** before any front work; `mia-readme` (step **f**) runs after UI (and optional lint), before `mia-review`
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

Orchestrator continues only on `pass`. In particular, **`mia-tests` must `pass`** before `mia-front-sdk` / `mia-front-ui`.
