# MIA agents

AI agent workflow to **create** and **maintain** home-automation plugins based on [mia-template](https://github.com/Psychopoulet/mia-template).

| Doc | Role |
|-----|------|
| [AGENTS.md](./AGENTS.md) | This file — how to use the workflow |
| [SPECS.md](./SPECS.md) | Full specification (source of truth for agent design) |
| [skills/](./skills/) | Executable Cursor skills (`mia-*`) |
| [skills/reference.md](./skills/reference.md) | Shared conventions (npm, OpenAPI, statuses) |

Agent skill bodies and conclusions are written in **English**.

## Quick start

1. Open this repo (or a plugin that includes `.cursor/skills/`) in Cursor.
2. Invoke **`@mia-orchestrator`** and choose a mode:
   - **`create`** — new plugin from the template
   - **`maintain`** — update an existing plugin (skip init)
3. Or call a single specialist with **`@mia-<name>`** (explicit invocation).

After init (or from the start in maintain), work always happens in the **plugin root**, not in the template (except init/deps on the template).

## Modes

### `create`

Full routine, with a **user pause** after each step:

1. `mia-init` — clone/update template, checks, `create-mia-plugin`, install
2. `mia-deps` — only if version checks are blocked (exit code `1`)
3. `mia-plan` — write plugin `PLAN.md` (time-boxed steps + `## Step status`)
4. `mia-openapi` — update `lib/data/Descriptor.json`
5. `mia-back` — Mediator (+ Server if events), `lint-back`, `build-back`
6. `mia-front-sdk` — SDK + front OpenAPI types
7. `mia-front-ui` — React/Bootstrap/Fontawesome components
8. `mia-tests` — mocha, Mediator coverage ≥ 95%
9. `mia-lint` — optional full lint gate
10. `mia-review` — quality/security (+ Snyk/Sonar if available), `npm run tests`

### `maintain`

1. Confirm plugin root + scope (staged files, paths, instructions)
2. `mia-plan` update if needed
3. Run **only** the sub-agents impacted by the delta
4. End the batch with `mia-review`

Re-invoking a specialist with new instructions means **update existing work**, not a full rewrite.

## Agents

| Skill | Role | When |
|-------|------|------|
| `mia-orchestrator` | Lead — drives the pipeline, pauses for validation | Full create/maintain runs |
| `mia-deps` | Dependency maintainer | Checks fail on outdated engines/packages |
| `mia-init` | Copy script from template | Create only |
| `mia-plan` | Product owner → plugin `PLAN.md` | Plan or revise scope |
| `mia-openapi` | Technical writer → Descriptor | API contract |
| `mia-back` | Senior TS Node back | Mediator / Server |
| `mia-front-sdk` | Senior TS front — SDK | Step c |
| `mia-front-ui` | Senior TS front — UI | Step d |
| `mia-tests` | Senior QA — mocha | Step e, coverage ≥ 95% |
| `mia-lint` | Lint guardian | Optional before review |
| `mia-review` | Senior fullstack review | Final gate |

Sub-agents use `disable-model-invocation: true` (call them explicitly). The orchestrator stays discoverable.

## Exit status / PLAN.md / conventions

Source of truth: [skills/reference.md](./skills/reference.md) (`pass` | `fail` | `blocked`, plugin `PLAN.md` + `## Step status`, npm scripts, OpenAPI, generated types).
