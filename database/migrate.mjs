import { existsSync, readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDirectory = path.join(root, 'database', 'migrations');

function loadLocalEnvironment() {
  const envPath = path.join(root, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!match || process.env[match[1]]) continue;
    const value = match[2];
    process.env[match[1]] = ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) ? value.slice(1, -1) : value;
  }
}

function splitStatements(source) {
  const statements = [];
  let current = '';
  let single = false;
  let double = false;
  let lineComment = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      current += char;
      if (char === '\n') lineComment = false;
      continue;
    }
    if (!single && !double && char === '-' && next === '-') {
      current += `${char}${next}`;
      index += 1;
      lineComment = true;
      continue;
    }
    if (!double && char === "'") {
      current += char;
      if (single && next === "'") { current += next; index += 1; continue; }
      single = !single;
      continue;
    }
    if (!single && char === '"') { double = !double; current += char; continue; }
    if (!single && !double && char === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

async function run() {
  loadLocalEnvironment();
  const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Missing DATABASE_URL_UNPOOLED or DATABASE_URL.');
  const sql = neon(databaseUrl);
  await sql.query('create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())');
  const applied = new Set((await sql.query('select name from schema_migrations')).map((row) => row.name));
  const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith('.sql')).sort();
  for (const file of files) {
    if (applied.has(file)) { process.stdout.write(`Skipping ${file} (already applied)\n`); continue; }
    const source = readFileSync(path.join(migrationsDirectory, file), 'utf8');
    process.stdout.write(`Applying ${file}... `);
    for (const statement of splitStatements(source)) await sql.query(statement);
    await sql`insert into schema_migrations (name) values (${file})`;
    process.stdout.write('done\n');
  }
}

run().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
