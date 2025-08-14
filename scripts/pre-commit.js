#!/usr/bin/env node

/**
 * Pre-commit check script
 * Run this before committing to ensure the build works
 * Usage: node scripts/pre-commit.js
 */

import { execSync } from 'child_process';
import { exit } from 'process';

console.log('🔍 Running pre-commit checks...\n');

try {
  // Test VitePress build
  console.log('📦 Testing VitePress build...');
  execSync('pnpm docs:build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ All checks passed! Ready to commit.\n');
} catch (error) {
  console.error('\n❌ Pre-commit checks failed!');
  console.error('Please fix the errors above before committing.\n');
  console.error('Tip: Run "pnpm docs:build" to see detailed error messages.\n');
  exit(1);
}