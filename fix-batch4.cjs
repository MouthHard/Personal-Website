const fs = require('fs');
let raw = fs.readFileSync('temp-batch4.json', 'utf8');

const lines = raw.split('\n');
const fixedLines = lines.map(line => {
  const match = line.match(/^(\s*"(?:museumId|history|architecture|highlights|education)":\s*")(.*)("(?:,|\s*$))$/);
  if (!match) return line;
  let prefix = match[1];
  let value = match[2];
  let suffix = match[3];
  let isOpen = true;
  value = value.replace(/"/g, () => {
    const q = isOpen ? '\u201c' : '\u201d';
    isOpen = !isOpen;
    return q;
  });
  return prefix + value + suffix;
});

const fixed = fixedLines.join('\n');
fs.writeFileSync('temp-batch4.json', fixed, 'utf8');
try {
  const data = JSON.parse(fixed);
  console.log('Fixed! Valid JSON, items:', data.length);
} catch(e) {
  console.log('Still broken:', e.message.substring(0, 200));
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || 0);
  if (pos > 0) console.log('Context:', fixed.substring(pos - 80, pos + 80));
}
