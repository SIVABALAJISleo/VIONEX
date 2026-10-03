#!/usr/bin/env node

/**
 * VIONEX Real-Time Git Repository Synchronization Watcher
 * Watches for local changes, stages, commits, and pushes to GitHub automatically.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEBOUNCE_MS = 15000; // 15 seconds debounce
let debounceTimer = null;
let isSyncing = false;
let pendingChanges = new Set();

const IGNORED_PATTERNS = [
  /[\\/]\.git([\\/]|$)/,
  /[\\/]\.next([\\/]|$)/,
  /[\\/]node_modules([\\/]|$)/,
  /[\\/]dist([\\/]|$)/,
  /[\\/]build([\\/]|$)/,
  /[\\/]\.turbo([\\/]|$)/,
  /\.log$/,
  /\.tmp$/,
  /\.swp$/,
  /Thumbs\.db$/,
  /\.DS_Store$/
];

function isIgnored(filePath) {
  return IGNORED_PATTERNS.some((pattern) => pattern.test(filePath));
}

function runGit(command) {
  try {
    return execSync(command, {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    throw error;
  }
}

async function performSync() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const status = runGit('git status --porcelain');
    if (!status) {
      console.log(`[${new Date().toLocaleTimeString()}] No changes to sync. Working tree clean.`);
      isSyncing = false;
      pendingChanges.clear();
      return;
    }

    const changedFiles = status
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    console.log(`\n======================================================`);
    console.log(`[Auto-Sync] Detected ${changedFiles.length} file change(s):`);
    changedFiles.slice(0, 8).forEach((f) => console.log(`  • ${f}`));
    if (changedFiles.length > 8) {
      console.log(`  ... and ${changedFiles.length - 8} more`);
    }

    console.log(`[Auto-Sync] Staging changes...`);
    runGit('git add -A');

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const commitMsg = `auto-sync: update codebase [${timestamp}]`;

    console.log(`[Auto-Sync] Committing: "${commitMsg}"...`);
    runGit(`git commit -m "${commitMsg}"`);

    console.log(`[Auto-Sync] Pushing to origin main...`);
    runGit('git push origin main');

    console.log(`[Auto-Sync] Successfully synchronized with GitHub repository!`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error(`[Auto-Sync] Sync failed or waiting for network: ${err.message || err}`);
  } finally {
    isSyncing = false;
    pendingChanges.clear();
  }
}

function scheduleSync(filename) {
  if (filename && isIgnored(filename)) return;

  if (filename) pendingChanges.add(filename);

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  console.log(`[${new Date().toLocaleTimeString()}] Change detected in "${filename || 'project'}". Sync queued in ${DEBOUNCE_MS / 1000}s...`);
  debounceTimer = setTimeout(() => {
    performSync();
  }, DEBOUNCE_MS);
}

console.log(`======================================================`);
console.log(`  VIONEX Real-Time Git Repository Synchronization Daemon`);
console.log(`  Watching: ${REPO_ROOT}`);
console.log(`  Target:   https://github.com/SIVABALAJISleo/VIONEX (branch: main)`);
console.log(`======================================================\n`);

try {
  fs.watch(REPO_ROOT, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    if (isIgnored(filename)) return;
    scheduleSync(filename);
  });
  console.log(`[Auto-Sync] File watcher active. Any saved file will automatically sync to GitHub.`);
} catch (e) {
  console.log(`[Auto-Sync] Recursive watch fallback to 30s polling.`);
  setInterval(() => {
    try {
      const status = runGit('git status --porcelain');
      if (status) performSync();
    } catch {}
  }, 30000);
}

// Initial check on launch
performSync();
