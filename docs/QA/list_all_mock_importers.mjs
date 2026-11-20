import fs from 'fs';
import path from 'path';

function getFiles(dir, matchExt) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, matchExt));
    } else if (file.endsWith(matchExt)) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = [
  ...getFiles('frontend/src/app', '.jsx'),
  ...getFiles('frontend/src/components', '.jsx'),
  ...getFiles('frontend/src/lib', '.js')
];

const mockImports = [];

files.forEach(f => {
  const norm = f.replace(/\\/g, '/');
  if (norm.includes('/mock') || norm.endsWith('.test.js')) return;

  const content = fs.readFileSync(f, 'utf-8');
  const matches = content.matchAll(/import\s+\{?([^}]+)\}?\s+from\s+['"](@\/lib\/mock[^'"]+)['"]/g);
  for (const m of matches) {
    mockImports.push({
      file: norm,
      source: m[2],
      rawImport: m[0],
      items: m[1].split(',').map(s => s.trim())
    });
  }
});

console.log(`Found ${mockImports.length} mock import statements across ${new Set(mockImports.map(m => m.file)).size} files.`);
fs.writeFileSync('docs/QA/mock_importers.json', JSON.stringify(mockImports, null, 2));

const byFile = {};
mockImports.forEach(m => {
  if (!byFile[m.file]) byFile[m.file] = [];
  byFile[m.file].push(...m.items);
});

for (const [file, items] of Object.entries(byFile)) {
  console.log(`${file.padEnd(70)}: ${items.join(', ')}`);
}
