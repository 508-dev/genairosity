import { loadData } from "./data";

const { projects, candidates } = loadData(process.cwd());
console.log(
  `Validated ${projects.length} registered projects and ${candidates.length} candidates.`,
);
