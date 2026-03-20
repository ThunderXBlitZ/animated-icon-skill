#!/usr/bin/env node
/**
 * Generates catalog.json by reading downloaded animations from assets/useanimations/
 * Extracts metadata (dimensions, frame rate) and auto-categorizes based on animation names.
 */

const fs = require('fs');
const path = require('path');

const ANIMATIONS_DIR = path.join(__dirname, '../assets/useanimations');
const OUTPUT_FILE = path.join(__dirname, '../catalog.json');

// Category mapping based on animation names
const CATEGORY_MAP = {
  'lock': 'security',
  'unlock': 'security',
  'shield': 'security',
  'menu': 'interface',
  'settings': 'interface',
  'expand': 'interface',
  'collapse': 'interface',
  'play': 'media',
  'pause': 'media',
  'playPause': 'media',
  'volume': 'media',
  'chevron': 'navigation',
  'arrow': 'navigation',
  'chat': 'communication',
  'email': 'communication',
  'mail': 'communication',
};

function getCategory(animationName) {
  const lowerName = animationName.toLowerCase();
  for (const [key, category] of Object.entries(CATEGORY_MAP)) {
    if (lowerName.includes(key.toLowerCase())) {
      return category;
    }
  }
  return 'other';
}

function extractMetadata(visibilityJsonPath) {
  const content = JSON.parse(fs.readFileSync(visibilityJsonPath, 'utf-8'));
  return {
    width: content.w || 32,
    height: content.h || 32,
    frameRate: content.fr || 30,
    frames: content.op || 10,
  };
}

function generateCatalog() {
  if (!fs.existsSync(ANIMATIONS_DIR)) {
    console.error(`✗ animations directory not found: ${ANIMATIONS_DIR}`);
    console.error('Run: node scripts/download.js first');
    process.exit(1);
  }

  const animations = [];
  const categoriesSet = new Set();
  const folders = fs.readdirSync(ANIMATIONS_DIR);

  for (const folder of folders) {
    const folderPath = path.join(ANIMATIONS_DIR, folder);
    const stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) continue;

    const visibilityPath = path.join(folderPath, 'visibility.json');
    if (fs.existsSync(visibilityPath)) {
      try {
        const category = getCategory(folder);
        categoriesSet.add(category);
        const metadata = extractMetadata(visibilityPath);
        animations.push({
          id: folder,
          name: folder,
          category,
          path: `assets/useanimations/${folder}`,
          description: `Animated ${folder} icon`,
          ...metadata,
        });
      } catch (err) {
        console.warn(`✗ Failed to read ${folder}: ${err.message}`);
      }
    }
  }

  const catalog = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    animations: animations.sort((a, b) => a.name.localeCompare(b.name)),
    categories: Array.from(categoriesSet).sort(),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2));
  console.log(`✓ Generated catalog with ${animations.length} animations and ${categoriesSet.size} categories`);
}

try {
  generateCatalog();
} catch (err) {
  console.error(err);
  process.exit(1);
}
