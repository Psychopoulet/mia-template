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

After init (or from the start in maintain), work always happens in the **plugin root**, not in the template (except init/deps on the template). `mia-git` runs only in **create**: remote first (before init), then local branches after the plugin exists.

## Modes

### `create`

Full routine, with a **user pause** after each step:

1. `mia-git` — checks + remote repo (fail-fast; before init)
2. `mia-init` — clone/update template, checks, `create-mia-plugin`, install
3. `mia-deps` — only if version checks are blocked (exit code `1`)
4. `mia-git` — local link + `master` / `develop` if still pending
5. `mia-plan` — write plugin `PLAN.md` (time-boxed steps + `## Step status`)
6. `mia-openapi` — update `lib/data/Descriptor.json`
7. `mia-back` — Mediator (+ Server if events), `lint-back`, `build-back`
8. `mia-front-sdk` — SDK + front OpenAPI types
9. `mia-front-ui` — React/Bootstrap/Fontawesome components
10. `mia-tests` — mocha, Mediator coverage ≥ 95%
11. `mia-lint` — optional full lint gate
12. `mia-review` — quality/security (+ Snyk/Sonar if available), `npm run tests`

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
| `mia-git` | Git/GitHub provisioner (`master` + `develop`) | Create only, before init (remote), then local after plugin exists |
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

Source of truth: [skills/reference.md](./skills/reference.md) (`pass` | `fail` | `blocked`, mandatory-inputs gate, plugin `PLAN.md` + `## Step status`, npm scripts, OpenAPI, generated types).

Every agent checks **Required** inputs first; missing → **`fail`** with a hyper-concise message and the missing field(s) in **bold**.
