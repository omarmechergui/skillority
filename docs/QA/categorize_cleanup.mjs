import fs from 'fs';

const importers = JSON.parse(fs.readFileSync('docs/QA/mock_importers.json', 'utf-8'));
const files = Array.from(new Set(importers.map(i => i.file)));

console.log(`Total files to clean: ${files.length}`);

const categories = {
  admin: files.filter(f => f.includes('/admin/')),
  company: files.filter(f => f.includes('/company/')),
  instructor: files.filter(f => f.includes('/instructor/')),
  student: files.filter(f => f.includes('/student/')),
  other: files.filter(f => !f.includes('/admin/') && !f.includes('/company/') && !f.includes('/instructor/') && !f.includes('/student/'))
};

for (const [k, v] of Object.entries(categories)) {
  console.log(`\n=== ${k.toUpperCase()} (${v.length} files) ===`);
  v.forEach(f => console.log('  ' + f));
}
