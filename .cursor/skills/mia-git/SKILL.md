---
name: mia-git
description: >-
  MIA git/GitHub agent: provision (remote + master/develop before init), commit
  after key workflow steps, and final push. Always asks user confirmation with a
  short summary before any mutating git/GitHub operation. Use for create
  provisioning and for commit/push throughout create/maintain.
disable-model-invocation: true
---

# mia-git

## Purpose

Git / GitHub agent for MIA plugins. Three operations:

| Operation | When |
|-----------|------|
| **`provision`** | Create only, **before** `mia-init` — remote + dirs + `tmp.txt` + `master`/`develop` |
| **`commit`** | After key steps (init, plan, openapi, back, tests, sdk, front, readme, …) — stage + commit |
| **`push`** | End of create/maintain batch — push current branch to `origin` |

Shared conventions: [reference.md](../reference.md).

## Confirmation rule (mandatory)

**Before every mutating operation**, stop and ask the user for confirmation with a **short synthetic summary**. Do **not** run the mutation until the user explicitly confirms.

| Operation | Summary must include |
|-----------|----------------------|
| Remote create / dir create / branch create | What will be created (name, visibility, paths, branches) |
| **`commit`** | List of **staged files** + full **commit message** text |
| **`push`** | Branch name + list of **file names** included in the commit(s) being pushed (from `git show --name-only` / range vs upstream) |

If the user refuses: status **`blocked`** (or **`fail`** if required and aborted), do not mutate.

## Expected input

Required (all operations):
- **Operation**: `provision` | `commit` | `push`

### `provision`

Required:
- **Plugin name** (remote repo name)
- **Projects directory** (`PROJET_REP`) — plugin root = `PROJET_REP/<plugin-name>`

Optional:
- Visibility: `public` (default) | `private`
- Description (for `gh repo create`)

### `commit`

Required:
- Plugin root as **cwd**
- **Commit context** (which step just passed, e.g. `mia-init`, `mia-plan`, …) to draft the message

Optional:
- Explicit commit message override
- Pathspecs to stage (default: all relevant changes for that step; never stage secrets)

### `push`

Required:
- Plugin root as **cwd**

Optional:
- Remote / branch (default: `origin` + current branch, usually `develop`)

## Gate (do first)

1. Verify every **Required** input for the selected operation. Missing → **`fail`**, hyper-concise, fields in **bold**.
2. **Git accessibility**: `git --version` succeeds. For `provision` and `push`: `gh --version` + `gh auth status` logged-in (or equivalent push auth). Else **`fail`** / **`blocked`**.

## Expected output

### Operation `provision` (create only)

**Before any repo mutation**, run accessibility + existence checks. Stop on failure.

1. Resolve login (`gh api user -q .login`); if `OWNER/<plugin-name>` already exists → **`fail`**. Do not create or overwrite.
2. Confirm with user → create remote (`gh repo create … --public` by default).
3. Confirm → ensure `PROJET_REP` and plugin root exist (empty dirs only beyond step 4).
4. Confirm → create empty **`tmp.txt`** if missing (`mia-init` deletes it later).
5. Confirm → init git if needed, stage/commit `tmp.txt`, set `master`, link `origin`, push `master`.
6. Confirm → create `develop` from `master`, push `develop`.

Leave working tree on **`develop`**. Do not delete or force-push existing remotes.

### Operation `commit`

1. In plugin root: `git status` / diff; stage appropriate files (exclude secrets: `.env`, credentials, etc.).
2. Draft a concise commit message focused on **why** (step context).
3. **Confirm** with summary: **staged files** + **commit message**.
4. On approval: `git commit`. On refusal: do not commit → **`blocked`**.
5. If nothing to commit: **`pass`** with note **nothing to commit** (skip).

### Operation `push`

1. Determine commits ahead of upstream; list **file names** touched by those commits.
2. **Confirm** with summary: branch + **files being pushed**.
3. On approval: `git push` (or `git push -u origin HEAD` if no upstream). On refusal: **`blocked`**.
4. Never force-push unless the user explicitly requests it in the confirmation.

## Conclusion document

```markdown
# Conclusion — mia-git

## Status
**[pass | fail | blocked]**

## Operation
**[provision | commit | push]**

## Checks
- `git`: **ok/ko**
- `gh` auth / user: **[login or n/a or ko]**

## Confirmation
- Asked: **yes**
- User approved: **yes/no/n/a**

## Deliverables
- (provision) Remote: **[URL or n/a]** — Plugin root: **[path]** — Branches: **master**, **develop** — Current: **develop**
- (commit) Message: **…** — Files committed: **…** — or **nothing to commit**
- (push) Branch: **…** — Files pushed: **…** — Remote: **…**

## Proposed next step
(provision) **mia-init**
(commit) next domain agent per orchestrator
(push) close routine / done
```
