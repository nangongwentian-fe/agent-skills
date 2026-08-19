---
name: sync-skill-to-jay
description: Publish a newly created or updated Agent Skill through the jay-skills repository, then reinstall the published version into the canonical global skills directory. Use after a Skill change when the user wants to validate, document, commit, push, and install it. Do not publish private or local-only Skills without explicit approval.
---

# Sync Skill to Jay

Treat `jay-skills/skills/<skill-name>` as the sole publishable source of truth. `~/.agents/skills/<skill-name>` is an installation artifact managed by `npx skills add`, not a source to copy back over the repository.

## Authorization boundary

After a Skill is created or updated, ask once whether the user wants to synchronize, publish, and reinstall it. The confirmation must identify the repository, Skill name, publish branch, Git push, and global installation. One affirmative answer authorizes the complete workflow below, including the bounded one-time SSH fallback described under "Commit and push". Ask again only when a conflict, unexpected dirty worktree, identity mismatch, new credentials, validation failure, or scope expansion requires a new decision.

Do not infer permission to publish another Skill, rewrite Git history, force-push, alter remotes, or expose a private Skill.

## Source resolution

1. Locate the local `jay-skills` checkout and verify that its remote represents `nangongwentian-fe/jay-skills`.
2. Resolve the exact target as `skills/<skill-name>` and prove it stays inside the repository's `skills/` directory.
3. For an existing Skill, edit and validate the repository target directly.
4. For a new Skill created elsewhere, import its complete directory only when the repository target does not yet exist.
5. If an external or installed copy differs from an existing repository target, never copy it over the target. Show the relevant diff and port only the intended changes into the repository source.

Never move, delete, or rewrite an explicit project source or an installed copy merely because publication succeeds.

## Repository update

Before editing, inspect `git status --short --branch`, the current branch, recent commits, remotes, and the remote default branch. Because the install command reads that default branch, the authorized publish branch must be the remote default branch (`main` for `nangongwentian-fe/jay-skills`), and the current branch and upstream must match it. Stop before committing and obtain explicit switch or merge direction when they do not. Preserve unrelated changes and stop if they overlap the target or prevent an honest commit boundary.

Update only artifacts owned by the changed Skill:

- the complete `skills/<skill-name>` directory;
- its existing targeted documentation or evals;
- the corresponding root README table row and detail section when the Skill description or usage changed;
- shared installation examples only when the CLI contract changed.

Do not regenerate the whole README or rewrite unrelated Skill descriptions.

## Validation

Run the active Skill Creator's `scripts/quick_validate.py` against the repository Skill. Validate any changed JSON, scripts, or other resources with their native parser or focused check. Then run `git diff --check` and inspect the complete target diff for secrets, generated artifacts, accidental deletions, and unrelated files.

For a substantial workflow change, add or update realistic eval cases. Evals should exercise decisions and observable outcomes rather than merely matching headings or fixed wording.

Do not publish until every required validation passes.

## Commit and push

Create one coherent commit when all changes serve the same Skill outcome; otherwise split them by honest topic. Stage only the reviewed files.

- Use Conventional Commit types such as `feat`, `fix`, `docs`, or `chore`.
- Write the subject and 2–5 outcome-focused body bullets in Chinese unless the user requests another language.
- Do not add a model-specific `Co-Authored-By` trailer unless the user explicitly asks for it.
- Do not amend, rebase, force-push, or switch branches unless separately authorized.

Push the authorized remote default branch through its configured upstream, then verify that the configured remote-tracking branch (normally `origin/main`) points exactly to the new commit. If an HTTPS push fails only because credentials are unavailable, the initial workflow approval also authorizes this bounded fallback: verify an existing GitHub SSH identity, push once through the equivalent SSH URL without changing `origin`, then fetch the configured remote to refresh its tracking reference. Stop and ask again on identity mismatch, when new credentials or a remote change would be required, or on any non-authentication failure.

## Install the published Skill

Only after the remote commit is verified, reinstall the selected Skill non-interactively under the authorization already granted:

```bash
npx skills add nangongwentian-fe/jay-skills \
  --skill <skill-name> \
  --global \
  --yes
```

Do not pass `--agent`. The canonical success target is:

```text
~/.agents/skills/<skill-name>
```

Codex can discover this canonical directory directly. Do not require or create `~/.codex/skills` or `~/.claude/skills` links as part of this workflow.

Verify the installed `SKILL.md`, complete file set, and file contents against the pushed repository version. Ignore line-ending-only differences. Do not trust the installer exit code alone: an unsupported unrelated adapter such as PromptScript is a warning when the canonical directory is complete and matches; a missing or mismatched canonical installation is a failure even if the command exits successfully.

If publication succeeds but installation or verification fails, keep the published commit, report the exact installation state, and stop. Do not roll back or rewrite remote history.

## Completion report

Report:

- changed Skill and documentation paths;
- validation and eval results;
- commit hash, subject, branch, and push result;
- canonical installation path and content-verification result;
- remaining warnings, conflicts, or unrelated worktree changes.
