# DB Lens Architecture Overview

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Terminal │    │   NPX Registry   │    │  User's Browser │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ npx dblens <conn>     │                       │
         └───────────────────────┤                       │
                                 │                       │
                                 ▼                       │
                    ┌──────────────────────┐             │
                    │   Download Package   │             │
                    │   Execute CLI        │             │
                    └──────────────────────┘             │
                                 │                       │
                                 ▼                       │
                    ┌──────────────────────┐             │
                    │  Parse Arguments     │             │
                    │  Extract Conn String │             │
                    └──────────────────────┘             │
                                 │                       │
                                 ▼                       │
                    ┌──────────────────────┐             │
                    │  Connect to DB       │             │
                    │  (SSL fallback)      │             │
                    └──────────────────────┘             │
                                 │                       │
                                 ▼                       │
                    ┌──────────────────────┐             │
                    │  Start Express       │             │
                    │  Server :3253        │             │
                    └──────────────────────┘             │
                                 │                       │
                                 │ opn(browser)          │
                                 └───────────────────────┘
                                                         │
                                                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Browser Application                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────────────────────┐   │
│  │   Sidebar   │  │           Main Content Area             │   │
│  │             │  │                                         │   │
│  │ ● Overview  │  │  ┌─────────────────────────────────┐   │   │
│  │ ● SQL       │  │  │        SQL Editor               │   │   │
│  │ ● Explorer  │  │  │  ┌─────────────────────────┐   │   │   │
│  │ ● ERD       │  │  │  │ SELECT * FROM users;    │   │   │   │
│  │             │  │  │  └─────────────────────────┘   │   │   │
│  │             │  │  │                                 │   │   │
│  │             │  │  │  ┌─────────────────────────┐   │   │   │
│  │             │  │  │  │    Query Results        │   │   │   │
│  │             │  │  │  │  ┌─────┬─────┬─────┐   │   │   │   │
│  │             │  │  │  │  │ id  │name │email│   │   │   │   │
│  │             │  │  │  │  ├─────┼─────┼─────┤   │   │   │   │
│  │             │  │  │  │  │  1  │John │...  │   │   │   │   │
│  │             │  │  │  │  └─────┴─────┴─────┘   │   │   │   │
│  │             │  │  │  └─────────────────────────┘   │   │   │
│  │             │  │  └─────────────────────────────────┘   │   │
│  └─────────────┘  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP API Calls
                                 ▼
                    ┌──────────────────────┐
                    │   Express Server     │
                    │   localhost:3253     │
                    ├──────────────────────┤
                    │ POST /api/execute_pg │
                    │ POST /api/get_ai_*   │
                    │ GET  /* (static)     │
                    └──────────────────────┘
                                 │
                                 │ SQL Queries
                                 ▼
                    ┌──────────────────────┐
                    │   PostgreSQL DB      │
                    │   (User's Database)  │
                    └──────────────────────┘
```

## Component Breakdown

### 1. CLI Entry Point (`server/src/index.ts`)
- **Purpose:** Main executable when user runs `npx dblens`
- **Responsibilities:**
  - Parse command line arguments
  - Establish database connection
  - Start Express server
  - Launch browser

### 2. Express Server
- **Purpose:** Local API server for frontend communication
- **Port:** 3253 (default)
- **Routes:**
  - `POST /api/execute_pg` - Execute SQL queries
  - `POST /api/get_ai_suggestion` - AI query assistance
  - `GET /*` - Serve static React build

### 3. React Frontend (`web/app/`)
- **Purpose:** User interface for database exploration
- **Framework:** Next.js (static export)
- **Main Components:**
  - `SqlScreen` - Query editor and results
  - `OverviewScreen` - Database performance metrics
  - `TableScreen` - Data browser
  - `ErdContainer` - Entity relationship diagrams

### 4. Database Connection Layer
- **Purpose:** Manage PostgreSQL connections
- **Features:**
  - Connection caching
  - SSL fallback
  - Auto-reconnection
  - Error handling

## Data Flow

### Query Execution Flow
```
User Types SQL → Frontend → HTTP Request → Express Server → PostgreSQL → Results → Frontend → Display
```

### Detailed Steps:
1. **User Input:** User types SQL in the web interface
2. **Frontend Processing:** React component captures query
3. **API Call:** `executeSQL()` sends POST to `/api/execute_pg`
4. **Server Processing:** Express handler gets cached DB connection
5. **Query Execution:** SQL executed against PostgreSQL
6. **Response:** Results sent back as JSON
7. **Frontend Display:** Results rendered in table format

## Security Model

### Local-First Architecture
- **Database credentials:** Never leave local machine
- **Connection:** Direct from CLI to database
- **API:** Only accessible from localhost
- **CORS:** Restricted to localhost and .dblens.app

### No Authentication Required
- **Reason:** Server runs locally with database access already established
- **Security:** Relies on local machine security
- **Access:** Only processes on same machine can access API

## Deployment Strategy

### NPM Package Distribution
```
Development → Build → Package → NPM Registry → User Installation
```

### Build Process:
1. **Frontend Build:** Next.js static export (`web/out/`)
2. **Backend Build:** TypeScript compilation (`server/dist/`)
3. **Integration:** Copy frontend build to server dist
4. **Package:** Publish server package with embedded frontend

### User Installation:
- **No installation:** NPX downloads and runs on-demand
- **Always latest:** Each run gets newest version
- **Cross-platform:** Works anywhere Node.js runs

## Performance Considerations

### Connection Management
- **Single connection:** Reused across all API requests
- **Connection pooling:** Could be added for high-concurrency scenarios
- **Caching:** Connection cached until process ends

### Frontend Optimization
- **Static build:** Pre-compiled React application
- **Local serving:** No network latency for UI assets
- **Lazy loading:** Components loaded on-demand

### Browser Strategy
- **Hosted version preferred:** Better performance via CDN
- **Local fallback:** Works offline or when hosted version unavailable
- **Auto-detection:** Automatically chooses best option

This architecture provides a seamless developer experience while maintaining security and performance through local-first design principles.
