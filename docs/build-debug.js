#!/usr/bin/env node

// Build debug script for Cloudflare Pages
console.log('=== Build Debug Information ===');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Working directory:', process.cwd());
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- CF_PAGES:', process.env.CF_PAGES);
console.log('- CF_PAGES_BRANCH:', process.env.CF_PAGES_BRANCH);
console.log('- CF_PAGES_COMMIT_SHA:', process.env.CF_PAGES_COMMIT_SHA);

// Check if required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'theme.config.tsx',
  'pages/index.js'
];

console.log('\n=== File Check ===');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
});

// Check package.json content
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\n=== Package Info ===');
  console.log('Name:', pkg.name);
  console.log('Version:', pkg.version);
  console.log('Next.js version:', pkg.dependencies?.next || 'Not found');
  console.log('Nextra version:', pkg.dependencies?.nextra || 'Not found');
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

console.log('\n=== Starting Build ===');
