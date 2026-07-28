---
name: sync-skill-to-jay
description: "Post-action workflow that triggers automatically after creating a new skill or updating an existing skill. Ask the user whether to sync the skill to the jay-skills repository and publish to remote. Use whenever a SKILL.md has just been created or modified."
---

# Sync Skill to Jay

After creating or updating a skill, ask the user:

> 是否需要将此 skill 同步到 jay-skills 并发布到远程？

If yes, execute the following workflow.

## Workflow

### 1. Locate or clone jay-skills repo

If the user already provided a `jay-skills` path, use it after verifying the
directory and Git remote. Otherwise search common local paths.

macOS / Linux:

```bash
find ~ -maxdepth 5 -type d -name "jay-skills" 2>/dev/null | head -1
```

Windows PowerShell:

```powershell
Get-ChildItem -Path $env:USERPROFILE -Directory -Filter jay-skills -Recurse -ErrorAction SilentlyContinue |
  Select-Object -First 1
```

- If found → use that path as `JAY_SKILLS_DIR`
- If not found → **ask the user**: "本地未找到 jay-skills 仓库，请提供你希望克隆到的目录路径（例如 ~/Documents/Projects）"
  Then clone into the user-provided path:
  ```bash
  git clone https://github.com/nangongwentian-fe/jay-skills.git <user-provided-path>/jay-skills
  ```

### 2. Sync skill files

Resolve the source in this order:

1. An explicit skill path supplied by the user
2. `~/.agents/skills/<skill-name>` (universal/Codex installation)
3. `~/.claude/skills/<skill-name>` (Claude Code installation or link)

Keep these roles separate:

- `SOURCE_SKILL_PATH`: the authoritative content to publish. An explicit
  project/repository source is never moved. A discovered user-install source
  may later be replaced only after the repository target is fully validated.
- `TARGET_REPO_SKILL_PATH`: the exact `$JAY_SKILLS_DIR/skills/<skill-name>`
  destination.
- `CURRENT_INSTALL_PATHS`: existing `.agents` and `.claude` installation
  entries that form the current topology and may later be replaced.

Verify that the source contains `SKILL.md` and that the target remains inside
`$JAY_SKILLS_DIR/skills/`. If source and target resolve to the same path, skip
the copy.

Never copy the source directory onto an existing target directory: both
`cp -R SOURCE TARGET` and `Copy-Item SOURCE TARGET -Recurse` can create a
nested `<skill-name>/<skill-name>` directory. Instead:

1. Copy the source contents into a uniquely named staging directory.
2. Validate the staged `SKILL.md` and complete file set.
3. Move an existing exact target to a temporary backup.
4. Move staging to the exact target.
5. On failure, restore the target backup.
6. After success, move the target backup to Trash/Recycle Bin.

Works for both new and existing skills.
See [references/platform-commands.md](references/platform-commands.md) for the
cross-platform state machine and safe command primitives.

### 3. Update jay-skills README

After syncing the skill files, regenerate `$JAY_SKILLS_DIR/README.md` to reflect the current state of all skills in the repo.

**How to build the README:**

1. Scan all skill directories under `$JAY_SKILLS_DIR/skills/`
2. For each skill, read its `SKILL.md` and extract:
   - `name` (from frontmatter)
   - `description` (from frontmatter)
   - Any `## Examples` or `## 示例` section content (if present) — use as the "效果示例"
3. Generate a README with the following structure:

```markdown
# Jay Skills

> Jay 的 AI Agent Skills 集合，适用于 Claude Code / Codex 等 AI 编程工具。

## 安装

\`\`\`bash
npx skills add https://github.com/nangongwentian-fe/jay-skills -g -y -a claude-code codex
\`\`\`

## Skills 列表

| Skill | 描述 |
|-------|------|
| [skill-name](#skill-name) | one-line description |
...

---

## skill-name

**描述：** ...

**触发场景：** （从 description 中提取触发条件，以要点形式列出）

**效果示例：**

（如果 SKILL.md 中有 Examples / 示例 section，粘贴内容；否则省略此小节）

---
（重复以上结构，每个 skill 一节）
```

**Rules:**
- Keep descriptions concise — one sentence max in the table; full description in the detail section
- If a skill's `SKILL.md` has no Examples section, omit "效果示例" for that skill
- Preserve existing README content that is not auto-generated (e.g., top-level intro) if it already exists — only regenerate the skills table and detail sections
- Write the final README in Chinese where natural; keep code/skill names in English

### 5. Commit and push

From `$JAY_SKILLS_DIR`:

Stage both the skill files and the updated README:
```bash
git add skills/<skill-name> README.md
```

- New skill: `feat: add <skill-name> skill`
- Updated skill: `improve: <brief description of what changed> in <skill-name>`
- Always append `Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>`

Push to `origin main`.

### 6. Remove local skill and reinstall via npx

Replace the bare local installation through a recoverable swap:

1. Resolve `CURRENT_INSTALL_PATHS` separately from `SOURCE_SKILL_PATH`:
   - inventory both `~/.agents/skills/<skill-name>` and
     `~/.claude/skills/<skill-name>` before moving either one;
   - preserve whether each entry is a real directory or link/junction;
   - never treat an explicit project or repository source as disposable;
   - if the discovered source is itself a user installation, first validate
     the synchronized repository target, then handle that installation through
     the recoverable replacement transaction.
2. Move only the verified current installation entries to separate uniquely
   named temporary backups outside the managed skill paths. Move agent-specific
   links before their managed target so they do not become broken mid-check.
3. Run the install command below.
4. Verify the new managed `.agents` `SKILL.md`, full file set/content against
   `TARGET_REPO_SKILL_PATH`, and Claude Code/Codex link topology.
5. Treat installation and all verification as one transaction. If any step
   fails, move partial new installations aside and restore every backup to its
   original exact path and topology.
6. After success, move regular-directory backups to Trash/Recycle Bin. Remove
   link/junction backups only with a verified link-only operation; otherwise
   retain the inactive backup and report its exact path.

```bash
npx skills add https://github.com/nangongwentian-fe/jay-skills --skill <skill-name> -g -y -a claude-code codex
```

- `--skill <skill-name>` — only installs this specific skill, not all skills in the repo
- `-g` — installs globally (user-level, into `~/.agents/skills/` with symlinks)
- `-y` — non-interactive, no prompts
- `-a claude-code codex` — only installs to Claude Code and Codex agents

This replaces the manually created skill with the properly installed version (symlinks and other optimizations from the skills framework).
See [references/platform-commands.md](references/platform-commands.md) for
recoverable macOS/Linux and Windows command examples.

## Notes

- Only sync skills the user explicitly wants published (some may be private)
- Subdirectories (`scripts/`, `references/`, `assets/`) are included automatically via `cp -r`
- The `npx skills add` step ensures the installed skill is managed by the skills framework, not a bare copy
- Treat line-ending-only differences (`CRLF` versus `LF`) as equivalent when
  comparing a Windows Git worktree with the installed GitHub copy.
