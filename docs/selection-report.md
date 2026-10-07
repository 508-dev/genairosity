# Genairosity foundation selection report

Recorded before implementation, 2026-10-07. Scope: replace the 508 Devkit
bootstrap with the approved Genairosity hub, static Pages site, contribution
pipeline, and a small stack-neutral project devkit. A pilot is deferred.
The source and target are this checkout; absent source-manifest entries are
explicitly recorded. Generated or machine-owned directories are not product files.

| Top-level path | Source | Decision | Reason |
| --- | --- | --- | --- |
| `.git/` | target | skip | Preserve repository history and configuration. |
| `.agents/` | target | skip | Preserve environment-managed agent configuration. |
| `.codex/` | target | skip | Preserve environment-managed agent configuration. |
| `.cursor/` | source, absent | skip | Canonical AGENTS.md is sufficient for the hub. |
| `.dockerignore` | source, absent | skip | The static hub has no Docker build. |
| `.editorconfig` | source, absent | adopt | Establish consistent text formatting. |
| `.env.example` | source, absent | adapt | Document local preview port and Pages base path only. |
| `.github/` | source, absent | adapt | Add actual forms, PR template, CI, and Pages publishing. |
| `.gitignore` | source, absent | adopt | Exclude dependencies, generated site, secrets, and local scratch. |
| `.pre-commit-config.yaml` | source, absent | skip | Package checks and CI cover the initial workflow. |
| `.sops.yaml.example` | source, absent | skip | The public static hub requires no application secrets. |
| `.worktreeinclude` | source, absent | adopt | Copy only ignored local environment configuration. |
| `AGENTS.md` | source/target | adapt | Replace template operations with the agreed hub policy. |
| `CLAUDE.md` | source/target | adapt | Point to harness-neutral canonical instructions. |
| `CONTRIBUTING.md` | source/target | adapt | Document nominations, research, local work, and PRs. |
| `DECISIONS.md` | source/target | adapt | Record the confirmed design and authority boundaries. |
| `LICENSE` | source/target | adapt | State AGPL for new work while preserving inherited GPL text and notices. |
| `MANIFEST.md` | source/target | adapt | Describe the resulting hub and project-devkit inventory. |
| `README.md` | source/target | adapt | Explain Genairosity and its real entrypoints. |
| `SECURITY.md` | source/target | adapt | Provide an actionable private reporting route. |
| `biome.json` | source/target | adapt | Lint and format the small static build and data files. |
| `bun.lock` | source/target | adapt | Retain only the hub tooling dependency graph. |
| `bunfig.toml` | source/target | adapt | Keep seven-day cooldowns and isolated installs. |
| `compose.yml` | source/target | delete | The hub needs no database or infrastructure services. |
| `docker-compose.yml` | source/target | delete | No Compose services remain. |
| `docs/` | source/target | adapt | Replace template history with contributor and maintainer runbooks. |
| `extras/` | source/target | delete | Generic optional integrations do not serve the approved milestone. |
| `genairosity.md` | target | adopt | Preserve the user's original proposal as historical intent. |
| `llms.txt` | source/target | adapt | Index current canonical project documentation. |
| `package.json` | source/target | adapt | Provide actual static-site and validation entrypoints. |
| `pnpm-workspace.example.yaml` | source/target | delete | The hub uses one Bun package, not alternative workspaces. |
| `renovate.json` | source/target | adopt | Retain dependency update cooldown policy. |
| `scripts/` | source/target | adapt | Keep stable checks; add static build, local preview, initialization, validation, and GitHub setup. |
| `skills/` | source/target | delete | Template-specific migration/service skills do not fit this project. |
| `stacks/` | source/target | delete | Individual projects choose stacks when requirements justify them. |
| `.context/` | planned local | skip | Ignore workspace-local scratch; never publish it. |
| `LICENSES/` | planned | adopt | Preserve the inherited GPL license and reusable AGPL text. |
| `NOTICE.md` | planned | adopt | Explain licensing and origin of retained devkit material. |
| `projects.json` | planned | adopt | Canonical registered-project membership and status. |
| `candidates.json` | planned | adopt | Curated candidate presentation and canonical issue links, without copied issue status. |
| `content/` | planned | adopt | Website prose and registered-project detail documents. |
| `site/` | planned | adopt | Static templates, styles, and original vector identity. |
| `devkit/` | planned | adopt | Versioned stack-neutral project starter and portable conformance checker. |
| `tests/` | planned | adopt | Verify registry rules, generated site, initializer, and conformance failures. |
| `tsconfig.json` | planned | adopt | Typecheck the hub build and validation tools. |
| `dist/`, `node_modules/` | generated | skip | Rebuild locally or in CI; keep out of version control. |

All retained policy preferences are subordinate to the confirmed project decisions
in DECISIONS.md. This report authorizes no pilot implementation or hosted model work.
