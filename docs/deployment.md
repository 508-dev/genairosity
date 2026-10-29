# GitHub Pages publishing

Production: https://genairosity.com/

The `Checks and Pages` GitHub Actions workflow checks every pull request. Pushes to
`main` and manual dispatches from `main` run the same checks, build the static site,
and deploy the Pages artifact. Only the deployment job has Pages write/OIDC access.
No model calls, provider credentials, or application server are involved.

## Custom domain and link prefix

`site/CNAME` declares the custom domain and is the single source of truth for how
links are written. While it exists, the site is served at the domain root: the
workflow builds with an empty `SITE_BASE_PATH`, every generated link and asset URL is
root-relative, and the build copies `CNAME` into the artifact so an Actions deployment
does not drop the domain. The build refuses a non-empty `SITE_BASE_PATH` while a
`CNAME` is present, because that combination publishes asset URLs that 404.

Moving back to the `508-dev.github.io/genairosity/` project URL means deleting
`site/CNAME`; the workflow then restores the `/genairosity` repository prefix on its
own. Clearing the domain in Settings → Pages without deleting the file, or the
reverse, breaks one of the two.

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
styles/assets load at the domain root, and the five candidate links point
to real nomination issues. Check the site on desktop and a narrow viewport.
