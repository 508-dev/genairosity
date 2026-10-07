#!/usr/bin/env python3
"""Check the portable Genairosity contract, without running project code."""
import argparse
import datetime
import json
from pathlib import Path
import re
import sys

REQUIRED = (
    "README.md", "AGENTS.md", "CONTRIBUTING.md", "LICENSE", "docs/charter.md",
    "docs/research.md", "docs/specification.md", "docs/decisions.md",
    "docs/verification.md", ".github/ISSUE_TEMPLATE/work.yml",
    ".github/PULL_REQUEST_TEMPLATE.md",
)
SLUG = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
REPO = re.compile(r"https://github\.com/[A-Za-z0-9-]+/[A-Za-z0-9_.-]+")


def check(root):
    root = Path(root).resolve()
    errors = []
    for name in (*REQUIRED, "genairosity.json"):
        path = root / name
        if path.is_symlink() or not path.is_file():
            errors.append(f"Missing regular file: {name}")
        elif root not in path.resolve().parents:
            errors.append(f"File escapes the project: {name}")
        elif not path.read_text(encoding="utf-8").strip():
            errors.append(f"Empty file: {name}")
    if errors:
        return errors
    try:
        data = json.loads((root / "genairosity.json").read_text(encoding="utf-8"))
    except (ValueError, OSError) as error:
        return [f"Invalid genairosity.json: {error}"]
    if not isinstance(data, dict):
        return ["genairosity.json must be an object"]
    expected = {"schemaVersion", "devkitVersion", "id", "name", "summary", "repository", "maintainer", "license", "licenseException", "specificationApproval"}
    if set(data) != expected:
        errors.append("Metadata fields must be: " + ", ".join(sorted(expected)))
    if type(data.get("schemaVersion")) is not int or data["schemaVersion"] != 1:
        errors.append("Unsupported schemaVersion (expected 1)")
    for key in ("devkitVersion", "id", "name", "summary", "repository", "maintainer", "license"):
        value = data.get(key)
        if not isinstance(value, str) or not value.strip() or value != value.strip() or any(ord(c) < 32 for c in value):
            errors.append(f"{key} must be nonempty single-line text")
    if not SLUG.fullmatch(str(data.get("id", ""))):
        errors.append("id must be a lowercase hyphenated slug")
    if not re.fullmatch(r"\d+\.\d+\.\d+", str(data.get("devkitVersion", ""))):
        errors.append("devkitVersion must have the form X.Y.Z")
    if not REPO.fullmatch(str(data.get("repository", ""))):
        errors.append("repository must be a GitHub repository URL")
    exception = data.get("licenseException")
    if data.get("license") != "AGPL-3.0-or-later":
        if not isinstance(exception, str) or not exception.startswith("https://github.com/"):
            errors.append("A different FOSS license requires licenseException linking to maintainer approval")
    elif exception is not None:
        errors.append("licenseException must be null for the default license")
    approval = data.get("specificationApproval")
    if approval is not None:
        if not isinstance(approval, dict) or set(approval) != {"reviewer", "date", "url", "commit"}:
            errors.append("specificationApproval requires reviewer, date, url, and commit")
        else:
            if not isinstance(approval["reviewer"], str) or not approval["reviewer"].strip():
                errors.append("Specification reviewer is required")
            if not re.fullmatch(r"[a-f0-9]{40}", str(approval["commit"])):
                errors.append("Specification approval must identify a full commit SHA")
            if not re.fullmatch(r"https://github\.com/[A-Za-z0-9-]+/[A-Za-z0-9_.-]+/(?:issues|pull)/[1-9]\d*(?:#[A-Za-z0-9_-]+)?", str(approval["url"])):
                errors.append("Specification approval must link to a GitHub review or issue")
            try:
                if not isinstance(approval["date"], str) or datetime.date.fromisoformat(approval["date"]).isoformat() != approval["date"]:
                    raise ValueError()
            except (ValueError, TypeError):
                errors.append("Specification approval date must be YYYY-MM-DD")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project", nargs="?", default=str(Path(__file__).resolve().parents[1]))
    args = parser.parse_args()
    try:
        errors = check(args.project)
    except (OSError, UnicodeError) as error:
        errors = [str(error)]
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print("Project structure is valid. Maintainer review of substance and licensing is still required.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
