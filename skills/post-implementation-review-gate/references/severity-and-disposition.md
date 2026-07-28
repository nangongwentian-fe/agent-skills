# Severity and Disposition

Use these definitions to keep review findings consistent across repositories.

## Severity

| Level | Meaning | Typical examples |
| --- | --- | --- |
| P0 | Immediate catastrophic impact or unrecoverable corruption in the intended use | destructive data loss, credential exposure, system-wide outage |
| P1 | Release-blocking correctness, compatibility, security, or availability defect | public API break, wrong production target, authorization bypass |
| P2 | Important verified defect with bounded impact, or a test gap already demonstrated to miss real behavior | documented parameter does not work, reproduced cleanup leak, same-source test that allowed an observed regression |
| P3 | Low-risk maintainability or edge-case defect with a concrete trigger and future failure path | confusing fallback that selects the wrong branch under a named condition, missing diagnostic that blocks a defined investigation |

Do not use P3 for formatting preferences or hypothetical improvements without a failure mode.

An unverified concern is not P2 or P3. Record it as a residual risk or untested area until a broken contract, reproducible failure, or concrete user impact is shown.

## Disposition

| Disposition | Use when | Required evidence |
| --- | --- | --- |
| Fixed | The defect is authorized and corrected | changed code plus passing proportional verification |
| Rejected | The claimed defect is factually incorrect or an authoritative contract proves it is not a defect | inspected code, reproduction result, or authoritative contract |
| Blocked | The defect is real but correction needs user authority, expanded scope, external state, or a product decision | exact blocker and smallest unblocking decision |
| Residual risk | The risk is real but cannot be fully exercised in the current environment | untested environment, unavailable dependency, or bounded uncertainty |

## Fix and re-review policy

1. Fix verified P0/P1 findings before handoff when the existing task authorizes the change.
2. Fix verified P2 findings when the intended behavior is already determined and the change stays in scope.
3. Do not silently convert fixable findings into recommendations.
4. Re-review the fix delta after P0/P1 or a material redesign.
5. Limit automatic review to two rounds; further loops require user direction.
