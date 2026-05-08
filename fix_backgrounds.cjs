const fs = require('fs');
const path = require('path');
const dir = './src/components/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix remaining dark card backgrounds
  content = content.replace(/background:\s*'rgba\(15,\s*23,\s*42,\s*0\.[0-9]+\)'/g, "background: 'var(--bg-card)'");

  // Fix active tab text color logic
  // We want: color: activeTab === tool.id ? '#fff' : 'var(--text-primary)'
  content = content.replace(/color:\s*'var\(--text-primary\)',\s*fontWeight/g, "color: activeTab === tool.id ? '#fff' : 'var(--text-primary)', fontWeight");
  
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Successfully fixed remaining dark backgrounds and active tab colors!');
