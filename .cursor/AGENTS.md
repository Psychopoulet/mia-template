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
   - **`maintain`** — update an existing plugin (skip init / git provision)
3. Or call a single specialist with **`@mia-<name>`** (explicit invocation).

After init (or from the start in maintain), work always happens in the **plugin root**, not in the template (except init/deps on the template). `mia-git` **`provision`** runs once in **create** before init; **`commit`** runs after key steps; **`push`** runs at the end (always with user confirmation).

## Modes

### `create`

Full routine, with a **user pause** after each step. After each key deliverable step, **`mia-git` (`commit`)** (confirm staged files + message). Final **`mia-git` (`push`)** after review.

1. `mia-git` (`provision`) — remote + plugin root + `tmp.txt` + `master` / `develop`
2. `mia-init` — clone/update template, checks, remove `tmp.txt`, `create-mia-plugin`, install
3. `mia-git` (`commit`) — after init
4. `mia-deps` — only if version checks are blocked (exit code `1`) → then commit if needed
5. `mia-plan` (local `PLAN.md` only — not committed)
6. `mia-openapi` → `mia-git` (`commit`)
7. `mia-back` → `mia-git` (`commit`)
8. `mia-tests` — mocha back unit tests, Mediator coverage ≥ 95% (**blocking** before front) → `mia-git` (`commit`)
9. `mia-front-sdk` → `mia-git` (`commit`)
10. `mia-front-ui` → `mia-git` (`commit`)
11. `mia-lint` — optional; commit only if files were fixed
12. `mia-readme` → `mia-git` (`commit`)
13. `mia-review` → `mia-git` (`commit`) if needed
14. `mia-git` (`push`) — final push (confirm files being sent); **delete local `PLAN.md`**

### `maintain`

1. Confirm plugin root + scope (staged files, paths, instructions)
2. `mia-plan` update if needed (**no commit** — `PLAN.md` is gitignored/local)
3. Run **only** the sub-agents impacted by the delta (if back changes → **`mia-tests`** next, blocking before front; if user-facing behavior changes → **`mia-readme`** before review); **`mia-git` (`commit`)** after each key step (never stage `PLAN.md`)
4. End the batch with `mia-review` → commit if needed → **`mia-git` (`push`)** → **delete local `PLAN.md`**

Re-invoking a specialist with new instructions means **update existing work**, not a full rewrite.

## Agents

| Skill | Role | When |
|-------|------|------|
| `mia-orchestrator` | Lead — drives the pipeline, pauses for validation | Full create/maintain runs |
| `mia-deps` | Dependency maintainer | Checks fail on outdated engines/packages |
| `mia-git` | Git/GitHub: **provision** / **commit** / **push** (confirm before each mutation) | Provision: create before init; commit after key steps; push at end |
| `mia-init` | Copy script from template | Create only |
| `mia-plan` | Product owner → plugin `PLAN.md` | Plan or revise scope |
| `mia-openapi` | Technical writer → Descriptor | API contract |
| `mia-back` | Senior TS Node back | Mediator / Server |
| `mia-tests` | Senior QA — mocha back unit tests | Step c after back; **blocking**; coverage ≥ 95% |
| `mia-front-sdk` | Senior TS front — SDK | Step d |
| `mia-front-ui` | Senior TS front — UI | Step e |
| `mia-lint` | Lint guardian | Optional before readme/review |
| `mia-readme` | Documentation writer — user-facing README | Step f after UI |
| `mia-review` | Senior fullstack review | Step g, final gate before push |

Sub-agents use `disable-model-invocation: true` (call them explicitly). The orchestrator stays discoverable.

## Exit status / PLAN.md / conventions

Source of truth: [skills/reference.md](./skills/reference.md) (`pass` | `fail` | `blocked`, mandatory-inputs gate, local plugin `PLAN.md` + `## Step status`, npm scripts, OpenAPI, generated types).

Every agent checks **Required** inputs first; missing → **`fail`** with a hyper-concise message and the missing field(s) in **bold**.
