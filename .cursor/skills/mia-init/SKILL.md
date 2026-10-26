---
name: mia-init
description: >-
  Copy script to initialize a new MIA plugin from mia-template (fetch/pull,
  deps, checks, create-mia-plugin, npm install, npx husky). Skipped in maintain
  mode. Use when creating a new plugin from the template.
disable-model-invocation: true
---

# mia-init

## Purpose

Copy script: initializes a new plugin project from the MIA template.

Skipped in orchestrator **`maintain`** mode.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- **Projects directory** (`PROJET_REP`)
- **Plugin name** (`NOUVEAU_NOM`)
- **Description** (`NOUVELLE_DESCRIPTION`)

Context:
- Template repo must exist (or be clonable) as a subdirectory of `PROJET_REP` (e.g. `PROJET_REP/mia-template`)
- Plugin root `PROJET_REP/<NOUVEAU_NOM>` is expected to already exist when coming from `mia-git` (git repo on **`develop`**, remotes `master`/`develop`, often only a placeholder `tmp.txt`); `create-mia-plugin` fills it

Gate: see [reference.md](../reference.md).

## Expected output

1. Ensure `mia-template` exists under `PROJET_REP`; else clone https://github.com/Psychopoulet/mia-template.
2. `cd` into the template directory.
3. `git fetch` then `git pull`.
4. `npm install` in the template if needed.
5. Run `npm run check-node-engine` and `npm run check-updates`.
6. If either exits with **1**: status **`blocked`**, tell orchestrator to pause and call **`mia-deps`**. Do not copy yet.
7. In the plugin root, **delete `tmp.txt`** if present (placeholder left by `mia-git` for the initial commit). Keep the existing `.git` and **`develop`** branch.
8. Run:
   ```bash
   npx create-mia-plugin --name "<NOUVEAU_NOM>" --description "<NOUVELLE_DESCRIPTION>" --directory "<PROJET_REP>/<NOUVEAU_NOM>"
   ```
9. `npm install` inside the created plugin.
10. From the plugin root, run `npx husky` so Git hooks from `.husky/` are registered for this repo.
11. Return the **absolute plugin root path** (cwd for all following agents).

Do not recreate an existing plugin unless explicitly asked. Do not remove `.git` or switch away from the current branch without need.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: template path + up to date; `tmp.txt` removed; plugin root; husky; blocker → `mia-deps` yes/no. Checks: `check-node-engine`, `check-updates`, plugin `npm install`. Heading: `n/a`. Next: **pass** → `mia-git` commit then `mia-plan`; **blocked** → `mia-deps`.
