const fs = require('fs');
const path = require('path');

// Find all .tsx files in src/pages
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = findTsxFiles(pagesDir);

let updatedCount = 0;
let skippedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has export const dynamic but not getServerSideProps
  if (content.includes('export const dynamic') && !content.includes('getServerSideProps')) {
    // Check if file has export default
    if (content.includes('export default')) {
      // Find the export default line and add getServerSideProps after it
      const lines = content.split('\n');
      let exportDefaultIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('export default')) {
          exportDefaultIndex = i;
          break;
        }
      }
      
      if (exportDefaultIndex !== -1) {
        // Check if there's already something after export default
        const nextNonEmptyLine = lines.slice(exportDefaultIndex + 1).findIndex(line => line.trim() && !line.trim().startsWith('//'));
        
        if (nextNonEmptyLine === -1 || nextNonEmptyLine > 0) {
          // Insert getServerSideProps after export default
          const insertIndex = exportDefaultIndex + 1;
          const getServerSidePropsCode = [
            '',
            '// Force dynamic rendering for Pages Router',
            'export async function getServerSideProps() {',
            '  return {',
            '    props: {},',
            '  };',
            '}'
          ];
          
          lines.splice(insertIndex, 0, ...getServerSidePropsCode);
          const newContent = lines.join('\n');
          
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Updated: ${path.relative(__dirname, filePath)}`);
          updatedCount++;
        } else {
          console.log(`Skipped (has content after export default): ${path.relative(__dirname, filePath)}`);
          skippedCount++;
        }
      } else {
        console.log(`Skipped (no export default found): ${path.relative(__dirname, filePath)}`);
        skippedCount++;
      }
    } else {
      console.log(`Skipped (no export default): ${path.relative(__dirname, filePath)}`);
      skippedCount++;
    }
  }
});

console.log(`\nDone! Updated ${updatedCount} files, skipped ${skippedCount} files.`);
