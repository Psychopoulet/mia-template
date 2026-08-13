---
name: mia-git
description: >-
  MIA git/GitHub provisioner: checks git and gh access, ensures no existing remote
  with the plugin name for the logged-in user, creates the remote repo, ensures the
  plugin root directory exists, seeds a placeholder commit (tmp.txt), then creates
  and pushes master and develop (from master) in one pass before mia-init. Skipped
  in maintain.
disable-model-invocation: true
---

# mia-git

## Purpose

Git / GitHub provisioner: creates the remote repository and default branches for a new plugin **in one pass** before `mia-init`.

Runs **before** `mia-init` on create (fail-fast + remote + local branches). After remote creation, ensure `PROJET_REP` and the plugin root exist, seed a placeholder file so an initial commit can be pushed, then create/push `master` and `develop`.

Skipped in orchestrator **`maintain`** mode.

Shared conventions: [reference.md](../reference.md).

## Expected input

Required:
- **Plugin name** (remote repo name)
- **Projects directory** (`PROJET_REP`) — expected plugin root = `PROJET_REP/<plugin-name>`

Optional:
- **Plugin root** as **cwd** (absolute path; defaults to `PROJET_REP/<plugin-name>`)
- Visibility: `public` (default) | `private`
- Description (for `gh repo create`)

## Gate (do first)

Verify every **Required** input. If any is missing: status **`fail`**, stop, hyper-concise message with missing field(s) in **bold** (see [reference.md](../reference.md)). No other work until all required inputs are present.

## Expected output

**Before any repo mutation**, run steps 1–2. Stop on failure.

1. **Git accessibility**: `git --version` and `gh --version` succeed; `gh auth status` shows a logged-in user. Else **`fail`** / **`blocked`** (e.g. Missing: **`gh` auth**).
2. **Repo must not exist** for the logged-in user: resolve login (`gh api user -q .login`), then check `OWNER/<plugin-name>`. If it already exists → **`fail`** (e.g. Repo already exists: **`OWNER/name`**). Do not create or overwrite.
3. **Create remote repo** named after the plugin (`gh repo create <plugin-name> --public …`, or `--private` only if visibility was overridden), under the logged-in user (or confirmed org if explicitly provided).
4. **Ensure directories**: if **`PROJET_REP`** or the **plugin root** (`PROJET_REP/<plugin-name>`) does not exist, create them. Do not invent a local plugin tree beyond the placeholder in step 5.
5. **Seed placeholder** in the plugin root: create an empty file **`tmp.txt`** (only if missing) so an initial commit exists. `mia-init` will delete this file later.
6. **Create branch `master`** in the plugin root (init local git if needed, commit `tmp.txt` if there is no commit yet, set `master` as the default branch, link `origin`, push `master`).
7. **Create branch `develop`** from `master` (`git checkout -b develop` from `master`), push `develop`.

Leave the working tree on **`develop`** when done. Link `origin` to the new remote if not already set.

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
- Plugin root dir: **[path]** — created this run: **yes/no**
- Placeholder: **tmp.txt** — created this run: **yes/no**
- Branches: **master**, **develop** (from master)
- Current branch: **develop**

## Proposed next step
On **pass**: **mia-init** (uses the plugin root above; deletes **tmp.txt**).
```
