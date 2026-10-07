import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { type Candidate, HUB, loadData, type Project } from "./data";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
export function basePath(value = ""): string {
  const base = value.replace(/\/$/, "");
  if (base !== "" && !/^\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+$/.test(base))
    throw new Error("SITE_BASE_PATH must be empty or a safe URL path such as /genairosity");
  return base;
}
// Bun 1.4.0 supplies this API; the older, pinned type package does not declare it.
const markdown = (
  Bun as typeof Bun & {
    markdown: { html(source: string, options: Record<string, boolean>): string };
  }
).markdown;
export async function renderMarkdown(source: string): Promise<string> {
  const html = markdown.html(source, { noHtmlBlocks: true, noHtmlSpans: true, tagFilter: true });
  return new HTMLRewriter()
    .on("a", {
      element(element) {
        const href = element.getAttribute("href") ?? "";
        if (!/^(?:https?:\/\/|mailto:|#|\.?\.?\/)/i.test(href)) element.removeAttribute("href");
      },
    })
    .on("img", {
      element(element) {
        element.remove();
      },
    })
    .transform(new Response(html))
    .text();
}
function layout(title: string, description: string, body: string, base: string): string {
  const e = escapeHtml;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(description)}">
<meta name="theme-color" content="#f5f3e9"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="website">
<link rel="icon" href="${base}/assets/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}/assets/style.css"></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header wrap">
<a class="wordmark" href="${base}/" aria-label="Genairosity home"><img src="${base}/assets/mark.svg" width="31" height="31" alt="">genairosity<span>.</span></a>
<nav aria-label="Main navigation"><a href="${base}/#candidates">Investigations</a><a href="${base}/principles/">Principles</a><a href="${base}/contribute/">Contribute <span aria-hidden="true">↗</span></a></nav></header>
${body}
<footer class="site-footer wrap"><div><a class="wordmark" href="${base}/">genairosity.</a><p>Useful software belongs to everyone.</p></div><div class="footer-links"><a href="https://508.dev">An initiative from 508.dev ↗</a><a href="${HUB}">Source &amp; conversations ↗</a><a href="${HUB}/blob/main/NOTICE.md">Licensing &amp; provenance ↗</a></div><p class="fine-print">Free and open source. No warranty. Reference product names identify research subjects; no affiliation or endorsement is implied.</p></footer></body></html>`;
}
function candidateCard(candidate: Candidate, index: number): string {
  const e = escapeHtml;
  return `<article class="candidate" id="candidate-${e(candidate.id)}"><span class="candidate-number">${String(index + 1).padStart(2, "0")}</span><div class="candidate-title"><p class="eyebrow">${e(candidate.category)}</p><h3>${e(candidate.name)}</h3></div><div class="candidate-copy"><p>${e(candidate.summary)}</p><p class="research-question">${e(candidate.question)}</p></div><a class="candidate-link" href="${e(candidate.issueUrl ?? `${HUB}/issues?q=is%3Aissue+label%3Anomination`)}" aria-label="${e(`Discuss ${candidate.name} investigation`)}">Join the investigation <span aria-hidden="true">↗</span></a></article>`;
}
function projectCard(project: Project, base: string): string {
  return `<article class="project-card"><span class="status">${escapeHtml(project.status)}</span><h3><a href="${base}/projects/${project.id}/">${escapeHtml(project.name)}</a></h3><p>${escapeHtml(project.summary)}</p><a href="${escapeHtml(project.repository)}">Repository ↗</a></article>`;
}
export async function build(root: string, prefix = "", output = join(root, "dist")) {
  const base = basePath(prefix);
  const { projects, candidates } = loadData(root);
  let home = await readFile(join(root, "site/home.html"), "utf8");
  const replacements: Record<string, string> = {
    BASE: base,
    CANDIDATE_COUNT: String(candidates.length).padStart(2, "0"),
    PROJECT_COUNT: String(projects.length).padStart(2, "0"),
    CANDIDATES: candidates.map(candidateCard).join("\n"),
    PROJECTS: projects.length
      ? `<div class="project-grid">${projects.map((project) => projectCard(project, base)).join("")}</div>`
      : '<div class="empty-projects"><span class="empty-symbol" aria-hidden="true">＋</span><div><h3>The first chapter is research.</h3><p>No projects are registered yet. We’re building the foundation: a clear process, a reusable devkit, and good questions to start with.</p></div><a class="text-link" href="https://github.com/508-dev/genairosity/blob/main/docs/project-setup.md">Explore the project devkit ↗</a></div>',
  };
  home = home.replace(/\{\{\s*([A-Z_]+)\s*\}\}/g, (_, key: string) => {
    const value = replacements[key];
    if (value === undefined) throw new Error(`Unknown site template variable: ${key}`);
    return value;
  });
  const pages: Record<string, string> = {
    "index.html": layout(
      "Genairosity — Useful software. Freely yours.",
      "A software-freedom initiative from 508.dev. Research useful workflows, build free alternatives, and contribute with your tools of choice.",
      home,
      base,
    ),
  };
  for (const [slug, title] of [
    ["contribute", "Contribute"],
    ["principles", "Our principles"],
  ]) {
    const prose = await renderMarkdown(await readFile(join(root, "content", `${slug}.md`), "utf8"));
    pages[`${slug}/index.html`] = layout(
      `${title} — Genairosity`,
      `${title}: useful software belongs to everyone.`,
      `<main id="main" class="document wrap"><a class="back-link" href="${base}/">← Back to the initiative</a><article class="prose">${prose}</article></main>`,
      base,
    );
  }
  for (const project of projects) {
    const prose = await renderMarkdown(
      await readFile(join(root, "content/projects", `${project.id}.md`), "utf8"),
    );
    const header = `<a class="back-link" href="${base}/#projects">← All projects</a><p class="eyebrow">${escapeHtml(project.status)} · Updated ${escapeHtml(project.updated)}</p>`;
    pages[`projects/${project.id}/index.html`] = layout(
      `${project.name} — Genairosity`,
      project.summary,
      `<main id="main" class="document wrap">${header}<article class="prose">${prose}</article><p><a class="button" href="${escapeHtml(project.repository)}">Open repository ↗</a></p></main>`,
      base,
    );
  }
  pages["404.html"] = layout(
    "Page not found — Genairosity",
    "This page could not be found.",
    `<main id="main" class="document wrap"><h1>Nothing here. Yet.</h1><p>That page may have moved.</p><a class="button" href="${base}/">Back to Genairosity →</a></main>`,
    base,
  );
  await rm(output, { recursive: true, force: true });
  for (const [path, html] of Object.entries(pages)) {
    await mkdir(dirname(join(output, path)), { recursive: true });
    await Bun.write(join(output, path), html);
  }
  await mkdir(join(output, "assets"), { recursive: true });
  for (const name of ["style.css", "mark.svg", "freedom.svg"])
    await cp(join(root, "site", name), join(output, "assets", name));
  await Bun.write(join(output, ".nojekyll"), "");
  return {
    output,
    pages: Object.keys(pages),
    projects: projects.length,
    candidates: candidates.length,
  };
}
if (import.meta.main) {
  const result = await build(process.cwd(), process.env.SITE_BASE_PATH);
  console.log(`Built ${result.pages.length} pages in ${result.output}`);
}
