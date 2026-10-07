#!/usr/bin/env python3
"""Generate a stack-neutral project in a new directory; never publish or overwrite."""
import argparse
import importlib.util
import json
from pathlib import Path
import shutil
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "devkit/template"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--id", required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--repository", required=True, help="https://github.com/OWNER/REPO")
    parser.add_argument("--maintainer", required=True, help="Accountable GitHub maintainer")
    args = parser.parse_args()
    destination = args.destination.absolute()
    if destination.exists() or destination.is_symlink():
        parser.error("Destination must not exist; existing directories are never overwritten")
    if not destination.parent.is_dir():
        parser.error("Destination parent must already exist")
    version = (ROOT / "devkit/VERSION").read_text().strip()
    metadata = {
        "schemaVersion": 1, "devkitVersion": version, "id": args.id,
        "name": args.name, "summary": args.summary, "repository": args.repository,
        "maintainer": args.maintainer, "license": "AGPL-3.0-or-later",
        "licenseException": None, "specificationApproval": None,
    }
    with tempfile.TemporaryDirectory(prefix=".genairosity-", dir=destination.parent) as temporary:
        staging = Path(temporary) / "project"
        shutil.copytree(TEMPLATE, staging, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
        shutil.copyfile(ROOT / "LICENSES/AGPL-3.0-or-later.txt", staging / "LICENSE")
        (staging / "genairosity.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
        (staging / "README.md").write_text(
            f"# {args.name}\n\n{args.summary}\n\n"
            f"Repository: {args.repository}\n\nMaintainer: {args.maintainer}\n\n"
            "Research-stage project. Registration in the Genairosity hub requires maintainer approval. "
            "No implementation or release is promised.\n\n"
            "## Start here\n\n"
            "1. Read [the charter](docs/charter.md) and [contribution process](CONTRIBUTING.md).\n"
            "2. Record sources in [research](docs/research.md).\n"
            "3. Obtain approval of a functional [specification](docs/specification.md) before implementation.\n"
            "4. Choose a bounded issue; work manually or with any locally initiated harness.\n"
            "5. Run `python3 scripts/check-project.py` and the checks in [verification](docs/verification.md).\n\n"
            "## License\n\nAGPL-3.0-or-later; see [LICENSE](LICENSE). No warranty.\n",
            encoding="utf-8",
        )
        spec = importlib.util.spec_from_file_location("project_check", TEMPLATE / "scripts/check-project.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        errors = module.check(staging)
        if errors:
            parser.error("; ".join(errors))
        # Reserve the destination after validation. copytree never merges with an existing tree.
        shutil.copytree(staging, destination)
    print(f"Created {destination} (devkit {version}).")
    print("Complete the charter, inspect the files, and follow docs/project-setup.md in the hub to publish and register.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
