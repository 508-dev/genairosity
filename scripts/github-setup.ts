import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type Candidate, HUB, parseCandidates } from "./data";

const repository = "508-dev/genairosity";
export const labels = [
  ["nomination", "D6EF48", "A suggested software workflow to investigate"],
  ["nomination:proposed", "D5D6C9", "Awaiting research or consideration"],
  ["nomination:researching", "BFD4F2", "Investigation is underway"],
  ["nomination:accepted", "B4D88A", "Maintainer accepted; registration is a separate step"],
  ["nomination:declined", "E5BEAE", "Not being pursued here; see the recorded decision"],
  ["work", "D4C5F2", "Bounded task with prerequisites, acceptance, and verification"],
] as const;
export function nominationBody(candidate: Candidate): string {
  return `<!-- genairosity-candidate:${candidate.id} -->
## Initial investigation: ${candidate.name}

${candidate.summary}

This is one of the founding maintainer's initial, unranked research interests.
It is not an accepted implementation scope, a delivery commitment, or a claim that
existing free software is inadequate. No agent or model work starts from this issue.

## Starting question

${candidate.question}

## Research to do

- Identify a specific user and an everyday workflow worth improving.
- Survey existing FOSS, including whether an upstream contribution is the better path.
- Find public documentation or lawfully observable behavior and record provenance/terms.
- Describe a bounded possible scope, platforms, constraints, and unresolved questions.
- Bring findings back here for a maintainer decision based on evidence, interest, and time.

## Evidence and unknowns

No feasibility assessment or source review has been completed for this nomination.
Contributors should add source links, access dates, observations, and uncertainties.
Do not upload proprietary source/assets or uncertain material.

## Acceptance of this research task

A reviewer can follow the evidence, understand the existing FOSS landscape, and
see a proposed next step or an explicit recommendation to contribute upstream.
Acceptance or decline is a maintainer decision; registration requires a separate
conforming repository entry in the hub.

Comment before starting to coordinate. Work manually or initiate your chosen harness
locally. See [CONTRIBUTING.md](${HUB}/blob/main/CONTRIBUTING.md) and
[the research policy](${HUB}/blob/main/docs/clean-room.md).
`;
}
function gh(args: string[]): string {
  const result = spawnSync("gh", args, { encoding: "utf8" });
  if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stderr);
  return result.stdout.trim();
}
export function existingCandidateUrl(
  issues: { body: string; html_url: string; pull_request?: unknown }[],
  id: string,
): string | undefined {
  const matches = issues.filter(
    (issue) => !issue.pull_request && issue.body?.includes(`<!-- genairosity-candidate:${id} -->`),
  );
  if (matches.length > 1)
    throw new Error(`Duplicate nomination markers for ${id}; reconcile manually`);
  return matches[0]?.html_url;
}
if (import.meta.main) {
  const candidates = parseCandidates(JSON.parse(readFileSync("candidates.json", "utf8")));
  const apply = process.argv.includes("--apply");
  if (!apply) {
    console.log(`Target: ${repository}\nLabels: ${labels.map(([name]) => name).join(", ")}\n`);
    for (const candidate of candidates) console.log(nominationBody(candidate));
    console.log(
      "Preview only. Pass --apply to create missing nominations and update candidate URLs.",
    );
  } else {
    const pages = JSON.parse(
      gh(["api", "--paginate", "--slurp", `repos/${repository}/issues?state=all&per_page=100`]),
    ) as { body: string; html_url: string; pull_request?: unknown }[][];
    const issues = pages.flat();
    // Resolve all duplicate markers before any mutation.
    const existing = new Map(
      candidates.map((candidate) => [candidate.id, existingCandidateUrl(issues, candidate.id)]),
    );
    for (const candidate of candidates) {
      if (candidate.issueUrl && candidate.issueUrl !== existing.get(candidate.id))
        throw new Error(`Issue URL/marker mismatch for ${candidate.id}; review before applying`);
    }
    for (const [name, color, description] of labels)
      gh([
        "label",
        "create",
        name,
        "--repo",
        repository,
        "--color",
        color,
        "--description",
        description,
        "--force",
      ]);
    const scratch = mkdtempSync(join(tmpdir(), "genairosity-issues-"));
    try {
      for (const candidate of candidates) {
        let url = existing.get(candidate.id);
        if (!url) {
          const bodyFile = join(scratch, `${candidate.id}.md`);
          writeFileSync(bodyFile, nominationBody(candidate));
          url = gh([
            "issue",
            "create",
            "--repo",
            repository,
            "--title",
            `Investigate: ${candidate.name}`,
            "--body-file",
            bodyFile,
            "--label",
            "nomination",
            "--label",
            "nomination:proposed",
          ]);
        }
        candidate.issueUrl = url;
        // Persist each success so a partial run is recoverable without creating duplicates.
        writeFileSync(
          "candidates.json",
          `${JSON.stringify({ schemaVersion: 1, candidates }, null, 2)}\n`,
        );
        console.log(`${candidate.name}: ${url}`);
      }
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  }
}
