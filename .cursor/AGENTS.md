# MIA agents

How to run the AI workflow that **creates** and **maintains** home-automation plugins from [mia-template](https://github.com/Psychopoulet/mia-template).

| Doc | Role |
|-----|------|
| [skills/mia-orchestrator/SKILL.md](./skills/mia-orchestrator/SKILL.md) | **Runtime pipeline** (create / maintain) |
| [skills/reference.md](./skills/reference.md) | Shared conventions (cwd, gate, PLAN, lint, conclusions) |
| [skills/openapi.md](./skills/openapi.md) | OpenAPI conventions — `mia-openapi` / `mia-back` / `mia-review` only |

Skill bodies and conclusions are in **English**.

## Quick start

1. Open this repo (or a plugin that includes `.cursor/skills/`) in Cursor.
2. Invoke **`@mia-orchestrator`** with mode **`create`** or **`maintain`**.
3. Or call one specialist with **`@mia-<name>`**.

After init (or from the start in maintain), cwd is the **plugin root**. Specialists are `disable-model-invocation: true`; the orchestrator stays discoverable. Pipeline, pauses, git, and lint gates: **[mia-orchestrator](./skills/mia-orchestrator/SKILL.md)** — do not duplicate them here.
