"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ANIMATIONS_DIR = path_1.default.join(__dirname, '../assets/useanimations');
const OUTPUT_FILE = path_1.default.join(__dirname, '../catalog.json');
// Category mapping - based on animation names/characteristics
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
    'volume': 'media',
    'chevron': 'navigation',
    'arrow': 'navigation',
    'chat': 'communication',
    'email': 'communication',
};
function getCategory(animationName) {
    const lowerName = animationName.toLowerCase();
    for (const [key, category] of Object.entries(CATEGORY_MAP)) {
        if (lowerName.includes(key))
            return category;
    }
    return 'other';
}
function extractMetadata(visibilityJsonPath) {
    const content = JSON.parse(fs_1.default.readFileSync(visibilityJsonPath, 'utf-8'));
    return {
        width: content.w || 32,
        height: content.h || 32,
        frameRate: content.fr || 30,
        frames: content.op || 10,
    };
}
function generateCatalog() {
    const animations = [];
    const categoriesSet = new Set();
    const folders = fs_1.default.readdirSync(ANIMATIONS_DIR);
    for (const folder of folders) {
        const folderPath = path_1.default.join(ANIMATIONS_DIR, folder);
        const stat = fs_1.default.statSync(folderPath);
        if (!stat.isDirectory())
            continue;
        const visibilityPath = path_1.default.join(folderPath, 'visibility.json');
        if (fs_1.default.existsSync(visibilityPath)) {
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
        }
    }
    const catalog = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        animations: animations.sort((a, b) => a.name.localeCompare(b.name)),
        categories: Array.from(categoriesSet).sort(),
    };
    fs_1.default.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2));
    console.log(`Generated catalog with ${animations.length} animations and ${categoriesSet.size} categories`);
}
generateCatalog();
//# sourceMappingURL=generate-catalog.js.map