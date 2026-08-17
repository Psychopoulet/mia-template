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
- Plugin root `PROJET_REP/<NOUVEAU_NOM>` is expected to already exist when coming from `mia-git` (git repo with `master`/`develop`, often only a placeholder `tmp.txt`); `create-mia-plugin` fills it

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

1. Ensure `mia-template` exists under `PROJET_REP`; else clone https://github.com/Psychopoulet/mia-template.
2. `cd` into the template directory.
3. `git fetch` then `git pull`.
4. `npm install` in the template if needed.
5. Run `npm run check-node-engine` and `npm run check-updates`.
6. If either exits with **1**: status **`blocked`**, tell orchestrator to pause and call **`mia-deps`**. Do not copy yet.
7. In the plugin root, **delete `tmp.txt`** if present (placeholder left by `mia-git` for the initial commit). Keep the existing `.git` / branches.
8. Run:
   ```bash
   npx create-mia-plugin --name "<NOUVEAU_NOM>" --description "<NOUVELLE_DESCRIPTION>" --directory "<PROJET_REP>/<NOUVEAU_NOM>"
   ```
9. `npm install` inside the created plugin.
10. From the plugin root, run `npx husky` so Git hooks from `.husky/` are registered for this repo.
11. Return the **absolute plugin root path** (cwd for all following agents).

Do not recreate an existing plugin unless explicitly asked. Do not remove `.git` or switch away from the current branch without need.

## Conclusion document

```markdown
# Conclusion — mia-init

## Status
**[pass | fail | blocked]**

## Actions performed
- Template: **[path]** — up to date: **yes/no**
- Checks: `check-node-engine` **[ok/ko]**, `check-updates` **[ok/ko]**
- Placeholder `tmp.txt` removed: **yes/no/n/a**
- Plugin root: **[absolute path]** (if created)
- Plugin `npm install`: **[ok/ko/n/a]**
- `npx husky` (Git hooks): **[ok/ko/n/a]**

## Blocker
- **[outdated deps / other / none]** — call **mia-deps**: **yes/no**

## Proposed next step
On **pass**: **mia-git** (`commit`), then **mia-plan**. On **blocked**: **mia-deps**.
```
