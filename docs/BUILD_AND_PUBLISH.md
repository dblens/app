# Build and Publish Process

## Current Architecture Issues

The current setup has some problems:
1. `server/dist` contains both compiled TypeScript AND frontend build
2. Build artifacts are mixed together
3. Git tracking of build artifacts is problematic
4. No clear separation between development and production builds

## Current Quick Fix

**Problem**: `server/dist` in `.gitignore` breaks npm publishing because:
- `package.json` points to `./dist/index.js` as the binary
- NPM publishes based on git-tracked files
- If `dist/` is ignored, users get a broken package

**Solution Applied**:
1. Removed `server/dist` from `.gitignore`
2. Added `server/.npmignore` to control what gets published
3. This allows git to track the build but npm to publish cleanly

## Recommended Future Architecture

### Better Directory Structure
```
dblens/
├── packages/
│   ├── cli/                 # CLI package (current server/)
│   │   ├── src/            # TypeScript source
│   │   ├── dist/           # Compiled JS only
│   │   └── package.json    # CLI package config
│   └── web/                # Frontend package
│       ├── src/            # React source
│       ├── dist/           # Built static files
│       └── package.json    # Web package config
└── scripts/
    └── build.js            # Build orchestration
```

### Improved Build Process
```bash
# 1. Build frontend
cd packages/web && npm run build:static

# 2. Copy frontend build to CLI package
cp -r packages/web/dist packages/cli/static/

# 3. Build CLI
cd packages/cli && npm run build

# 4. Publish CLI (includes embedded frontend)
cd packages/cli && npm publish
```

## Current Build Process (Working)

Until the architecture is refactored, use this process:

### Development
```bash
# 1. Install dependencies
cd web && npm install
cd ../server && npm install

# 2. Build frontend and copy to server
cd web && npm run build:setup:assets

# 3. Build server
cd ../server && npm run build

# 4. Test locally
cd .. && node server/dist/index.js <connection_string>
```

### Publishing
```bash
# 1. Ensure clean build
cd web && npm run build:setup:assets
cd ../server && npm run build

# 2. Test the package locally
npm pack
npm install -g ./dblens-0.0.1-alpha.11.tgz
dblens <test_connection_string>

# 3. Publish to npm
npm publish
```

## Git Workflow

### What to Commit
- ✅ Source code (`src/`, `app/`)
- ✅ Package configs (`package.json`, `tsconfig.json`)
- ✅ Build artifacts (`server/dist/`) - needed for npm publish
- ❌ Dependencies (`node_modules/`)
- ❌ Environment files (`.env`)

### What NPM Publishes
- ✅ Compiled code (`dist/`)
- ✅ Package metadata (`package.json`, `README.md`)
- ❌ Source code (`src/`) - excluded by `.npmignore`
- ❌ Development files (`tsconfig.json`) - excluded by `.npmignore`

## Verification Steps

Before publishing:
1. **Test local build**: `node server/dist/index.js <conn_string>`
2. **Test packed version**: `npm pack && npm install -g ./package.tgz`
3. **Test published version**: `npx dblens@latest <conn_string>`
4. **Verify assets load**: Check browser network tab for 200 OK on CSS/JS

## Future Improvements

1. **Separate packages**: Split CLI and web into separate npm packages
2. **CI/CD pipeline**: Automate build and publish process
3. **Asset optimization**: Use CDN for static assets instead of embedding
4. **Version management**: Automated versioning and changelog generation
5. **Testing**: Add automated tests for build process
