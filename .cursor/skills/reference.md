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

## Lint vs build

Not a separate agent. Map results to **Status**:

- lint green **and** build green → required for **`pass`**
- lint fails **but** build succeeds → **`warning`**
- build fails → **`fail`**

Applies to: `mia-back` (`lint-back` / `build-back`) · `mia-front-sdk` / `mia-front-ui` (`lint-front` / `build-front`) · `mia-tests` (`lint-tests` vs `unit-tests`).

OpenAPI conventions live in [openapi.md](openapi.md) — read from `mia-openapi` / `mia-back` / `mia-review` only.

## Plugin PLAN.md

- **Local-only** working document at the plugin root
- **Who writes**:
  - **`mia-plan` only** — create the file and update plan **content** (steps, items, estimates). New headings start with `[ ]`
  - **`mia-orchestrator` only** — after the user **validates** a specialist, replace that step's `[ ]` with **✅** / **❌** / **⚠️**. Never create the file; never edit items/goals
  - **All other skills** — **read-only**. Never create, edit, or mark `PLAN.md`. Report **Status** only; do not suggest heading marks. Exception: `mia-git` **`push`** may **delete** the local file after the final push
- **Never published**: must appear in the plugin **`.gitignore`** (`PLAN.md`); `mia-git` **`commit`** must **never** stage it
- **Deleted after the final `push`** of a create/maintain batch (`mia-git` **`push`** removes the file from disk once the remote is updated)
- Steps: **a)** OpenAPI → **b)** Back → **c)** Unit tests → **d)** Front SDK → **e)** Front components → **f)** README → **g)** Review
- **Numbered items**: each a→g section body is an ordered list (`1.` `2.` `3.` …) of discrete actions. Specialists execute those items **in order**. Do not treat a prose paragraph as the step contract.
- Create execution: `mia-tests` (step **c**) runs immediately after `mia-back` and is a **hard gate** before any front work; `mia-readme` (step **f**) runs after UI, before `mia-review`
- Progress tracking (**orchestrator only**, after validation, from the specialist **Status** — never a trailing mark, never a `## Step status` table):
  - pending: keep **`[ ]`** — `### [ ] a) OpenAPI — ~Xh`
  - **`pass`**: **✅** — `### ✅ a) OpenAPI — ~Xh`
  - **`fail`**: **❌** — `### ❌ a) OpenAPI — ~Xh`
  - **`warning`** / **`blocked`**: **⚠️** — `### ⚠️ a) OpenAPI — ~Xh`
  - Replace an existing `[ ]` / **✅** / **❌** / **⚠️**; do not duplicate it

## Mandatory inputs gate

**Before any other work**, every `mia-*` agent must verify that each **Required** input from its skill is present and usable.

- If any required input is missing → status **`fail`** immediately; do **no** other work
- Explanation must be **hyper-concise**; put each missing field in **bold**

Example: `Missing: **plugin root**, **scope**.`

## Conclusion (exactly 5 lines)

After the title `# Conclusion — mia-<name>`, the body is **exactly these 5 lines** — no extra headings or sections. Fold skill-specific fields into **Deliverables** / **Checks**. Bold important values. Missing-inputs **`fail`** (gate) may be shorter. Specialists set **Heading:** to **`n/a`**. Only `mia-orchestrator` writes `PLAN.md` marks after user validation (from **Status**).

```markdown
# Conclusion — mia-<name>
**Status:** pass | warning | fail | blocked
**Deliverables:** files / actions
**Checks:** commands ok/ko (or n/a)
**Heading:** [ ] | ✅ | ❌ | ⚠️ | n/a
**Next:** next specialist or pause
```

## Agent exit status

- **`pass`**: work complete; safe to continue
- **`warning`**: intermediate — orchestrator marks **⚠️**. Use when work is incomplete, done with an attention point, or lint fails while build succeeds. Put the reason in **Deliverables**
- **`fail`**: errors to fix (e.g. build / tests)
- **`blocked`**: needs human action (e.g. outdated deps)

Orchestrator continues only on **`pass`** (after validation). On **`warning`**: pause, mark **⚠️**, user decides whether to continue. On **`fail` / `blocked`**: do not continue. **`mia-tests` must `pass`** before front unless the user confirms a **`warning`**.
