import { resolve, sep } from "node:path";
import { basePath, build } from "./build";
import { previewPort } from "./ports";

const root = process.cwd();
const base = basePath(process.env.SITE_BASE_PATH);
const output = resolve(root, "dist");
let building: ReturnType<typeof build> | undefined;
async function rebuild() {
  building ??= build(root, base).finally(() => {
    building = undefined;
  });
  await building;
}
await rebuild();
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: previewPort(root),
  async fetch(request) {
    const path = decodeURIComponent(new URL(request.url).pathname);
    if (base && path === base) return Response.redirect(`${base}/`, 302);
    if (!path.startsWith(`${base}/`)) return new Response("Not found", { status: 404 });
    let local = path.slice(base.length + 1);
    if (!local || local.endsWith("/")) local += "index.html";
    const filePath = resolve(output, local);
    if (!filePath.startsWith(`${output}${sep}`)) return new Response("Forbidden", { status: 403 });
    await rebuild();
    const file = Bun.file(filePath);
    if (!(await file.exists()))
      return new Response(Bun.file(resolve(output, "404.html")), { status: 404 });
    return new Response(file, { headers: { "Cache-Control": "no-store" } });
  },
});
console.log(`Genairosity preview: http://127.0.0.1:${server.port}${base}/`);
