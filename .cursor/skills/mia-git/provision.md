# mia-git — provision (create only)

Read this file only when the operation is **`provision`**. Confirm before every mutation (SKILL.md). Do not load `commit.md` / `push.md`.

**Before any repo mutation**, run accessibility + existence checks. Stop on failure.

Summary must include: what will be created (name, visibility, paths, branches). For checkout/delete: checkout **`develop`**; delete **local** `master` only (keep remote `master`).

1. Resolve login (`gh api user -q .login`); if `OWNER/<plugin-name>` already exists → **`fail`**. Do not create or overwrite.
2. Confirm with user → create remote (`gh repo create … --public` by default).
3. Confirm → ensure `PROJET_REP` and plugin root exist (empty dirs only beyond step 4).
4. Confirm → create empty **`tmp.txt`** if missing (`mia-init` deletes it later).
5. Confirm → init git if needed, stage/commit `tmp.txt`, set `master`, link `origin`, push `master`.
6. Confirm → create `develop` from `master`, push `develop`.
7. Confirm → checkout **`develop`**, then delete the **local** `master` branch (`git branch -d master`). Keep **remote** `master`.

Leave working tree on **`develop`** with no local `master`. Do not delete or force-push existing remotes.
