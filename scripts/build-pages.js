const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const apiDir = path.join(rootDir, 'src', 'app', 'api');
const backupApiDir = path.join(rootDir, 'src', 'app_api_backup');
const outDir = path.join(rootDir, 'out');

console.log('🚀 Starting GitHub Pages Static Export for NUR-APP-STORE...');

let movedApi = false;

try {
  // 1. Temporarily stash API route handlers during static export
  if (fs.existsSync(apiDir)) {
    console.log('📦 Stashing API routes for static export...');
    fs.renameSync(apiDir, backupApiDir);
    movedApi = true;
  }

  // 2. Set environment variables
  process.env.GITHUB_PAGES = 'true';
  if (!process.env.NEXT_PUBLIC_BASE_PATH) {
    process.env.NEXT_PUBLIC_BASE_PATH = '/NUR-APP-STORE';
  }

  console.log(`🌐 Base path set to: "${process.env.NEXT_PUBLIC_BASE_PATH}"`);
  console.log('🔨 Executing next build (static export)...');

  execSync('npx next build', {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  });

  // 3. Add .nojekyll to prevent GitHub Pages from ignoring files starting with _
  if (fs.existsSync(outDir)) {
    const nojekyllPath = path.join(outDir, '.nojekyll');
    fs.writeFileSync(nojekyllPath, '');
    console.log('✅ Created .nojekyll in out/ directory');

    // 4. If basePath is present, rewrite public root assets in generated html/js
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
    if (basePath) {
      console.log(`🔧 Ensuring asset references include basePath "${basePath}"...`);
      function fixAssetsInDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            fixAssetsInDir(fullPath);
          } else if (entry.name.endsWith('.html') || entry.name.endsWith('.js') || entry.name.endsWith('.txt')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Fix /logo.png and /icon.png
            if (content.includes('"/logo.png"')) {
              content = content.split('"/logo.png"').join(`"${basePath}/logo.png"`);
              modified = true;
            }
            if (content.includes('href="/logo.png"')) {
              content = content.split('href="/logo.png"').join(`href="${basePath}/logo.png"`);
              modified = true;
            }
            if (content.includes('"/icon.png"')) {
              content = content.split('"/icon.png"').join(`"${basePath}/icon.png"`);
              modified = true;
            }
            if (content.includes('href="/icon.png"')) {
              content = content.split('href="/icon.png"').join(`href="${basePath}/icon.png"`);
              modified = true;
            }
            if (content.includes('"/sample-apks/')) {
              content = content.split('"/sample-apks/').join(`"${basePath}/sample-apks/`);
              modified = true;
            }
            if (content.includes('"/uploads/')) {
              content = content.split('"/uploads/').join(`"${basePath}/uploads/`);
              modified = true;
            }

            if (modified) {
              fs.writeFileSync(fullPath, content, 'utf8');
            }
          }
        }
      }
      fixAssetsInDir(outDir);
      console.log('✅ Asset references successfully patched with basePath');
    }
  }

  console.log('🎉 GitHub Pages Static Export Complete! Output in out/');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exitCode = 1;
} finally {
  // Always restore API routes
  if (movedApi && fs.existsSync(backupApiDir)) {
    console.log('🔄 Restoring API routes...');
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.renameSync(backupApiDir, apiDir);
    console.log('✅ API routes restored successfully');
  }
}
