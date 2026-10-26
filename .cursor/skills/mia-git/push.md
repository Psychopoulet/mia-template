# mia-git — push

Read this file only when the operation is **`push`**. Confirm before every mutation (SKILL.md). Do not load `provision.md` / `commit.md`.

Summary must include: branch name + list of **file names** included in the commit(s) being pushed (from `git show --name-only` / range vs upstream).

1. Determine commits ahead of upstream; list **file names** touched by those commits (**must not** include `PLAN.md` going forward).
2. **Confirm** with summary: branch + **files being pushed**.
3. On approval: `git push` (or `git push -u origin HEAD` if no upstream). On refusal: **`blocked`**.
4. Never force-push unless the user explicitly requests it in the confirmation.
5. **After a successful push** (end of create/maintain batch): delete **`PLAN.md`** from the plugin root if the file exists. Report deletion in the conclusion.
