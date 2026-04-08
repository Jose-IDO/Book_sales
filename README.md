This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

- **[Firebase setup (login & profiles)](docs/FIREBASE_SETUP.md)** — step-by-step Firebase Console configuration, rules, env vars, and integration notes.

## GitHub Pages (static site from `/docs`)

GitHub Pages **cannot** run this app’s API or database. It only serves **static HTML/JS**. This repo builds that static site into **`docs/`** (and a local-only **`dist/`** copy) so you can use **Deploy from a branch**—no GitHub Actions required.

### Why `docs/` and not `dist/`?

GitHub’s UI only lets you publish from the **repository root** or from a **`/docs`** folder on a branch. There is no “use `/dist`” option. Next.js writes exports to **`out/`**; the script copies that into **`docs/`** for you. **`dist/`** is the same output on your machine (gitignored) if you prefer that name locally.

### Steps

1. **Build the static files** (from the project root):

   ```bash
   npm run build:pages
   ```

   Optional: if your GitHub repo name is not `Book_sales`, set the URL segment GitHub uses:

   ```bash
   set GITHUB_PAGES_BASE_PATH=YourRepoName
   npm run build:pages
   ```

   (PowerShell: `$env:GITHUB_PAGES_BASE_PATH="YourRepoName"`)

2. **Commit the `docs/` folder** and push to `main`:

   ```bash
   git add docs && git commit -m "Update GitHub Pages static build" && git push
   ```

3. **Repository → Settings → Pages**

   - **Build and deployment → Source:** choose **Deploy from a branch** (not GitHub Actions).
   - **Branch:** `main`, **Folder:** `/docs`, then Save.

4. Open `https://<your-username>.github.io/<repo>/` (e.g. `https://jose-ido.github.io/Book_sales/`).

Static reserve flow uses **mailto**; set **`NEXT_PUBLIC_RESERVATION_EMAIL`** in your environment when running `build:pages` if you want the draft pre-addressed (or add it to a `.env` file that Next loads during build).

For **file uploads**, **admin**, and **server email**, deploy the full app to [Vercel](https://vercel.com/new) or another Node host.

## Deploy on Vercel (full app)

Connect this repo to Vercel for API routes, Prisma/SQLite (or Postgres), and admin. See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
