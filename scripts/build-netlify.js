#!/usr/bin/env node
/**
 * Netlify build script - works on both Windows and Linux
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

console.log('=== Swapping to PostgreSQL schema ===');
const schemaPostgres = path.join(__dirname, '../prisma/schema.postgres.prisma');
const schemaPrisma = path.join(__dirname, '../prisma/schema.prisma');
fs.copyFileSync(schemaPostgres, schemaPrisma);

console.log('=== Generating Prisma client ===');
run('npx prisma generate');

process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!process.env.DATABASE_URL) {
  console.error('');
  console.error('ERROR: DATABASE_URL (or NETLIFY_DATABASE_URL) is not set.');
  console.error('Add it in Netlify: Site settings → Environment variables');
  process.exit(1);
}

console.log('=== Pushing database schema ===');
run('npx prisma db push');

console.log('=== Building Next.js ===');
run('npx next build');
