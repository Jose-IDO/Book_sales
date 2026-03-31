This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## GitHub Pages (static storefront)

GitHub Pages only serves static files. This repo includes [`.github/workflows/github-pages.yml`](.github/workflows/github-pages.yml), which publishes the catalog and banking details and opens a **mailto** draft for reservations (no file upload to your server).

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables**: add **`RESERVATION_EMAIL`** (the inbox that receives reservation emails).
3. Push to **`main`** (or **`master`**). The site will be at `https://<user>.github.io/<repo>/` (for example `https://jose-ido.github.io/Book_sales/`).

Re-seed the database so the book id matches the static catalog: `npm run db:seed` (uses id `book-sales-catalog` from `lib/catalog.ts`).

For **uploaded proof files**, **admin login**, and **email from the server**, deploy the full app to [Vercel](https://vercel.com/new) or another Node host instead.

## Deploy on Vercel (full app)

Connect this repo to Vercel for API routes, Prisma/SQLite (or move to Postgres), and admin. See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
