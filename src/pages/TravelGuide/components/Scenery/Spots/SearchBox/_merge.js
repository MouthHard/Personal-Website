const fs = require('fs');
const dir = 'D:\\Program Files\\项目\\PersonalWebsite\\src\\pages\\TravelGuide\\components\\Scenery\\Spots\\SearchBox\\';
const p = dir + 'index.scss';
const t = dir + '_new_dropdown.scss';
const lines = fs.readFileSync(p, 'utf8').split('\n');
const head = lines.slice(0, 841).join('\n') + '\n';
const nw = fs.readFileSync(t, 'utf8');
fs.writeFileSync(p, head + '\n' + nw);
console.log('Done. Lines:', fs.readFileSync(p, 'utf8').split('\n').length);