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

Git / GitHub agent for MIA plugins. Operations: **`provision`** (create only, **before** `mia-init`) · **`commit`** (after key steps) · **`push`** (end of create/maintain batch).

Shared conventions: [reference.md](../reference.md).

Read **only** the sidecar for the current operation — do not load the others:
- **`provision`** → [provision.md](provision.md)
- **`commit`** → [commit.md](commit.md)
- **`push`** → [push.md](push.md)

## Confirmation rule (mandatory)

**Before every mutating operation**, stop and ask the user for confirmation with a **short synthetic summary**. Do **not** run the mutation until the user explicitly confirms. What the summary must include is in the sidecar.

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
- **Commit context** (which step just passed, e.g. `mia-init`, `mia-back`) to draft the message

Optional:
- Explicit commit message override
- Pathspecs to stage (default: all relevant changes for that step; never stage secrets)

### `push`

Required:
- Plugin root as **cwd**

Optional:
- Remote / branch (default: `origin` + current branch, usually `develop`)

Gate: see [reference.md](../reference.md). Then **Git accessibility**: `git --version` succeeds. For `provision` and `push`: `gh --version` + `gh auth status` logged-in (or equivalent push auth). Else **`fail`** / **`blocked`**.

## Expected output

Execute the current operation's sidecar. Do not inline those steps here.

Conclude: 5 lines per [reference.md](../reference.md). Deliverables: operation; confirmation asked/approved; provision → URL+root+branches (local `develop` only); commit → message+files or nothing; push → branch+files+`PLAN.md` deleted. Heading: `n/a`. Next: provision → `mia-init`; commit → next domain agent; push → done.
