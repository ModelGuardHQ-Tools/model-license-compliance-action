#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Recursively collect all file paths under a directory
function walk(dir, filelist = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip Git metadata and node_modules
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      walk(fullPath, filelist);
    } else {
      filelist.push(fullPath);
    }
  }
  return filelist;
}

// Only scan files with these extensions or names
function filterScanFiles(allFiles) {
  return allFiles.filter(f => {
    const base = path.basename(f).toLowerCase();
    return f.endsWith('.md') || f.endsWith('.txt') || base === 'license' || base === 'notice';
  });
}

// Main
(function main() {
  try {
    const cwd = process.cwd();
    const allFiles = walk(cwd);
    const scanFiles = filterScanFiles(allFiles);

    const dataPath = path.join(cwd, 'data', 'model-licenses.json');
    const modelData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const missing = [];
    for (const [model, snippet] of Object.entries(modelData)) {
      let found = false;
      for (const filePath of scanFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(snippet)) {
          found = true;
          break;
        }
      }
      if (!found) {
        missing.push(model);
      }
    }

    if (missing.length) {
      console.error(`Missing required attributions for models: ${missing.join(', ')}`);
      process.exit(1);
    } else {
      console.log('All model license attributions are present.');
      process.exit(0);
    }
  } catch (err) {
    console.error('Error during scan:', err.message);
    process.exit(1);
  }
})();