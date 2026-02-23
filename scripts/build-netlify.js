#!/usr/bin/env node
/**
 * Netlify build script - works on both Windows and Linux
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure we run from repo root (Netlify may run from different cwd)
const repoRoot = path.resolve(__dirname, '..');
process.chdir(repoRoot);
console.log('Working directory:', process.cwd());

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  try {
    return execSync(cmd, { stdio: 'inherit', ...opts, env: { ...process.env } });
  } catch (err) {
    console.error(`Command failed with exit code ${err.status || 1}`);
    throw err;
  }
}

// Netlify Neon add-on uses NETLIFY_DATABASE_URL; use unpooled for migrations
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
  process.env.NETLIFY_DATABASE_URL;
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL (or NETLIFY_DATABASE_URL) is not set.');
  process.exit(1);
}
console.log('DATABASE_URL is set (length ' + (process.env.DATABASE_URL || '').length + ')');

console.log('=== Swapping to PostgreSQL schema ===');
const schemaPostgres = path.join(repoRoot, 'prisma/schema.postgres.prisma');
const schemaPrisma = path.join(repoRoot, 'prisma/schema.prisma');
if (!fs.existsSync(schemaPostgres)) {
  console.error('Missing:', schemaPostgres);
  process.exit(1);
}
fs.copyFileSync(schemaPostgres, schemaPrisma);

console.log('=== Generating Prisma client ===');
run('npx prisma@5.22.0 generate');

console.log('=== Pushing database schema ===');
run('npx prisma@5.22.0 db push');

console.log('=== Building Next.js ===');
run('npm run build');
