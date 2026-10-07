# GitHub Pages publishing

Production: https://508-dev.github.io/genairosity/

The `Checks and Pages` GitHub Actions workflow checks every pull request. Pushes to
`main` and manual dispatches from `main` run the same checks, build the static site,
and deploy the Pages artifact. Only the deployment job has Pages write/OIDC access.
No model calls, provider credentials, or application server are involved.

## Initial setup (maintainer)

Review `scripts/github-setup.ts`, then run:

```sh
bun run github:setup
bun run github:setup -- --apply
```

The first command previews the exact labels and nomination bodies. `--apply` creates
or updates the known labels and creates missing initial nomination issues, then writes
their URLs into `candidates.json`. It matches candidates by a stable body marker and
checks for duplicates. It does not alter existing nomination decisions or issue bodies.
The script requires authenticated `gh` with access to this public repository.

Enable Pages with GitHub Actions as the build source in Settings → Pages. The
maintainer can equivalently use:

```sh
gh api --method POST repos/508-dev/genairosity/pages -f build_type=workflow
```

If Pages already exists, inspect it first and use its current configuration; do not
create a competing source. Commit the candidate URLs and push the validated changes
to `main`. Review Actions and the deployment URL. Repository or organization settings
may require approving Actions or the `github-pages` environment before deployment.
Enable private vulnerability reporting in Settings → Security for the SECURITY.md link.

## Updates and rollback

Registry, prose, and code changes publish after merge and successful checks. A failed
build leaves the previous deployed artifact live. Revert the offending commit through
a reviewed change and let Pages rebuild to roll back. Do not edit generated output.
Changing a project status requires a registry PR, not an issue label alone.

## Publication verification

Confirm the workflow succeeds, the public homepage and contribution page return 200,
styles/assets load under the repository prefix, and the five candidate links point
to real nomination issues. Check the site on desktop and a narrow viewport.
