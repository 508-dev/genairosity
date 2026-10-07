# Repository inventory

| Path | Purpose |
| --- | --- |
| `README.md`, `CONTRIBUTING.md`, `DECISIONS.md` | Mission, contribution contract, and confirmed policy |
| `AGENTS.md`, `CLAUDE.md`, `llms.txt` | Harness-neutral agent entrypoints |
| `projects.json` | Canonical registered membership, links, and status |
| `candidates.json` | Curated shortlist and canonical nomination links |
| `content/` | Public prose and project detail Markdown |
| `site/` | Static site template, CSS, original vector assets |
| `scripts/` | Build, preview, checks, initializer, and maintainer setup |
| `devkit/` | Canonical versioned project starter and portable conformance checker |
| `tests/` | Behavioral coverage of data, site, initializer, and conformance |
| `.github/` | Issue forms, PR template, CI, Pages publishing |
| `docs/` | Governance, clean-room process, setup, development, deployment, Overseer |
| `LICENSE`, `LICENSES/`, `NOTICE.md` | Licensing and inherited provenance |
| `genairosity.md` | Preserved original proposal |
| `package.json`, `bun.lock`, `bunfig.toml`, `biome.json`, `tsconfig.json`, `renovate.json` | Hub tooling and dependency policy |
| `.env.example`, `.editorconfig`, `.gitignore`, `.worktreeinclude` | Local environment and repository hygiene |
| `.context/`, `dist/`, `node_modules/` | Ignored scratch, generated output, and dependencies |

The foundation cleanup decisions are recorded in [selection-report](docs/selection-report.md).
Before future template-wide cleanup, record adopt/adapt/skip/delete/defer decisions
for every affected top-level path. Do not copy this hub wholesale into a project;
use the initializer and `devkit/template`.
