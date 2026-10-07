export function previewPort(root: string, configured = process.env.PORT): number {
  if (configured !== undefined) {
    const port = Number(configured);
    if (!/^\d+$/.test(configured) || !Number.isInteger(port) || port < 1024 || port > 65535) {
      throw new Error("PORT must be an integer from 1024 to 65535");
    }
    return port;
  }
  let hash = 0;
  for (const char of root) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return 4100 + (hash % 1000);
}
if (import.meta.main)
  console.log(
    `WEB_URL=http://127.0.0.1:${previewPort(process.cwd())}\nWEB_PORT=${previewPort(process.cwd())}`,
  );
