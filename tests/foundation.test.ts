import { afterAll, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { basePath, build, escapeHtml, renderMarkdown } from "../scripts/build";
import { loadData, type Project, parseCandidates, parseProjects } from "../scripts/data";
import { existingCandidateUrl, nominationBody } from "../scripts/github-setup";
import { previewPort } from "../scripts/ports";

const root = dirname(import.meta.dir);
const scratch = mkdtempSync(join(tmpdir(), "genairosity-tests-"));
afterAll(() => rmSync(scratch, { recursive: true, force: true }));
const project: Project = {
  id: "fixture-project",
  name: "Fixture & Project",
  summary: "A bounded example workflow.",
  repository: "https://github.com/example/fixture-project",
  status: "research",
  license: "AGPL-3.0-or-later",
  maintainer: "example",
  nominationUrl: "https://github.com/508-dev/genairosity/issues/1",
  updated: "2026-10-07",
};
function registry(projects: unknown[] = [project]) {
  return { schemaVersion: 1, projects };
}
function python(args: string[]) {
  return spawnSync("python3", args, {
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
}
function initialize(destination: string, extra: string[] = []) {
  return python([
    join(root, "scripts/init-project.py"),
    destination,
    "--id",
    "fixture-project",
    "--name",
    "Fixture Project",
    "--summary",
    "A bounded research workflow.",
    "--repository",
    project.repository,
    "--maintainer",
    "example",
    ...extra,
  ]);
}
function metadata(path: string) {
  return JSON.parse(readFileSync(join(path, "genairosity.json"), "utf8"));
}
function writeMetadata(path: string, data: unknown) {
  writeFileSync(join(path, "genairosity.json"), JSON.stringify(data));
}

describe("canonical registry", () => {
  test("accepts an empty launch and a research-stage external repository", () => {
    expect(parseProjects(registry([]))).toEqual([]);
    expect(parseProjects(registry())).toEqual([project]);
  });
  test.each([
    { id: "../escape" },
    { status: "accepted" },
    { repository: "javascript:alert(1)" },
    { repository: "https://github.com/508-dev/genairosity" },
    { updated: "2026-02-30" },
    { updated: "bad-date" },
    { nominationUrl: "https://example.com/issues/1" },
    { summary: "" },
    { name: "bad\nname" },
    { statusOverride: "usable" },
  ])("rejects invalid metadata %j", (patch) => {
    expect(() => parseProjects(registry([{ ...project, ...patch }]))).toThrow();
  });
  test("rejects duplicate identity and case-insensitive repositories", () => {
    expect(() => parseProjects(registry([project, project]))).toThrow();
    expect(() =>
      parseProjects(
        registry([
          project,
          {
            ...project,
            id: "other",
            repository: project.repository
              .toUpperCase()
              .replace("HTTPS", "https")
              .replace("GITHUB.COM", "github.com"),
          },
        ]),
      ),
    ).toThrow();
  });
  test("requires a supported schema and actual project details", () => {
    expect(() => parseProjects({ schemaVersion: 2, projects: [] })).toThrow();
    const fixture = join(scratch, "missing-detail");
    mkdirSync(fixture);
    writeFileSync(join(fixture, "projects.json"), JSON.stringify(registry()));
    writeFileSync(join(fixture, "candidates.json"), '{"schemaVersion":1,"candidates":[]}');
    expect(() => loadData(fixture)).toThrow();
  });
  test("candidate presentation cannot create a second status authority", () => {
    const { candidates } = loadData(root);
    const first = candidates[0];
    expect(first).toBeDefined();
    expect(() =>
      parseCandidates({ schemaVersion: 1, candidates: [{ ...first, status: "accepted" }] }),
    ).toThrow();
    expect(() =>
      parseCandidates({
        schemaVersion: 1,
        candidates: [{ ...first, issueUrl: "https://evil.test/1" }],
      }),
    ).toThrow();
  });
});

describe("static publishing", () => {
  test("escapes data and disables executable Markdown", async () => {
    expect(escapeHtml('<a href="x">&')).toBe("&lt;a href=&quot;x&quot;&gt;&amp;");
    const rendered = await renderMarkdown(
      "<script>alert(1)</script>\n\n[x](javascript:alert)\n\n![tracking](https://example.com/track.png)",
    );
    expect(rendered).not.toContain("<script>");
    expect(rendered).not.toContain('href="javascript:');
    expect(rendered).not.toContain("<img");
  });
  test("validates Pages prefixes", () => {
    expect(basePath("/")).toBe("");
    expect(basePath("/genairosity/")).toBe("/genairosity");
    for (const path of ["//evil.test", "/../other", 'x"bad', "/with space"])
      expect(() => basePath(path)).toThrow();
  });
  test("builds the launch under a repository subpath with valid local targets", async () => {
    const output = join(scratch, "site");
    const result = await build(root, "/genairosity", output);
    expect(result.pages).toContain("contribute/index.html");
    const home = readFileSync(join(output, "index.html"), "utf8");
    expect(home).toContain("No projects are registered yet");
    expect(home).toContain("CapCut");
    expect(home).toContain("FileMaker");
    expect(home).not.toContain("{{");
    for (const page of result.pages) {
      const html = readFileSync(join(output, page), "utf8");
      for (const match of html.matchAll(/(?:href|src)="(\/genairosity\/[^"#]*)(?:#[^"]*)?"/g)) {
        const target = (match[1] ?? "").slice("/genairosity/".length);
        expect(
          existsSync(
            join(output, target === "" || target.endsWith("/") ? `${target}index.html` : target),
          ),
        ).toBe(true);
      }
    }
  });
  test("renders registered details and removes stale pages when membership changes", async () => {
    const fixture = join(scratch, "registered");
    mkdirSync(join(fixture, "content/projects"), { recursive: true });
    cpSync(join(root, "site"), join(fixture, "site"), { recursive: true });
    for (const name of ["contribute.md", "principles.md"])
      cpSync(join(root, "content", name), join(fixture, "content", name));
    writeFileSync(join(fixture, "projects.json"), JSON.stringify(registry()));
    writeFileSync(join(fixture, "candidates.json"), '{"schemaVersion":1,"candidates":[]}');
    writeFileSync(
      join(fixture, "content/projects/fixture-project.md"),
      "# Fixture Project\n\nThe declared scope.",
    );
    await build(fixture, "/hub");
    expect(readFileSync(join(fixture, "dist/index.html"), "utf8")).toContain(
      "Fixture &amp; Project",
    );
    expect(
      readFileSync(join(fixture, "dist/projects/fixture-project/index.html"), "utf8"),
    ).toContain("The declared scope");
    writeFileSync(join(fixture, "projects.json"), JSON.stringify(registry([])));
    await build(fixture);
    expect(existsSync(join(fixture, "dist/projects/fixture-project/index.html"))).toBe(false);
  });
  test("preview ports are deterministic and explicit values are bounded", () => {
    expect(previewPort(root, "4321")).toBe(4321);
    expect(previewPort(root, undefined)).toBe(previewPort(root, undefined));
    for (const value of ["0", "80", "65536", "wat"])
      expect(() => previewPort(root, value)).toThrow();
  });
});

describe("portable project devkit", () => {
  test("generates a self-contained research baseline with no stack or approval", () => {
    const target = join(scratch, "new-project");
    const result = initialize(target);
    expect(result.status).toBe(0);
    expect(metadata(target).specificationApproval).toBeNull();
    expect(metadata(target).devkitVersion).toBe(
      readFileSync(join(root, "devkit/VERSION"), "utf8").trim(),
    );
    expect(python([join(target, "scripts/check-project.py")]).status).toBe(0);
    expect(readFileSync(join(target, "LICENSE"), "utf8")).toContain(
      "GNU AFFERO GENERAL PUBLIC LICENSE",
    );
    expect(existsSync(join(target, "package.json"))).toBe(false);
  });
  test("refuses to overwrite an existing directory", () => {
    const target = join(scratch, "existing");
    mkdirSync(target);
    writeFileSync(join(target, "keep.txt"), "user content");
    expect(initialize(target).status).not.toBe(0);
    expect(readFileSync(join(target, "keep.txt"), "utf8")).toBe("user content");
    expect(existsSync(join(target, "genairosity.json"))).toBe(false);
  });
  test("rejects bad metadata without leaving a generated project", () => {
    const target = join(scratch, "bad-input");
    expect(initialize(target, ["--id", "../escape"]).status).not.toBe(0);
    expect(existsSync(target)).toBe(false);
  });
  test("rejects missing documents, malformed metadata, and unapproved license exceptions", () => {
    const target = join(scratch, "invalid-project");
    expect(initialize(target).status).toBe(0);
    const check = () => python([join(target, "scripts/check-project.py")]);
    const original = metadata(target);
    writeMetadata(target, { ...original, license: "MIT" });
    expect(check().status).not.toBe(0);
    writeMetadata(target, { ...original, specificationApproval: { reviewer: "agent" } });
    expect(check().status).not.toBe(0);
    writeMetadata(target, []);
    expect(check().status).not.toBe(0);
    writeMetadata(target, original);
    rmSync(join(target, "docs/research.md"));
    expect(check().status).not.toBe(0);
  });
  test("rejects symlinked required documents", () => {
    const target = join(scratch, "symlink-project");
    expect(initialize(target).status).toBe(0);
    rmSync(join(target, "README.md"));
    symlinkSync(join(root, "README.md"), join(target, "README.md"));
    expect(python([join(target, "scripts/check-project.py")]).status).not.toBe(0);
  });
});

describe("repeatable GitHub setup", () => {
  test("finds prior candidate nominations, including closed ones, and rejects duplicates", () => {
    const issue = {
      body: "<!-- genairosity-candidate:capcut -->",
      html_url: "https://github.com/508-dev/genairosity/issues/1",
    };
    expect(existingCandidateUrl([issue], "capcut")).toBe(issue.html_url);
    expect(existingCandidateUrl([{ ...issue, pull_request: {} }], "capcut")).toBeUndefined();
    expect(() => existingCandidateUrl([issue, issue], "capcut")).toThrow();
  });
  test("nomination bodies contain stable markers and clearly pending research", () => {
    for (const candidate of loadData(root).candidates) {
      const body = nominationBody(candidate);
      expect(body).toContain(`genairosity-candidate:${candidate.id}`);
      expect(body).toContain("No feasibility assessment");
      expect(body).toContain("No agent or model work starts");
    }
  });
});
