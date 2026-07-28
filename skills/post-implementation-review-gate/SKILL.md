---
name: post-implementation-review-gate
description: Use after completing a non-trivial implementation and before final handoff, especially for public API/schema compatibility, database or migration work, authentication/security, deployment/configuration, concurrency or data integrity, algorithmic or control-flow complexity, cross-module refactors, runtime lifecycle, and rendered UI behavior. Make sure to invoke this skill even when the user asks only to implement or fix something and does not explicitly request review. Risk-classify the completed change, use a new isolated read-only subagent for review-triggering changes when delegation is allowed, otherwise perform and disclose a local fallback, verify findings, fix authorized in-scope defects, rerun relevant checks, and report residual risks. Do not use for planning, answer-only or diagnosis-only tasks, trivial text edits, mechanical formatting, or tasks with no implementation-artifact change.
compatibility: Uses collaboration subagent tools when available; otherwise requires read access to the changed codebase for a disclosed local fallback.
---

# Post-Implementation Review Gate

Use an independent reviewer to catch defects that the implementing context is likely to overlook. The reviewer supplies a second perspective; the primary agent remains responsible for evidence, fixes, verification, and the final answer.

## Gate outcome

Do not declare a review-triggering implementation complete until one of these outcomes is true:

- an independent review completed and every finding was verified and dispositioned;
- independent review was unavailable because delegation was forbidden or remained unavailable after one bounded retry, and the final answer identifies the local fallback performed.

The gate does not broaden authorization. Keep production changes, external writes, destructive actions, secrets, and unrelated work outside the scope originally granted by the user.

## Select the gate level

Use an independent reviewer when any risk signal applies:

- public API, schema, wire protocol, compatibility, or shared type changes;
- database, migration, persistence, authentication, authorization, or secret handling;
- deployment automation, environment configuration, routing, proxy, or release behavior;
- concurrency, retries, cancellation, lifecycle cleanup, data integrity, or security boundaries;
- non-trivial algorithm, control-flow, state-machine, parsing, or error-handling changes;
- cross-module refactors, generated/runtime contract coupling, or rendered UI behavior;
- behavior that is not fully exercised by a direct, independent test.

A structured local review without a subagent is allowed only when all of these are true:

- the change is confined to one bounded module;
- the implementation change itself is simple, mechanical, and easy to verify line by line;
- it does not touch any risk signal above;
- a direct behavioral test fully exercises the changed path and passes;
- rollback is simple and the user-visible blast radius is small.

If uncertain, use the independent reviewer. For a local-review outcome, record the skip reason and proportional verification concisely; do not perform the full review ceremony.

## Workflow

1. Finish the implementation and its first proportional verification.
2. Select the gate level using the criteria above. Stop after a documented local review when every low-risk condition is satisfied.
3. Freeze the review scope before spawning the reviewer:
   - user objective and acceptance criteria;
   - repository and working directory;
   - changed files or diff boundaries;
   - contracts that must remain stable;
   - relevant tests already run;
   - unrelated dirty-worktree changes the reviewer must ignore.
   - an immutable anchor such as the reviewed commit plus diff hash, or hashes of every target file.
4. Read [references/reviewer-contract.md](references/reviewer-contract.md).
5. Spawn one independent reviewer:
   - create a new reviewer that did not participate in the implementation;
   - use the smallest isolated context available, such as `fork_turns: "none"`;
   - if a new isolated reviewer is unavailable, do not call the review independent; use the fallback and disclose it;
   - provide a self-contained prompt using the reference template;
   - make the task read-only and forbid file edits;
   - ask for findings first, ordered by severity, with exact evidence;
   - ask for residual risks when no actionable finding exists.
6. Keep the review bounded:
   - give the reviewer the frozen diff, contracts, and verification results;
   - do not ask it to repeat a full test suite that already passed unless a finding needs reproduction;
   - use one bounded wait and the existing single-retry failure policy.
7. Avoid changing the reviewed files while the reviewer is running. When it returns, compare the immutable anchor. If the scope changed, review the new delta before passing the gate.
8. Retain auditable review evidence in the task context:
   - reviewer task identity;
   - the exact scope packet or prompt;
   - the raw final findings or a traceable returned payload.
   Do not add review transcripts to the project unless the user requests them.
9. Verify every returned finding yourself:
   - inspect the cited code and affected callers;
   - when safe, feasible, and authorized, reproduce behavior with the smallest relevant test, request, build, or rendered interaction;
   - otherwise verify from bounded static evidence and classify any remaining uncertainty explicitly;
   - reject unsupported findings with concrete evidence rather than deference.
10. Read [references/severity-and-disposition.md](references/severity-and-disposition.md) and disposition each verified finding.
11. Fix findings that are authorized, in scope, and sufficiently specified by the existing requirements.
12. Rerun proportional verification after fixes.
13. Run one follow-up independent review when a verified P0/P1 was fixed or the fix materially changed the design. Review only the new delta. Stop after two review rounds unless the user explicitly requests more.
14. Run any applicable post-task learning or documentation-maintenance workflow only after this review gate closes.

## Review scope

Ask the reviewer to inspect more than the patch:

- requirements and compatibility contracts;
- callers, consumers, types, schemas, migrations, and configuration;
- error paths, lifecycle cleanup, concurrency, and security boundaries;
- tests for independence, negative cases, and real behavior;
- generated documentation and runtime behavior when both exist;
- dirty-worktree boundaries and unintended edits.

Prefer concrete defects over style preferences. A useful finding explains how the behavior fails, not merely how the reviewer would write the code differently.

A concern is not a finding until it demonstrates a broken contract, reproducible failure, or concrete user impact. Put plausible but unverified concerns under residual risks or untested areas; do not label them P2 or block delivery solely on speculation.

## Primary-agent verification

Treat subagent output as untrusted review input, not as a verdict.

For each finding, record:

| Field | Required evidence |
| --- | --- |
| Severity | P0, P1, P2, or P3 using the shared definitions |
| Location | Exact file and tight line range |
| Contract | Requirement, API, invariant, type, or user-visible behavior at risk |
| Evidence | Reproduction, call chain, test gap, or runtime observation |
| Disposition | Fixed, rejected, blocked, or accepted residual risk |
| Verification | Command or interaction that proves the disposition |

Do not silently defer a verified in-scope defect that can be safely fixed under the user's existing authorization.

## Failure handling

- If spawning fails, retry once with a smaller self-contained scope.
- If the reviewer times out, inspect its partial evidence, then retry once only when useful.
- If the user forbids delegation, do not spawn or retry. Perform the bounded local fallback and disclose that independent review was unavailable by instruction.
- If independent review remains unavailable, perform a local review and disclose that it was not independent.
- If the reviewer requests user input, route the question through the primary agent.
- If the review discovers a needed action outside current authority, stop that action and state the exact permission or decision required.
- Never let the reviewer edit, commit, push, deploy, or contact external systems.

## Final handoff

Lead with unresolved findings. When the gate passes, keep the report compact:

```markdown
Review gate: passed | passed with residual risk | independent review unavailable

| Finding | Verification | Disposition |
| --- | --- | --- |
| ... | ... | fixed/rejected/blocked/residual |

Validation:
- ...

Residual risks:
- ...
```

When no finding remains, say so explicitly and list only meaningful untested areas. Do not expose internal chain-of-thought or dump the review transcript.
