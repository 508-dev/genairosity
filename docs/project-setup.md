# Establish and register a project

Acceptance of a nomination authorizes preparation, not automatic registration.
Use a new project name and identity; reference product names identify research targets.

## Generate locally

From a checkout of the hub, with Python 3.10+:

```sh
python3 scripts/init-project.py /tmp/my-project \
  --id my-project --name 'My Project' \
  --summary 'A specific user workflow to investigate.' \
  --repository https://github.com/508-dev/my-project --maintainer YOUR_GITHUB_LOGIN
python3 /tmp/my-project/scripts/check-project.py
```

The parent directory must exist and the destination must not. Initialization does
not invoke a model, install a stack, create a GitHub repository, or register anything.
The output includes metadata recording the devkit version. For an existing project,
copy/adapt the baseline in a reviewed branch rather than overwrite its files.

Complete the charter, link the accepted nomination, state the first research questions,
and choose verification appropriate to the current phase. Empty template sections
are prompts for work, not findings or approval. The checker tests structure only.

## Publish the reviewed repository

After you have reviewed its contents, from the new project directory:

```sh
git init -b main
git add .
git commit -m 'Establish project research baseline'
gh repo create OWNER/REPO --public --source=. --remote=origin --push
```

Use the repository URL recorded in metadata. These commands create a public repository;
run them only with the owner's authorization. A project may live under another owner
if the hub maintainer approves registration. Configure its security-reporting channel
and any ordinary CI appropriate to its chosen stack.

## Registration PR checklist

- Link the accepted nomination and its maintainer decision.
- Confirm the repository is public, accessible, and has an accountable maintainer.
- Run `python3 scripts/check-project.py` in the project; attach the result.
- Review the actual charter, scope, source policy, contribution contract, and verification
  instructions. Structural validity alone is insufficient.
- Confirm the license text matches metadata, retained notices are intact, and any
  different FOSS license has a linked maintainer approval in `licenseException`.
- For implementation status, review the exact approved specification and its evidence.
  Research/planning registration does not require approval or application code.
- Add the entry to the `projects` array in `projects.json` and write
  `content/projects/<id>.md`. See `docs/governance.md` for the fields/statuses.
- Run `./scripts/check-all.sh` in the hub. Have a maintainer review and merge the PR.

The merge activates membership and the Pages workflow publishes it. Close the
nomination with links after successful registration. A registry entry is a maintainer
commitment to the listed scope/status, not an assertion of complete product parity.

## Upgrade the baseline

There is no automatic synchronization. Compare the recorded devkit version with
`devkit/VERSION`, inspect relevant changes, and adopt them through a project PR.
Preserve project choices and update the version only when its contract has been reviewed.
