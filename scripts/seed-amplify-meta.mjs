import { readFileSync, writeFileSync } from 'node:fs';

const metaPath = 'amplify/backend/amplify-meta.json';
const seedPath = 'amplify/backend/.pending-meta-seed.json';

const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));

let changed = false;

for (const [category, resources] of Object.entries(seed)) {
  meta[category] ??= {};
  for (const [resourceName, definition] of Object.entries(resources)) {
    if (!(resourceName in meta[category])) {
      meta[category][resourceName] = definition;
      changed = true;
      console.log(`Seeded pending category "${category}/${resourceName}" into amplify-meta.json`);
    }
  }
}

if (changed) {
  writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
} else {
  console.log('No pending categories to seed - amplify-meta.json already has everything.');
}
