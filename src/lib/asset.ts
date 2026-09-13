/** Prefix a public path with Vite `BASE_URL` (needed on GitHub Pages). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\//, "");
  return base.endsWith("/") ? `${base}${clean}` : `${base}/${clean}`;
}

/** Map a chapter sourcePath to the live sc-best-practices.org webpage. */
export function bookPageUrl(sourcePath: string): string {
  const trimmed = sourcePath
    .replace(/\.ipynb$/i, "")
    .replace(/\.md$/i, "")
    .replace(/\.html$/i, "")
    .replace(/_/g, "-");
  if (!trimmed || trimmed === "preamble") {
    return "https://www.sc-best-practices.org/";
  }
  return `https://www.sc-best-practices.org/${trimmed}/`;
}
