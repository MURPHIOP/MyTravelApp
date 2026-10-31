#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUDIT_LOG_PATH = path.resolve(process.cwd(), '.ecc-audit.log');
const CONFIG_PATH = path.resolve(process.cwd(), 'ecc-evolution.json');

function log(msg) {
  console.log(`\x1b[36m[ECC VERIFY]\x1b[0m ${msg}`);
}

function error(msg) {
  console.error(`\x1b[31m[ECC GUARD ERROR]\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`\x1b[32m[ECC SUCCESS]\x1b[0m ${msg}`);
}

function runCommand(cmd, options = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...options }).trim();
  } catch (err) {
    if (options.throwOnError !== false) {
      throw err;
    }
    return null;
  }
}

async function main() {
  log('Starting continuous-learning pre-commit verification cycle...');

  // 1. Load ecc-evolution.json
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    } catch (e) {
      error(`Failed to parse ecc-evolution.json: ${e.message}`);
      process.exit(1);
    }
  }

  // 2. Inspect staged files
  const stagedDiff = runCommand('git diff --cached --name-status');
  if (!stagedDiff) {
    log('No staged changes detected. Pre-commit check skipped.');
    process.exit(0);
  }

  const stagedEntries = stagedDiff
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const parts = line.split(/\t+/);
      const status = parts[0].trim();
      const filePath = parts[parts.length - 1].trim();
      return { status, filePath };
    });

  log(`Inspecting ${stagedEntries.length} staged file(s)...`);

  // 3. Phase 1: ECC Guardrail Shield Checks
  const violations = [];

  for (const { status, filePath } of stagedEntries) {
    // A. src/lib/private_uploads/ lockdown
    if (filePath.startsWith('src/lib/private_uploads/')) {
      if (status.startsWith('D') || status.startsWith('R')) {
        violations.push(
          `Protected vault asset '${filePath}' was marked for deletion/rename (${status}). IMMUTABLE_DATA_STORE policy strictly prohibits removal of persistent files.`
        );
      }
    }

    // B. .env.local and secrets lockdown
    if (filePath === '.env.local' || filePath.startsWith('.env.')) {
      violations.push(
        `File '${filePath}' matches SECRET_STORE_LOCKED. Secrets must never be committed to git.`
      );
    }

    // C. Supabase migration and schema contracts
    const isSupabaseContract =
      filePath.startsWith('supabase/migrations/') ||
      filePath === 'verify_supabase.ts' ||
      filePath === 'src/lib/supabase.ts' ||
      filePath.startsWith('backend/migrations/');

    if (isSupabaseContract) {
      const diffContent = runCommand(`git diff --cached -- "${filePath}"`, { throwOnError: false }) || '';
      const destructivePatterns = [
        /\bDROP\s+TABLE\b/i,
        /\bDROP\s+COLUMN\b/i,
        /\bTRUNCATE\b/i,
        /\bCASCADE\b/i,
      ];

      for (const pattern of destructivePatterns) {
        if (pattern.test(diffContent)) {
          violations.push(
            `Destructive schema operation (${pattern.source}) detected in database contract '${filePath}'. SCHEMA_STABILITY_LOCK forbids unverified destructive DDL.`
          );
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error('\n' + '='.repeat(70));
    error('Pre-commit verification ABORTED due to ECC Guardrail Violations:');
    violations.forEach((v, i) => console.error(`  ${i + 1}. ${v}`));
    console.error('='.repeat(70) + '\n');
    process.exit(1);
  }

  // 4. Phase 2: Route & Code Change Analysis
  const codeExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  const stagedCodeFiles = stagedEntries
    .filter(e => !e.status.startsWith('D'))
    .map(e => e.filePath)
    .filter(fp => codeExtensions.some(ext => fp.endsWith(ext)) && fs.existsSync(fp));

  const modifiedRoutes = [];
  stagedEntries.forEach(({ filePath }) => {
    if (filePath.startsWith('src/app/')) {
      const routeSegment = filePath.replace(/^src\/app\//, '').replace(/\/page\.(tsx|jsx|ts|js)$/, '');
      modifiedRoutes.push(routeSegment === 'page.tsx' ? '/' : `/${routeSegment}`);
    }
  });

  if (modifiedRoutes.length > 0) {
    log(`Modified routes identified: ${modifiedRoutes.join(', ')}`);
  }

  // 5. Phase 3: Targeted Verification Cycles
  if (stagedCodeFiles.length > 0) {
    // TypeScript Check
    log('Running TypeScript compilation check (npx tsc --noEmit)...');
    try {
      execSync('npx tsc --noEmit', { stdio: 'inherit' });
      success('TypeScript compilation check passed with 0 errors.');
    } catch {
      error('TypeScript check failed. Fix type errors before committing.');
      process.exit(1);
    }

    // ESLint Check on staged files
    log(`Running ESLint on ${stagedCodeFiles.length} staged code file(s)...`);
    try {
      execSync(`npx eslint ${stagedCodeFiles.map(f => `"${f}"`).join(' ')}`, { stdio: 'inherit' });
      success('ESLint checks passed with 0 errors and 0 warnings.');
    } catch {
      error('ESLint check failed. Fix lint warnings/errors before committing.');
      process.exit(1);
    }
  } else {
    log('No application code or route files modified. Skipping deep compilation checks.');
  }

  // 6. Phase 4: Telemetry & Continuous-Learning Log
  const timestamp = new Date().toISOString();
  const summaryLine = `[${timestamp}] PASS | Files: ${stagedEntries.length} | Routes: [${modifiedRoutes.join(', ') || 'none'}]\n`;
  try {
    fs.appendFileSync(AUDIT_LOG_PATH, summaryLine, 'utf-8');
  } catch {
    // Non-fatal if audit logging encounters file write restrictions
  }

  success('Pre-commit verification cycle completed successfully. Commit allowed.\n');
  process.exit(0);
}

main().catch(err => {
  error(`Unexpected error in pre-commit hook: ${err.message}`);
  process.exit(1);
});

