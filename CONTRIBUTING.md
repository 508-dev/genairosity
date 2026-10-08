# Contributing to Genairosity

Anyone may suggest software, contribute research, improve the hub, or submit a PR.
You can work manually or use any locally initiated coding harness. No particular
model, subscription, operating system, or AI tool is required for participation.

## Suggest and investigate

Open a [nomination](https://github.com/508-dev/genairosity/issues/new?template=nomination.yml).
Describe the user and specific workflow, why it matters, known FOSS options, and
sources. Unknowns are welcome: mark them as unknown rather than inventing evidence.
Read existing nominations before opening a duplicate.

Research must assess existing FOSS projects before proposing another implementation.
An upstream contribution can be the best outcome. Selection is research-informed
and currently driven by the founding maintainer's interest and available time;
profitability is not required. See [governance](docs/governance.md).

For agent-assisted research, keep substantive findings in a draft in the agent
session or ignored local scratch. The Overseer checks source links, dates, terms,
claims about existing features, and project scope; the researcher revises the draft
before a reviewed summary is posted to the issue. A short coordination claim can
still be posted before starting. Review of a draft authorizes publication of those
findings, not nomination acceptance or specification approval. See the
[Overseer workflow](docs/overseer.md).

In any GitHub issue body or comment, wrap GitHub issue URLs and shorthand references
in inline code, such as `https://github.com/owner/repo/issues/123`, `owner/repo#123`,
or `#123`. Do not make them active Markdown links; cross-references can create
backlinks and notifications on other projects. Keep links to ordinary source
documentation clickable.

## Work a ticket

1. Pick an open issue in the repository that owns the work. Read its dependencies,
   acceptance criteria, and referenced policy. Ask for clarification if it is not actionable.
2. Comment that you intend to work on it and describe a bounded approach. Maintainers
   assign when possible. A claim is coordination, not an exclusive lock; check recent activity.
3. Fork/clone and create a branch. If using an agent, start it locally and give it the
   issue URL, `AGENTS.md`, and the allowed scope. You control its permissions and costs.
4. Implement or research within scope. Keep source provenance. Research tickets can
   deliver documents; application implementation requires an approved specification.
5. Run the relevant checks and open a PR linking the issue. Include what changed,
   verification evidence, remaining limitations, and source/license information.
6. A maintainer reviews and merges. Update status records explicitly when warranted.

Use `gh issue view NUMBER --repo OWNER/REPO` to read work from a terminal. `gh pr create`
can submit a PR from any harness; GitHub's web interface works equally well. Never
copy access tokens or proprietary materials into prompts, issues, logs, or commits.

## Ticket contract

Actionable work needs an objective, prerequisites/dependencies, bounded scope and
exclusions, acceptance criteria, and a verification method. The work issue form
captures these. A checklist is not evidence: attach the actual findings or check results.
If blocked, leave a concise explanation and next action instead of claiming completion.

## Hub development

See [development](docs/development.md). Run `./scripts/check-all.sh` before a PR.
Project registration has an additional [review checklist](docs/project-setup.md).
Changes to `devkit/template` must pass initializer and conformance tests.

## Research and licensing

Follow [the clean-room process](docs/clean-room.md). Submit only material you may
license under the applicable repository license; preserve upstream notices.
No contributor license assignment is required. Original hub contributions are
AGPL-3.0-or-later unless a file carries an applicable inherited license notice.

Keep discussion respectful and specific. Maintainers may close duplicates, decline
out-of-scope work, or moderate harassment. Report vulnerabilities through [SECURITY.md](SECURITY.md).
