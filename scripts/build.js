import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

console.log('1. Restoring index.html from index.dev.html...');
fs.copyFileSync(path.join(rootDir, 'index.dev.html'), path.join(rootDir, 'index.html'));

console.log('2. Running TypeScript check and Vite build from source...');
execSync('npx tsc -b && npx vite build', { stdio: 'inherit' });

console.log('3. Generating dist/404.html for SPA routing...');
fs.copyFileSync(path.join(rootDir, 'dist', 'index.html'), path.join(rootDir, 'dist', '404.html'));

console.log('4. Syncing docs/ folder for GitHub Pages...');
const docsDir = path.join(rootDir, 'docs');
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.cpSync(path.join(rootDir, 'dist'), docsDir, { recursive: true });

console.log('5. Syncing root index.html, 404.html, and assets/ for root-serving...');
fs.copyFileSync(path.join(rootDir, 'dist', 'index.html'), path.join(rootDir, 'index.html'));
fs.copyFileSync(path.join(rootDir, 'dist', '404.html'), path.join(rootDir, '404.html'));

const assetsDist = path.join(rootDir, 'dist', 'assets');
const assetsRoot = path.join(rootDir, 'assets');
if (fs.existsSync(assetsDist)) {
  fs.cpSync(assetsDist, assetsRoot, { recursive: true });
}

const projectsDist = path.join(rootDir, 'dist', 'projects');
const projectsRoot = path.join(rootDir, 'projects');
if (fs.existsSync(projectsDist)) {
  fs.cpSync(projectsDist, projectsRoot, { recursive: true });
}

const siteDataDist = path.join(rootDir, 'dist', 'site-data.json');
const siteDataRoot = path.join(rootDir, 'site-data.json');
if (fs.existsSync(siteDataDist)) {
  fs.copyFileSync(siteDataDist, siteDataRoot);
}

console.log('Build and multi-target sync completed successfully!');
