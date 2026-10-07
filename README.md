# Genairosity

**Useful software. Freely yours.**

Genairosity is a [508.dev](https://508.dev) initiative to research and build free,
open-source alternatives to proprietary software through documented independent
implementation. We choose useful workflows, research what already exists, and
contribute upstream when that is the better use of our effort.

We are mission-driven: a project does not need to recover its build or generation
cost. AI-assisted development is a practical option, never a participation requirement.
Humans initiate any model work locally, with the tools and models they choose.

- [Website](https://508-dev.github.io/genairosity/)
- [Suggest a target](https://github.com/508-dev/genairosity/issues/new?template=nomination.yml)
- [Investigation shortlist](https://github.com/508-dev/genairosity/issues?q=is%3Aissue+label%3Anomination)
- [Contribute](CONTRIBUTING.md) · [Establish a project](docs/project-setup.md)

## Current milestone

This repository establishes the public hub, contribution pipeline, and reusable
project devkit. The five initial candidates are investigations, not announced
implementations. A pilot comes later. There are no registered projects at launch.

## Local development

Install Bun 1.4.0 and Python 3.10 or newer, then:

```sh
bun install --frozen-lockfile
./scripts/check-all.sh
./scripts/dev.sh
```

The preview prints its URL and watches source files. `./scripts/worktree-ports.sh env`
shows its checkout-specific port. See [development](docs/development.md).

## Source of truth

| Information | Canonical location |
| --- | --- |
| Membership, repository links, project-level status | `projects.json` |
| Project descriptions | `content/projects/<id>.md` |
| Nominations, research discussion, acceptance | Hub GitHub issues |
| Curated candidate presentation and issue links | `candidates.json` (no copied issue status) |
| Project implementation work | That project's GitHub issues and PRs |
| Policy and authority | `DECISIONS.md` and `docs/governance.md` |

Merging a conforming repository into the registry activates a project. Acceptance
of a nomination alone does not. The website is generated from committed files;
it does not need runtime GitHub access, a database, or a model API.

## Project starter

```sh
python3 scripts/init-project.py /tmp/my-project \
  --id my-project --name 'My Project' \
  --summary 'The specific user workflow this project will investigate.' \
  --repository https://github.com/508-dev/my-project --maintainer YOUR_GITHUB_LOGIN
python3 /tmp/my-project/scripts/check-project.py
```

The destination must not exist. Review and complete the generated charter before
publication or registration. See [project setup](docs/project-setup.md).

## Principles and licensing

Legal and independently implemented; FOSS throughout, including self-hostable
server components; performant; accessible to ordinary users; Linux-first for
cross-platform desktop software and Android-first for mobile where appropriate.
Rust is preferred when it fits. Avoid duplicating strong existing FOSS efforts.
AI features, if any, should support configurable providers and local endpoints.

Original hub code, documentation, and project starter: **AGPL-3.0-or-later**.
Retained 508 Devkit portions keep their GPL terms; see [NOTICE.md](NOTICE.md).
No warranty. The mission imposes no restriction on commercial use permitted by
these licenses. Reference product names identify investigation subjects and do
not imply affiliation or endorsement.
