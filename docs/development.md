# Hub development

Requirements: Bun 1.4.0 (pinned in package.json and CI), Python 3.10+ for the portable
project tooling, and git. `gh` is needed only for maintainer GitHub setup operations.

```sh
bun install --frozen-lockfile
./scripts/dev.sh
./scripts/worktree-ports.sh env
./scripts/check-all.sh
```

The preview binds to loopback and uses a stable checkout-specific port. Set `PORT`
to override it. Bun loads local `.env`; `.env.example` documents optional configuration.
The preview rebuilds on requests so JSON, Markdown, and CSS edits appear on refresh;
Bun watch restarts it when imported code changes. It serves only generated output.

`bun run build` emits `dist/`. Set `SITE_BASE_PATH=/genairosity` to test project-site
URLs. The Pages workflow supplies the actual repository base path. No custom domain
is configured. `dist/`, dependencies, and `.context/` are ignored.

## Checks

- `bun run lint`: Biome checks the hub source, data, and CSS.
- `bun run typecheck`: TypeScript checks the build and tooling.
- `bun run test`: behavioral tests, including temporary generated projects and a
  portable Python checker. Tests do not call models or create GitHub resources.
- `bun run validate`: data schema, duplicate IDs/repositories, and project detail files.
- `bun run build`: static output and all public pages.

Run `bun run format` after editing formatted files. The full check wrapper executes
all of the above. Keep dependency releases at least seven days old and commit the
lockfile. CI installs with `bun install --frozen-lockfile`; all action references
are pinned to verified commits. Keep dependency update PRs bounded and review changes.

The site uses original local SVG/CSS, system fonts, and no third-party scripts,
analytics, visitor storage, or model APIs. Markdown raw HTML is disabled at rendering.
