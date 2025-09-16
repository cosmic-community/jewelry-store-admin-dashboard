const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Find all HTML files in the build output
async function injectConsoleCapture() {
  try {
    // Common build output directories
    const buildDirs = [
      'out',     // Next.js static export
      'dist',    // Vite, Astro, etc.
      'build',   // Create React App
      '.next'    // Next.js server build
    ];
    
    let htmlFiles = [];
    
    // Check each possible build directory
    for (const dir of buildDirs) {
      if (fs.existsSync(dir)) {
        const files = await glob(`${dir}/**/*.html`);
        htmlFiles = htmlFiles.concat(files);
      }
    }
    
    if (htmlFiles.length === 0) {
      console.log('No HTML files found in build output directories');
      return;
    }
    
    const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
    let injectedCount = 0;
    
    for (const file of htmlFiles) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Skip if already injected
      if (content.includes('dashboard-console-capture.js')) {
        continue;
      }
      
      // Try to inject in <head> section first
      if (content.includes('</head>')) {
        content = content.replace('</head>', `  ${scriptTag}\n</head>`);
      }
      // Fallback: inject before closing </html>
      else if (content.includes('</html>')) {
        content = content.replace('</html>', `  ${scriptTag}\n</html>`);
      }
      // Fallback: inject at the beginning of <body>
      else if (content.includes('<body')) {
        content = content.replace(/(<body[^>]*>)/, `$1\n  ${scriptTag}`);
      }
      else {
        // No suitable location found, skip this file
        continue;
      }
      
      fs.writeFileSync(file, content);
      injectedCount++;
    }
    
    console.log(`Console capture script injected into ${injectedCount} HTML files`);
  } catch (error) {
    console.error('Error injecting console capture script:', error);
  }
}

// Run the injection
injectConsoleCapture();