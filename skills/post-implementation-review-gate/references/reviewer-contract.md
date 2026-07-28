# Independent Reviewer Contract

Use this reference when constructing the subagent task. Keep the prompt self-contained so the reviewer does not need the primary conversation.

## Prompt template

```text
Act as an independent code reviewer. This is a read-only task: do not edit,
format, delete, stage, commit, push, deploy, or contact external systems.

Repository:
<absolute repository path>

Immutable review anchor:
<commit and diff hash, or hashes of every target file>

User objective:
<objective>

Acceptance criteria and stable contracts:
<criteria, compatibility promises, relevant types or API contracts>

Review scope:
<changed files, diff base, or bounded subsystem>

Known unrelated work to ignore:
<dirty files or subsystems that must not be judged as this task's changes>

Verification already run:
<commands and results>

Review the actual implementation, affected callers and consumers, and tests.
Look for correctness, compatibility, lifecycle, error-path, security,
concurrency, configuration, documentation/runtime mismatch, and weak tests.
Do not report pure style preferences.
Do not repeat the already-passed full verification suite unless a suspected
finding needs a focused reproduction.

Return findings first, ordered P0 to P3. Every finding must include:
- severity and concise title;
- exact file and tight line range;
- broken contract or user impact;
- concrete evidence or reproduction;
- smallest viable fix direction.

If a concern has no demonstrated broken contract, failure, or user impact,
list it only as a residual risk or untested area, not as a finding.

If no actionable finding exists, say "No findings" and list meaningful
residual risks or untested environments.
```

## Scope-packet checklist

- The objective describes the completed change, not the implementation narrative.
- Acceptance criteria include compatibility constraints the diff might violate.
- Paths are absolute or unambiguous.
- The reviewer knows which dirty files are unrelated.
- The scope has an immutable anchor that the primary agent will compare after return.
- The reviewer is told which tests passed, but is not asked to trust them.
- The output contract requests evidence and exact locations.
- The output contract separates verified findings from unverified risks.
- The prompt explicitly forbids writes and external side effects.

## Review dimensions

| Dimension | Questions |
| --- | --- |
| Correctness | Does the implementation satisfy the stated behavior, including negative paths? |
| Compatibility | Did a migration, parser, schema, response, status, header, or default change unexpectedly? |
| Integration | Do callers, consumers, generated artifacts, and runtime configuration agree? |
| Lifecycle | Are setup and cleanup symmetric across mount, unmount, retry, cancellation, and failure? |
| Reliability | Are timeouts, partial failure, concurrency, and idempotency handled at the correct boundary? |
| Security | Did authorization, validation, secret handling, or external access broaden? |
| Tests | Are expectations independent of the implementation source and do they exercise real behavior? |
| Scope | Are unrelated user changes preserved and excluded from the verdict? |

## Reviewer boundaries

The reviewer reports; the primary agent decides. The reviewer must not:

- change files to demonstrate a fix;
- infer authorization for production or external actions;
- treat a green test suite as proof that contracts are correct;
- report speculative style preferences as defects;
- review unrelated dirty-worktree changes as part of the task.

The reviewer must be newly created for this gate, must not have participated in
the implementation, and must receive the smallest self-contained context
available. If those conditions cannot be met, label the result as a local
fallback rather than an independent review.
