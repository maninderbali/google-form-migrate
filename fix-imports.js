const fs = require('fs');
const path = require('path');

function fixImports(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      content = content.replace(
        /from\s+["'](.*?)(?<!\.js)["']/g,
        'from "$1.js"'
      );
      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  }
}

fixImports(path.join(__dirname, 'dist'));
