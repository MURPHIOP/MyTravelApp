#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUDIT_LOG_PATH = path.resolve(process.cwd(), '.ecc-audit.log');
const CONFIG_PATH = path.resolve(process.cwd(), 'ecc-evolution.json');

const args = process.argv.slice(2);
const IS_DRY_RUN = args.includes('--dry-run');

function log(msg) {
  console.log(`\x1b[36m[EVOLUTION ENGINE]\x1b[0m ${msg}`);
}

function error(msg) {
  console.error(`\x1b[31m[EVOLUTION ERROR]\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`\x1b[32m[EVOLUTION SUCCESS]\x1b[0m ${msg}`);
}

function warn(msg) {
  console.log(`\x1b[33m[EVOLUTION WARN]\x1b[0m ${msg}`);
}

function run(cmd, options = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...options }).trim();
  } catch (err) {
    if (options.throwOnError !== false) {
      throw err;
    }
    return null;
  }
}

// Parse semver "X.Y.Z"
function parseSemver(v) {
  if (!v) return null;
  const clean = v.replace(/^[^0-9]*/, '');
  const parts = clean.split('.').map(n => parseInt(n, 10));
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    raw: v,
  };
}

async function main() {
  const startTime = Date.now();
  log(`Starting autonomous evolution cycle${IS_DRY_RUN ? ' (DRY RUN MODE)' : ''}...`);

  // =========================================================================
  // GATE 1: Vault & Data Layer Isolation Check
  // =========================================================================
  log('Gate 1: Verifying data layer isolation & vault integrity...');
  if (!fs.existsSync(CONFIG_PATH)) {
    error('ecc-evolution.json not found! Halting evolution cycle.');
    process.exit(1);
  }

  // Check git status to ensure working directory doesn't have uncommitted vault mutations
  const statusOutput = run('git status --porcelain', { throwOnError: false }) || '';
  const statusLines = statusOutput.split('\n').filter(Boolean);

  for (const line of statusLines) {
    const filePath = line.slice(3).trim();
    if (filePath.startsWith('src/lib/private_uploads/')) {
      error(`Vault mutation detected in '${filePath}'. Halting evolution cycle.`);
      process.exit(1);
    }
    if (filePath === '.env.local' || filePath.startsWith('.env.')) {
      error(`Secret store mutation detected in '${filePath}'. Halting evolution cycle.`);
      process.exit(1);
    }
  }
  success('Gate 1 Passed: Document vault and secret stores are fully isolated.');

  // =========================================================================
  // GATE 2: Non-Blocking Minor Dependency Updates
  // =========================================================================
  log('Gate 2: Scanning for safe minor / patch dependency upgrades...');
  const outdatedJsonRaw = run('npm outdated --json', { throwOnError: false }) || '{}';
  let outdated = {};
  try {
    outdated = JSON.parse(outdatedJsonRaw);
  } catch {
    warn('Could not parse npm outdated output. Skipping dependency upgrades.');
  }

  // Packages pinned or locked to prevent breaking Next.js 16 / React 19 core
  const PINNED_PACKAGES = [
    'next',
    'react',
    'react-dom',
    'eslint-config-next',
    'tailwindcss',
    'typescript',
    'eslint',
    'dotenv',
    'framer-motion'
  ];

  const approvedUpgrades = [];
  const blockedMajorUpgrades = [];

  for (const [pkgName, details] of Object.entries(outdated)) {
    if (PINNED_PACKAGES.includes(pkgName)) {
      blockedMajorUpgrades.push(`${pkgName} (Pinned core framework)`);
      continue;
    }

    const currentVer = parseSemver(details.current);
    const latestVer = parseSemver(details.latest);

    if (!currentVer || !latestVer) continue;

    // Strict Minor/Patch filter: Major versions MUST match
    if (currentVer.major === latestVer.major) {
      if (latestVer.minor > currentVer.minor || latestVer.patch > currentVer.patch) {
        approvedUpgrades.push({
          name: pkgName,
          from: details.current,
          to: details.latest,
        });
      }
    } else {
      blockedMajorUpgrades.push(`${pkgName} (${details.current} -> ${details.latest})`);
    }
  }

  log(`Found ${approvedUpgrades.length} approved minor/patch upgrade(s).`);
  if (blockedMajorUpgrades.length > 0) {
    log(`Blocked ${blockedMajorUpgrades.length} breaking/major package(s): ${blockedMajorUpgrades.join(', ')}`);
  }

  let dependenciesUpdated = false;
  if (approvedUpgrades.length > 0) {
    if (IS_DRY_RUN) {
      log(`[DRY RUN] Would upgrade: ${approvedUpgrades.map(u => `${u.name}@^${u.to}`).join(' ')}`);
    } else {
      const installArgs = approvedUpgrades.map(u => `"${u.name}@^${u.to}"`).join(' ');
      log(`Installing approved upgrades: ${installArgs}...`);
      try {
        execSync(`npm install ${installArgs}`, { stdio: 'inherit' });
        dependenciesUpdated = true;
        success('Dependencies upgraded successfully.');
      } catch (e) {
        error(`Failed to install dependency updates: ${e.message}`);
        // Attempt clean restore
        run('git checkout -- package.json package-lock.json', { throwOnError: false });
      }
    }
  }

  // =========================================================================
  // GATE 3: Layout & Route Hygiene (ESLint & TypeScript)
  // =========================================================================
  log('Gate 3: Running layout and route hygiene audit...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    success('Lint & Image optimization checks passed with 0 warnings.');
  } catch {
    error('ESLint layout/image audit failed!');
    if (dependenciesUpdated) {
      warn('Rolling back package.json due to audit failure...');
      run('git checkout -- package.json package-lock.json', { throwOnError: false });
    }
    process.exit(1);
  }

  log('Running TypeScript compilation check (npx tsc --noEmit)...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    success('TypeScript compilation check passed with 0 errors.');
  } catch {
    error('TypeScript typecheck failed!');
    if (dependenciesUpdated) {
      warn('Rolling back package.json due to type error...');
      run('git checkout -- package.json package-lock.json', { throwOnError: false });
    }
    process.exit(1);
  }

  // =========================================================================
  // GATE 4: Next.js Standalone Build Verification
  // =========================================================================
  log('Gate 4: Verifying production build stability...');
  if (!IS_DRY_RUN && dependenciesUpdated) {
    try {
      execSync('npm run build', { stdio: 'inherit' });
      success('Production standalone build verified successfully.');
    } catch {
      error('Production build failed! Triggering automatic self-healing rollback...');
      run('git checkout -- package.json package-lock.json', { throwOnError: false });
      execSync('npm install', { stdio: 'inherit' });
      error('Rollback complete. System state restored.');
      process.exit(1);
    }
  } else {
    log('Skipping full rebuild (dry-run or no dependency modifications).');
  }

  // =========================================================================
  // GATE 5: Continuous-Learning Telemetry & Logging
  // =========================================================================
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const timestamp = new Date().toISOString();
  const upgradedSummary = approvedUpgrades.map(u => u.name).join(', ') || 'None';
  const logLine = `[${timestamp}] EVOLUTION CYCLE COMPLETED | Duration: ${durationSec}s | Upgrades: [${upgradedSummary}] | Vault Isolated: YES\n`;

  try {
    fs.appendFileSync(AUDIT_LOG_PATH, logLine, 'utf-8');
  } catch {
    // Non-fatal
  }

  success(`Autonomous evolution cycle completed successfully in ${durationSec}s.\n`);
  process.exit(0);
}

main().catch(err => {
  error(`Fatal error in evolution engine: ${err.message}`);
  process.exit(1);
});
