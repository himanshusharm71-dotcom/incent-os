const fs = require('fs');
const path = require('path');
const dir = './src/components/modules';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace subtle white backgrounds with subtle dark backgrounds
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.0[1-9]\)/g, (match) => match.replace(/255/g, '0'));
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.1[0-5]?\)/g, (match) => match.replace(/255/g, '0'));
  
  // Replace white borders with border-light
  content = content.replace(/1px solid rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)/g, "1px solid var(--border-light)");

  // Replace muted white text with muted dark text
  content = content.replace(/color:\s*'rgba\(255,\s*255,\s*255,\s*0\.[3-7]\)'/g, "color: 'var(--text-muted)'");

  // Replace pure white text (if not in an active tab ternary) with text-primary
  content = content.replace(/color:\s*'#fff'/g, (match, offset, string) => {
     const context = string.substring(Math.max(0, offset - 30), offset);
     if (context.includes('activeTab') || context.includes('primary') || context.includes('var(--accent') || context.includes('#10B981') || context.includes('#EF4444')) return match;
     return "color: 'var(--text-primary)'";
  });

  // Dark card background
  content = content.replace(/background:\s*'rgba\(15,\s*23,\s*42,\s*0\.6\)'/g, "background: 'var(--bg-card)'");

  // Some components had background: '#1e1e1e' or '#111' 
  content = content.replace(/background:\s*'#1e1e1e'/gi, "background: 'var(--bg-card)'");
  content = content.replace(/background:\s*'#111'/gi, "background: 'var(--bg-card)'");

  // Fix ternary text colors: color: activeTab === ... ? '#fff' : 'rgba(255,255,255,0.5)'
  content = content.replace(/'rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)'/g, "'var(--text-muted)'");

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Successfully updated 11 modules to light theme!');
