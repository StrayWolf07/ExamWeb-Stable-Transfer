#!/bin/bash
# Netlify build script - runs on Linux in Netlify's build environment
set -e

echo "=== Swapping to PostgreSQL schema ==="
cp prisma/schema.postgres.prisma prisma/schema.prisma

echo "=== Generating Prisma client ==="
npx prisma generate

if [ -z "$DATABASE_URL" ]; then
  echo ""
  echo "ERROR: DATABASE_URL is not set."
  echo "Add it in Netlify: Site settings → Environment variables"
  echo "Get a free PostgreSQL URL from https://neon.tech or https://supabase.com"
  exit 1
fi

echo "=== Pushing database schema ==="
npx prisma db push

echo "=== Building Next.js ==="
npx next build
