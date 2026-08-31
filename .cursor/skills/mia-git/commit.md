# mia-git — commit

Read this file only when the operation is **`commit`**. Confirm before every mutation (SKILL.md). Do not load `provision.md` / `push.md`.

Summary must include: list of **staged files** + full **commit message** text.

1. In plugin root: `git status` / diff; stage appropriate files (exclude secrets: `.env`, credentials, etc.).
2. **Never stage `PLAN.md`** — local-only, listed in `.gitignore` (see [reference.md](../reference.md)).
3. Draft a concise commit message focused on **why** (step context).
4. **Confirm** with summary: **staged files** + **commit message**.
5. On approval: `git commit`. On refusal: do not commit → **`blocked`**.
6. If nothing to commit: **`pass`** with note **nothing to commit** (skip).
