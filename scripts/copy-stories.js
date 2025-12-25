const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'Stories');
const destDir = path.join(process.cwd(), 'public', 'Stories');

// Create public directory if it doesn't exist
if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}

// Copy Stories directory to public
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      // Skip .DS_Store files
      if (childItemName === '.DS_Store') {
        return;
      }
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(sourceDir)) {
  console.log('Copying Stories to public directory...');
  copyRecursiveSync(sourceDir, destDir);
  console.log('Stories copied successfully!');
} else {
  console.warn('Stories directory not found, skipping copy.');
}
