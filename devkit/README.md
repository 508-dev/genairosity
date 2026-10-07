# Universal Genairosity project baseline

`template/` plus the AGPL text and generated metadata is the canonical project starter.
Run `python3 scripts/init-project.py --help` from the hub. No third-party Python
packages, Bun, framework, model, or application stack is required in generated projects.
The version is in `VERSION`; generated metadata records it. See
[project setup](../docs/project-setup.md) for publication and registration.

The starter includes the charter, source/evidence register, specification and review
boundary, decisions, verification instructions, human/agent contribution guidance,
work issue/PR templates, and `scripts/check-project.py`. It starts in research with
no specification approval. The checker accepts an honest research baseline; it does
not certify completeness, legal compliance, or eligibility for registration.

## Optional stack choices

Choose the stack after scope is understood; Rust is preferred when suitable. Document
tradeoffs and real verification commands. Add ordinary CI once there is code to check.
Do not add cloud model execution. Keep server components FOSS and self-hostable.

Preserve supply-chain conventions in selected stacks:

- Bun: seven-day `minimumReleaseAge = 604800`, committed lockfile, frozen CI installs.
- pnpm: `minimumReleaseAge: 10080`, committed lockfile, frozen CI installs.
- uv: run `uv --no-config --version` before choosing optional `exclude-newer = "P7D"`;
  relative durations require 0.9.17+. Do not silently upgrade older clients.
- Bundler: check the version before adding `cooldown: 7`; it requires 4.0.13+.
  Pin the compatible Bundler version and use frozen/deployment installs in CI.
- Other stacks: document locked dependencies and update review policy where supported.

Never copy the hub's full source tree as an application scaffold. Upgrades are reviewed
project changes, not automatic replacement of downstream documents.
