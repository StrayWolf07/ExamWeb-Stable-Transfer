# Deploy to Netlify as **ssoftsols-examportal**

Your site will be available at: **https://ssoftsols-examportal.netlify.app**

## Prerequisites

1. **PostgreSQL database** — Netlify's serverless environment doesn't support SQLite. Use a free cloud database:
   - [Neon](https://neon.tech) — free Postgres
   - [Supabase](https://supabase.com) — free Postgres

2. **GitHub repo** — Your code is already at https://github.com/StrayWolf07/ExamWeb-Stable-Transfer

## Step 1: Create a PostgreSQL database (Neon example)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (e.g. `postgresql://user:pass@host/dbname?sslmode=require`)

## Step 2: Create the Netlify site

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub** and select `StrayWolf07/ExamWeb-Stable-Transfer`
4. **Site name:** enter `ssoftsols-examportal`
5. Build settings (from `netlify.toml` — should auto-detect):
   - Build command: `cp prisma/schema.postgres.prisma prisma/schema.prisma && prisma generate && prisma db push && next build`
   - Publish directory: (handled by Next.js plugin)

## Step 3: Set environment variables in Netlify

In **Site settings** → **Environment variables** → **Add variable**, add:

| Variable        | Value                          |
|-----------------|--------------------------------|
| `DATABASE_URL`  | Your Neon/Supabase connection string |
| `SESSION_SECRET`| A long random string (e.g. `openssl rand -base64 32`) |
| `ADMIN_USER`    | Your admin email               |
| `ADMIN_PASS`    | Your admin password            |

## Step 4: Deploy

Click **Deploy site**. Netlify will build and deploy your app.

## Step 5: Seed admin user (first deploy)

After the first successful deploy, run the seed script locally against your production DB, or create an admin via your app’s signup/admin flow.

```bash
DATABASE_URL="your-neon-connection-string" npx ts-node scripts/reset-and-seed-admins.ts
```

## Notes

- **File uploads:** Files in `public/uploads` are ephemeral on Netlify and will not persist. For persistent uploads, add S3, Uploadthing, or similar.
- **Database:** You must use PostgreSQL; SQLite will not work on Netlify.
