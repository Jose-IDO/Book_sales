/**
 * Builds a static export into docs/ for "Deploy from a branch → /docs" on GitHub Pages.
 * Next.js writes to out/ first; we copy to docs/ because GitHub only supports / or /docs.
 *
 * Usage: npm run build:pages
 * Env:   GITHUB_PAGES_BASE_PATH=YourRepoName (default: Book_sales)
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const basePath = process.env.GITHUB_PAGES_BASE_PATH?.trim() || "Book_sales";

const apiPath = path.join(root, "app", "api");
const apiBackup = path.join(root, ".gh-pages-api-backup");
const mwPath = path.join(root, "middleware.ts");
const mwBak = path.join(root, "middleware.ts.ghpages-bak");

function run(shellCmd, env) {
  execSync(shellCmd, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: true,
  });
}

function main() {
  let restored = true;
  try {
    if (fs.existsSync(apiPath)) {
      fs.rmSync(apiBackup, { recursive: true, force: true });
      fs.cpSync(apiPath, apiBackup, { recursive: true });
      fs.rmSync(apiPath, { recursive: true, force: true });
    }
    if (fs.existsSync(mwPath)) {
      fs.renameSync(mwPath, mwBak);
    }

    const env = {
      STATIC_EXPORT: "1",
      NEXT_PUBLIC_DEPLOY_MODE: "static",
      GITHUB_PAGES_BASE_PATH: basePath,
    };

    try {
      run("npx prisma generate", env);
    } catch {
      console.warn(
        "prisma generate failed (often a Windows file lock). Continuing if @prisma/client already exists.\n"
      );
    }
    const nextCache = path.join(root, ".next");
    if (fs.existsSync(nextCache)) {
      if (os.platform() === "win32") {
        execSync(`rd /s /q "${nextCache}"`, { cwd: root, stdio: "inherit", shell: true });
      } else {
        fs.rmSync(nextCache, { recursive: true, force: true });
      }
    }
    run("npx next build", env);

    const outDir = path.join(root, "out");
    const docsDir = path.join(root, "docs");
    if (!fs.existsSync(outDir)) {
      throw new Error("out/ not found after build");
    }

    fs.rmSync(docsDir, { recursive: true, force: true });
    fs.cpSync(outDir, docsDir, { recursive: true });
    fs.writeFileSync(path.join(docsDir, ".nojekyll"), "");

    const distDir = path.join(root, "dist");
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.cpSync(docsDir, distDir, { recursive: true });

    console.log(
      `\nDone. Static files:\n` +
        `  docs/  → commit and use GitHub Pages → Deploy from branch → /docs\n` +
        `  dist/  → same files locally (gitignored); use if you prefer that name\n` +
        `GitHub: Settings → Pages → Build: Deploy from a branch → main → /docs\n` +
        `Site URL: https://<user>.github.io/${basePath}/\n`
    );
  } finally {
    if (fs.existsSync(apiBackup)) {
      if (fs.existsSync(apiPath)) fs.rmSync(apiPath, { recursive: true, force: true });
      fs.cpSync(apiBackup, apiPath, { recursive: true });
      fs.rmSync(apiBackup, { recursive: true, force: true });
    }
    if (fs.existsSync(mwBak)) {
      if (fs.existsSync(mwPath)) fs.unlinkSync(mwPath);
      fs.renameSync(mwBak, mwPath);
    }
  }
}

try {
  main();
} catch (e) {
  console.error(e);
  process.exit(1);
}
