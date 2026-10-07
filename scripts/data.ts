import { readFileSync } from "node:fs";
import { join } from "node:path";

export const HUB = "https://github.com/508-dev/genairosity";
export const statuses = [
  "research",
  "planning",
  "implementation",
  "usable",
  "paused",
  "archived",
] as const;
export type Project = {
  id: string;
  name: string;
  summary: string;
  repository: string;
  status: (typeof statuses)[number];
  license: string;
  maintainer: string;
  nominationUrl: string;
  updated: string;
};
export type Candidate = {
  id: string;
  name: string;
  category: string;
  summary: string;
  question: string;
  issueUrl: string | null;
};
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const repository = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_.-]+$/;
const nomination = /^https:\/\/github\.com\/508-dev\/genairosity\/issues\/[1-9]\d*$/;

function object(value: unknown, context: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${context}: expected an object`);
  }
  return value as Record<string, unknown>;
}
function text(value: unknown, field: string, max = 300): asserts value is string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value !== value.trim() ||
    value.length > max ||
    [...value].some((char) => char.charCodeAt(0) < 32)
  ) {
    throw new Error(`${field}: expected nonempty text (maximum ${max} characters)`);
  }
}
function collection(value: unknown, key: string): unknown[] {
  const root = object(value, key);
  if (root.schemaVersion !== 1 || !Array.isArray(root[key])) {
    throw new Error(`${key}: expected schemaVersion 1 and an array`);
  }
  if (Object.keys(root).some((field) => !["schemaVersion", key].includes(field))) {
    throw new Error(`${key}: unexpected root field`);
  }
  return root[key];
}
function fields(row: Record<string, unknown>, expected: string[], context: string) {
  if (
    Object.keys(row).some((key) => !expected.includes(key)) ||
    expected.some((key) => !(key in row))
  ) {
    throw new Error(`${context}: fields must be ${expected.join(", ")}`);
  }
}
function identity(row: Record<string, unknown>, seen: Set<string>) {
  text(row.id, "id", 80);
  if (!slug.test(row.id) || seen.has(row.id)) throw new Error(`Invalid or duplicate id: ${row.id}`);
  seen.add(row.id);
  text(row.name, "name", 100);
  text(row.summary, "summary");
}
export function parseProjects(value: unknown): Project[] {
  const ids = new Set<string>();
  const repositories = new Set<string>();
  return collection(value, "projects").map((item) => {
    const row = object(item, "project");
    fields(
      row,
      [
        "id",
        "name",
        "summary",
        "repository",
        "status",
        "license",
        "maintainer",
        "nominationUrl",
        "updated",
      ],
      "project",
    );
    identity(row, ids);
    text(row.repository, "repository");
    if (
      !repository.test(row.repository) ||
      repositories.has(row.repository.toLowerCase()) ||
      row.repository.toLowerCase() === HUB.toLowerCase()
    ) {
      throw new Error(`Invalid or duplicate project repository: ${row.repository}`);
    }
    repositories.add(row.repository.toLowerCase());
    if (!statuses.includes(row.status as Project["status"]))
      throw new Error(`Invalid project status: ${row.status}`);
    text(row.license, "license", 100);
    text(row.maintainer, "maintainer", 100);
    text(row.nominationUrl, "nominationUrl");
    if (!nomination.test(row.nominationUrl))
      throw new Error("nominationUrl must link to a hub issue");
    text(row.updated, "updated", 10);
    const date = new Date(`${row.updated}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(row.updated) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== row.updated
    ) {
      throw new Error("updated must be a real YYYY-MM-DD date");
    }
    return row as Project;
  });
}
export function parseCandidates(value: unknown): Candidate[] {
  const ids = new Set<string>();
  const issues = new Set<string>();
  return collection(value, "candidates").map((item) => {
    const row = object(item, "candidate");
    fields(row, ["id", "name", "category", "summary", "question", "issueUrl"], "candidate");
    identity(row, ids);
    text(row.category, "category", 100);
    text(row.question, "question");
    if (row.issueUrl !== null) {
      text(row.issueUrl, "issueUrl");
      if (!nomination.test(row.issueUrl) || issues.has(row.issueUrl))
        throw new Error("Invalid or duplicate candidate issueUrl");
      issues.add(row.issueUrl);
    }
    return row as Candidate;
  });
}
export function loadData(root: string) {
  const projects = parseProjects(JSON.parse(readFileSync(join(root, "projects.json"), "utf8")));
  const candidates = parseCandidates(
    JSON.parse(readFileSync(join(root, "candidates.json"), "utf8")),
  );
  for (const project of projects) {
    const detail = readFileSync(join(root, "content/projects", `${project.id}.md`), "utf8");
    if (!detail.trim()) throw new Error(`Missing project detail: ${project.id}`);
  }
  return { projects, candidates };
}
