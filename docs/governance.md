# Governance and lifecycle

The founding maintainer currently makes target, scope, and registration decisions.
Other maintainers can act when explicitly delegated authority. Anyone can nominate,
research, or submit work. Initial selection is based on research, interest, and time;
there is no automated score or obligation to deliver every accepted idea.

## Nominations (hub issues)

Use exactly one `nomination:*` lifecycle label on a nomination issue:

| Label | Meaning |
| --- | --- |
| `nomination:proposed` | Submitted for consideration; findings may be incomplete |
| `nomination:researching` | Someone is actively investigating feasibility and existing FOSS |
| `nomination:accepted` | Maintainer wants to pursue the bounded target; a repo may not exist yet |
| `nomination:declined` | Decision not to pursue here; record why and any upstream destination |

A maintainer records acceptance/decline in a comment and changes labels. Contributors
may request a transition; claiming a research ticket alone does not change authority.
Remove the old lifecycle label when adding the next. Close declined issues after
recording the decision; close accepted nomination issues when registration is merged,
linking the registry PR and project. Reconsideration remains possible with new evidence.
`candidates.json` is an editorial shortlist, not an exhaustive queue or status mirror.

## Registered projects (projects.json)

Only a maintainer-approved registry PR activates a project. Required fields are
`id`, `name`, `summary`, `repository`, `status`, `license`, `maintainer`,
`nominationUrl`, and `updated` (YYYY-MM-DD). The id is a lowercase hyphenated slug;
repository URLs are unique. Add `content/projects/<id>.md` with scope, current
limitations, links to the approved nomination/spec, and useful contribution pointers.

| Status | Meaning and transition evidence |
| --- | --- |
| `research` | Registered repository; source gathering and workflow discovery |
| `planning` | Scope/specification being reviewed and architecture/tasks being prepared |
| `implementation` | Approved spec exists; implementation tasks are underway |
| `usable` | Declared scope demonstrated, release/verification evidence linked |
| `paused` | Work intentionally suspended; document reason and restart conditions |
| `archived` | No longer maintained; document outcome and alternatives |

Maintainers propose status changes through PRs, update `updated`, and link evidence
in the detail document. States can move backward when evidence invalidates a plan.
Paused/archived projects remain in the registry for an honest history. `usable` is
not a claim of feature parity with the reference application. Issue progress never
automatically promotes registry status.

## Acceptance assessment

Record the user/workflow, existing FOSS and upstream opportunities, research inputs
and restrictions, a plausible bounded scope, platform and performance considerations,
and who is interested in doing the work. Unknowns are explicit. Avoid claiming legal
clearance or feasibility without evidence. Profitability is not required.

Projects normally live under `508-dev`. External repositories need the same review,
an accountable maintainer, public access to canonical records, and an explicit
registration decision. Policy or FOSS-license exceptions require a recorded maintainer
rationale. Commercial restrictions incompatible with FOSS are not an exception path.
