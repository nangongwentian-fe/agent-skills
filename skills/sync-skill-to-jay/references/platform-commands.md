# Platform Commands

Use these primitives to implement the workflow's two transactions:

1. replace the exact repository target from a validated staging copy;
2. replace the current user installation, then verify the complete managed
   installation before accepting it.

Keep the following paths distinct:

| Role | Meaning | May be moved? |
| --- | --- | --- |
| `SOURCE_SKILL_PATH` | Authoritative skill content supplied or discovered | Explicit project/repository sources: no. Discovered user installs: only after the repository target is validated, through the installation transaction |
| `TARGET_REPO_SKILL_PATH` | Exact `jay-skills/skills/<skill-name>` target | Only as part of a recoverable staging swap |
| `CURRENT_INSTALL_PATHS` | Existing `.agents` directory plus any `.claude` directory/link topology | Yes, each entry to its own verified temporary backup |
| `MANAGED_SKILL_PATH` | Expected post-install `.agents` path | Partial results may be quarantined on failure |

Never run a recursive operation against an unresolved variable, home
directory, repository root, or `skills/` root.

## Repository target transaction

Use the same state machine on every platform:

```text
resolve and validate source + exact target
if source == target: skip synchronization
copy source contents -> unique staging directory
validate staging SKILL.md + file set
move existing exact target -> unique backup
move staging -> exact target
on failure: quarantine partial target, restore backup
on success: verify target, then move backup to Trash/Recycle Bin
```

Copy the **contents** into an empty staging directory, not the source directory
onto an existing target.

macOS / Linux primitive:

```bash
mkdir -p "$staging_path"
cp -R "$source_skill_path/." "$staging_path/"
test -f "$staging_path/SKILL.md"
```

Windows PowerShell primitive:

```powershell
New-Item -ItemType Directory -Path $stagingPath | Out-Null
Get-ChildItem -LiteralPath $sourceSkillPath -Force |
  Copy-Item -Destination $stagingPath -Recurse -Force

if (-not (Test-Path -LiteralPath (
  Join-Path $stagingPath "SKILL.md"
))) {
  throw "Staged skill is missing SKILL.md"
}
```

Before any `Move-Item`/`mv`, revalidate that staging, target, backup, and
quarantine paths remain inside their intended repository or temporary
directories.

## Installation transaction

Resolve `CURRENT_INSTALL_PATHS` independently. Inventory both paths before
moving either one:

```text
record ~/.agents/skills/<skill-name> if it exists
record ~/.claude/skills/<skill-name> if it exists
record whether each entry is a real directory or link/junction
```

An explicit `SOURCE_SKILL_PATH` outside those user installation roots remains
an authoritative source and must not be moved or deleted. A source discovered
inside `.agents` or `.claude` may also be an installation entry; synchronize
and validate the repository target first, then replace that installation only
through the transaction below.

Then execute one transaction:

```text
move agent-specific links -> separate temporary backups, if they exist
move the managed/current directories -> separate temporary backups
run npx skills add
verify exit code
verify MANAGED_SKILL_PATH/SKILL.md
verify complete installed file set/content against TARGET_REPO_SKILL_PATH
verify Claude Code/Codex link topology
if any install or verification step fails:
    quarantine every partial managed/link path created by this attempt
    restore every backup -> its original exact path and topology
    report quarantine paths
    fail
if every check passes:
    move backup to Trash/Recycle Bin
```

Install command:

```bash
npx skills add https://github.com/nangongwentian-fe/jay-skills \
  --skill <skill-name> -g -y -a claude-code codex
```

### Windows transaction structure

Use one `try/catch` around installation **and all verification**:

```powershell
$managedSkillPath = Join-Path $env:USERPROFILE (
  ".agents\skills\<skill-name>"
)
$claudeSkillPath = Join-Path $env:USERPROFILE (
  ".claude\skills\<skill-name>"
)

$originalEntries = @()
foreach ($path in @($claudeSkillPath, $managedSkillPath)) {
  if (Test-Path -LiteralPath $path) {
    $originalEntries += [pscustomobject]@{
      Path = $path
      Backup = <new-validated-unique-temp-path>
      Moved = $false
    }
  }
}

try {
  # Preserve the inventory first, then move the Claude link before .agents.
  # These moves are part of the transaction so partial movement is recoverable.
  foreach ($entry in $originalEntries) {
    Move-Item -LiteralPath $entry.Path -Destination $entry.Backup
    $entry.Moved = $true
  }

  npx skills add https://github.com/nangongwentian-fe/jay-skills `
    --skill <skill-name> -g -y -a claude-code codex
  if ($LASTEXITCODE -ne 0) {
    throw "npx skills add failed with exit code $LASTEXITCODE"
  }

  if (-not (Test-Path -LiteralPath (
    Join-Path $managedSkillPath "SKILL.md"
  ))) {
    throw "Managed installation is missing SKILL.md"
  }

  # Compare the complete repository and installed file sets/content here.
  # Treat CRLF/LF-only changes as equivalent.
  # Confirm the Claude path is a link/junction to the managed .agents path.
  # Throw if any verification fails.
}
catch {
  foreach ($partialPath in @($claudeSkillPath, $managedSkillPath)) {
    $originalEntry = $originalEntries |
      Where-Object Path -EQ $partialPath |
      Select-Object -First 1

    # An original entry whose move failed is still valid, not a partial install.
    if (
      (-not $originalEntry -or $originalEntry.Moved) -and
      (Test-Path -LiteralPath $partialPath)
    ) {
      $quarantinePath = <new-validated-unique-temp-path>
      Move-Item -LiteralPath $partialPath -Destination $quarantinePath
    }
  }

  foreach ($entry in ($originalEntries | Sort-Object Path)) {
    if ($entry.Moved -and (Test-Path -LiteralPath $entry.Backup)) {
      Move-Item -LiteralPath $entry.Backup -Destination $entry.Path
    }
  }
  throw
}
```

After the `try/catch`, perform the full file/link verification once more before
cleaning each exact backup. For a regular directory backup, a recoverable
Windows cleanup primitive is:

```powershell
Add-Type -AssemblyName Microsoft.VisualBasic
foreach ($entry in $originalEntries) {
  $backupItem = Get-Item -LiteralPath $entry.Backup -Force
  if (-not $backupItem.LinkType) {
    [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory(
      $entry.Backup,
      [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs,
      [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin
    )
  }
}
```

For a link/junction backup, use a host-proven link-only removal operation that
does not traverse the target. If that primitive is unavailable or blocked,
retain the inactive backup and report its exact path.

### macOS / Linux transaction structure

Use a trap so any failure after moving the current installation entries
restores all of them. Inventory both paths first; move the `.claude` link before
its `.agents` target. Before restoration, move partial `.agents`/`.claude`
results to unique quarantine paths; do not move a backup into an existing
partial directory.

Only clear the trap after the install, complete file/content comparison, and
link verification all succeed. Prefer a platform Trash command for backup
cleanup. If none is available, keep the verified backup and report its path.

## Completion checks

- `origin/main` points to the pushed commit.
- `MANAGED_SKILL_PATH/SKILL.md` exists.
- Installed and repository file sets/content match, ignoring line endings only.
- Claude Code links to the managed `.agents` installation.
- Failed partial installations, if any, are reported at their quarantine paths.
- Every temporary backup is restored after failure, or removed/explicitly
  reported as an inactive retained backup after success.
