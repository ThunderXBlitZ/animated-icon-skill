#!/usr/bin/env node
/**
 * Downloads all animated icons from useanimations/react-useanimations on GitHub.
 * Icons are licensed under CC BY 4.0 — attribution to useanimations.com required.
 * https://useanimations.com/licencing-and-terms.html
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_API = 'https://api.github.com/repos/useanimations/react-useanimations/contents/src/lib';
const RAW_BASE = 'https://raw.githubusercontent.com/useanimations/react-useanimations/master/src/lib';
const OUT_DIR  = path.join(__dirname, '../assets/useanimations');

function get(url) {
  return new Promise((resolve, reject) => {
    const opts = { headers: { 'User-Agent': 'animated-icon-skill' } };
    https.get(url, opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function download() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Fetching icon list from GitHub...');
  const entries = JSON.parse(await get(REPO_API));
  const icons = entries.filter(e => e.type === 'dir').map(e => e.name);
  console.log(`Found ${icons.length} icons\n`);

  let ok = 0;
  for (const name of icons) {
    const dir = path.join(OUT_DIR, name);
    fs.mkdirSync(dir, { recursive: true });

    const url = `${RAW_BASE}/${name}/${name}.json`;
    try {
      const json = await get(url);
      JSON.parse(json); // validate
      fs.writeFileSync(path.join(dir, 'visibility.json'), json);
      console.log(`✓ ${name}`);
      ok++;
    } catch {
      console.warn(`✗ ${name} (skipped)`);
    }
  }

  console.log(`\nDone — ${ok}/${icons.length} icons saved to assets/useanimations/`);
}

download().catch(err => { console.error(err); process.exit(1); });
