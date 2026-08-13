---
name: mia-git
description: >-
  MIA git/GitHub provisioner: checks git and gh access, ensures no existing remote
  with the plugin name for the logged-in user, creates the remote repo, then
  master and develop (from master). Skipped in maintain. Use before mia-init on create
  (remote first; local branches after the plugin exists).
disable-model-invocation: true
---

# mia-git

## Purpose

Git / GitHub provisioner: creates the remote repository and default branches for a new plugin.

Runs **before** `mia-init` on create (fail-fast + remote). If the plugin root does not exist yet, stop after remote creation and propose `mia-init`. After init, re-invoke to link the local tree, push `master`, and create `develop`.

Skipped in orchestrator **`maintain`** mode.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- **Plugin name** (remote repo name)
- **Projects directory** (`PROJET_REP`) — expected plugin root = `PROJET_REP/<plugin-name>`

Optional:
- **Plugin root** as **cwd** (absolute path; defaults to `PROJET_REP/<plugin-name>`)
- Visibility: `private` (default) | `public`
- Description (for `gh repo create`)

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

**Before any repo mutation**, run steps 1–2. Stop on failure.

1. **Git accessibility**: `git --version` and `gh --version` succeed; `gh auth status` shows a logged-in user. Else **`fail`** / **`blocked`** (e.g. Missing: **`gh` auth**).
2. **Repo must not exist** for the logged-in user (skip this check when re-invoked only to finish local linking and the remote was already created in this create run): resolve login (`gh api user -q .login`), then check `OWNER/<plugin-name>`. If it already exists **and** this is the first provision call → **`fail`** (e.g. Repo already exists: **`OWNER/name`**). Do not create or overwrite.
3. **Create remote repo** named after the plugin (`gh repo create <plugin-name> …`), under the logged-in user (or confirmed org if explicitly provided), if it does not already exist from this create run.
4. If the **plugin root does not exist yet**: stop here with **`pass`**; proposed next step **`mia-init`**. Do not invent a local tree.
5. **Create branch `master`** in the plugin root (init local git if needed, ensure an initial commit exists so the branch can be pushed, set `master` as the default branch, link `origin`, push `master`).
6. **Create branch `develop`** from `master` (`git checkout -b develop` from `master`), push `develop`.

Leave the working tree on **`develop`** when local steps complete. Link `origin` to the new remote if not already set.

Do not delete or force-push existing remotes. Do not run in **`maintain`** unless the user explicitly asks to provision a missing remote.

## Conclusion document

```markdown
# Conclusion — mia-git

## Status
**[pass | fail | blocked]**

## Checks
- `git`: **ok/ko**
- `gh` auth / user: **[login or ko]**
- Remote already existed: **yes/no**

## Deliverables
- Remote: **[URL or n/a]**
- Local link / branches: **done / pending (awaiting plugin root)**
- Branches: **master**, **develop** (from master) — if local done
- Current branch: **develop** (if local done)

## Proposed next step
On **pass** + local pending: **mia-init**.
On **pass** + local done: **mia-plan**.
```
