# MIA agents — shared reference

Shared conventions for all `mia-*` skills. Read this before executing specialized work.

Pipeline: [mia-orchestrator](mia-orchestrator/SKILL.md) · How to invoke: [AGENTS.md](../AGENTS.md)

## Repository

- Template reference: https://github.com/Psychopoulet/mia-template
- After init (or from the start in `maintain` mode), **cwd = plugin root**, never the template (except `mia-init` / `mia-deps` when operating on the template).

## Git

`mia-git` owns **provision** | **commit** | **push**. Confirm before every mutation. Never commit `PLAN.md`. Push only after review, then delete local `PLAN.md`. Details: [mia-git/SKILL.md](mia-git/SKILL.md).

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

## Lint success conditions

Not a separate agent. Green lint is required for **`pass`**:

- `mia-back` → `npm run lint-back`
- `mia-front-sdk` → `npm run lint-front`
- `mia-front-ui` → `npm run lint-front`

Failure → **`fail`**, mark the PLAN heading with trailing **❌**.

OpenAPI conventions live in [openapi.md](openapi.md) — read from `mia-openapi` / `mia-back` / `mia-review` only.

## Plugin PLAN.md

- **Local-only** working document at the plugin root (written/updated by `mia-plan`)
- **Never published**: must appear in the plugin **`.gitignore`** (`PLAN.md`); `mia-git` **`commit`** must **never** stage it
- **Deleted after the final `push`** of a create/maintain batch (`mia-git` **`push`** removes the file from disk once the remote is updated)
- Steps: **a)** OpenAPI → **b)** Back → **c)** Unit tests → **d)** Front SDK → **e)** Front components → **f)** README → **g)** Review
- **Numbered items**: each a→g section body is an ordered list (`1.` `2.` `3.` …) of discrete actions. Specialists execute those items **in order**. Do not treat a prose paragraph as the step contract.
- Create execution: `mia-tests` (step **c**) runs immediately after `mia-back` and is a **hard gate** before any front work; `mia-readme` (step **f**) runs after UI, before `mia-review`
- Progress tracking: mark the **step heading only**, with a trailing status (never a `[x]` / `[ ]` prefix, never a `## Step status` table):
  - **`pass`**: append **✅** — `### a) OpenAPI — ~Xh ✅`
  - **`fail`**: append **❌** — `### a) OpenAPI — ~Xh ❌`
  - pending / **`blocked`**: no mark — `### a) OpenAPI — ~Xh`
  - Replace an existing trailing **✅** / **❌**; do not duplicate it
- **Do not** edit plan goals, estimates, descriptions, or numbered items when marking progress.

## Mandatory inputs gate

**Before any other work**, every `mia-*` agent must verify that each **Required** input from its skill is present and usable.

- If any required input is missing → status **`fail`** immediately; do **no** other work
- Explanation must be **hyper-concise**; put each missing field in **bold**

Example: `Missing: **plugin root**, **scope**.`

## Conclusion (exactly 5 lines)

After the title `# Conclusion — mia-<name>`, the body is **exactly these 5 lines** — no extra headings or sections. Fold skill-specific fields into **Deliverables** / **Checks**. Bold important values. Missing-inputs **fail** (gate) may be shorter.

```markdown
# Conclusion — mia-<name>
**Status:** pass | fail | blocked
**Deliverables:** files / actions
**Checks:** commands ok/ko (or n/a)
**Heading:** ✅ | ❌ | unmarked | n/a
**Next:** next specialist or pause
```

## Agent exit status

- **`pass`**: safe to continue
- **`fail`**: errors to fix; mark the step heading with trailing **❌**
- **`blocked`**: needs human action (e.g. outdated deps)

Orchestrator continues only on `pass`. In particular, **`mia-tests` must `pass`** before `mia-front-sdk` / `mia-front-ui`.
