import type { NextConfig } from "next";
import path from "path";

const isStaticExport = process.env.STATIC_EXPORT === "1";

/** GitHub project pages: /RepoName — set GITHUB_REPOSITORY on Actions or GITHUB_PAGES_BASE_PATH locally. */
function pagesBasePath(): string | undefined {
  if (!isStaticExport) return undefined;
  const explicit = process.env.GITHUB_PAGES_BASE_PATH?.trim();
  if (explicit) {
    const p = explicit.startsWith("/") ? explicit : `/${explicit}`;
    return p === "/" ? undefined : p;
  }
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (repo) return `/${repo}`;
  return "/Book_sales";
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: pagesBasePath(),
      }
    : {}),
};

export default nextConfig;
