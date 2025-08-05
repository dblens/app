# DB Lens User Journey Documentation

## Overview

This document explains the complete user journey when executing `npx dblens <connection_string>` and the underlying architecture that makes it work.

## User Journey Flow

### 1. Command Execution
```bash
npx dblens postgres://user:password@localhost:5432/database
```

**What happens:**
- NPX downloads the `dblens` package from npm registry
- NPX executes the binary defined in `package.json` → `./dist/index.js`
- The compiled TypeScript server (`server/src/index.ts`) starts execution

### 2. Argument Processing
**Location:** `server/src/index.ts:67-79`

- Extracts connection string from `process.argv.slice(2)[0]`
- Validates that a connection string was provided
- Exits with usage instructions if missing

### 3. Database Connection
**Location:** `server/src/index.ts:getPgConnection()`

**Connection Strategy:**
1. **First attempt:** Connect without SSL
2. **Fallback:** If connection fails, retry with SSL enabled (`ssl: { rejectUnauthorized: false }`)
3. **Caching:** Store successful connections for reuse across API requests
4. **Error handling:** Auto-reconnect on connection errors

**Why this approach?**
- Many cloud PostgreSQL providers (AWS RDS, Google Cloud SQL, etc.) require SSL
- Self-signed certificates are common, so we disable certificate validation
- Connection pooling improves performance for multiple queries

### 4. Express Server Setup
**Location:** `server/src/index.ts:startServer()`

**Server Configuration:**
- **Port:** 3253 (default) or custom via `--port` flag
- **Static files:** Serves pre-built React app from `./out` directory
- **CORS:** Configured for `localhost` and `.dblens.app` domains
- **API routes:** 
  - `/api/execute_pg` - Execute SQL queries
  - `/api/get_ai_suggestion` - AI-powered query suggestions
  - `/api/is_ai_available` - Check AI service availability

### 5. Browser Launch
**Location:** `server/src/index.ts:233`

**Launch Strategy:**
1. **Preferred:** Try to open `https://local.dblens.app` (hosted version)
2. **Fallback:** Open `http://localhost:3253` (local server)

**Why prefer hosted version?**
- Better performance (CDN, optimized builds)
- Latest features and bug fixes
- Reduced local resource usage

### 6. Frontend Application Load
**Location:** `web/app/`

**Application Structure:**
- **Framework:** Next.js React SPA
- **Layout:** Sidebar navigation + main content area
- **Default route:** SQL interface (`/` → `SqlScreen`)
- **Available sections:**
  - **Overview:** Database performance metrics
  - **SQL:** Query editor and execution
  - **Explorer:** Table browser and data exploration
  - **ERD:** Entity Relationship Diagrams

**No Authentication Required:**
- Connection is established server-side during startup
- Frontend communicates with local API server
- No login/session management needed

### 7. API Communication Flow
**Frontend → Backend Communication:**

```
Frontend (React)  →  HTTP Request  →  Express Server  →  PostgreSQL
     ↓                                      ↓               ↓
Query Interface  →  /api/execute_pg  →  Cached Connection  →  Database
     ↓                                      ↓               ↓
Results Display  ←  JSON Response   ←  Query Results     ←  Query Result
```

**Key API Endpoints:**
- `POST /api/execute_pg` - Execute SQL queries with results
- `POST /api/get_ai_suggestion` - Get AI-powered query suggestions
- `POST /api/is_ai_available` - Check if AI features are available

## Architecture Decisions

### Why CLI + Web Interface?
1. **Easy installation:** No desktop app installation required
2. **Cross-platform:** Works on any OS with Node.js
3. **Auto-updates:** Always get latest version via NPX
4. **Familiar interface:** Web-based UI that developers know

### Why Local Server + Browser?
1. **Security:** Database credentials never leave local machine
2. **Performance:** Direct connection to database without proxy
3. **Flexibility:** Can work offline, no external dependencies
4. **Development experience:** Familiar web development tools

### Connection Caching Strategy
- **Single connection per CLI session:** Reuse connection across API requests
- **Auto-reconnect:** Handle connection drops gracefully
- **SSL fallback:** Support both SSL and non-SSL databases

## Error Handling

### Common Issues & Solutions

1. **Connection String Invalid**
   - Error: "Connection string is required"
   - Solution: Provide valid PostgreSQL connection string

2. **Database Connection Failed**
   - Error: SSL/connection errors
   - Solution: Automatic SSL retry with relaxed certificate validation

3. **Port Already in Use**
   - Error: EADDRINUSE
   - Solution: Use `--port` flag to specify different port

4. **Browser Doesn't Open**
   - Manual: Navigate to `http://localhost:3253`
   - Check: Firewall or security software blocking

## Development Notes

### Package Structure
```
dblens/
├── server/          # Node.js/Express backend
│   ├── src/         # TypeScript source
│   └── dist/        # Compiled JavaScript + React build
├── web/             # Next.js React frontend
└── electron/        # Legacy Electron app (deprecated)
```

### Build Process
1. **Frontend:** `web/` → Next.js static export → `web/out/`
2. **Backend:** `server/src/` → TypeScript compilation → `server/dist/`
3. **Integration:** Copy `web/out/` to `server/dist/out/`
4. **Distribution:** Publish `server/` package to npm

### Key Files
- `server/src/index.ts` - Main CLI entry point
- `server/package.json` - NPM package configuration with `bin` field
- `web/app/page.tsx` - React app entry point
- `web/app/sql/SqlScreen.tsx` - Main SQL interface

This architecture provides a seamless experience where users can quickly connect to any PostgreSQL database and start exploring data without complex setup or installation procedures.
