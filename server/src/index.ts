#!/usr/bin/env node
/**
 * DB Lens CLI Server Entry Point
 *
 * This is the main entry point for the DB Lens CLI application.
 * When users run `npx dblens <connection_string>`, this file is executed.
 *
 * User Journey:
 * 1. NPX resolves and downloads the dblens package
 * 2. This script extracts the PostgreSQL connection string from command line args
 * 3. Establishes a connection to the database (with SSL fallback)
 * 4. Starts an Express server on port 3253 serving the React frontend
 * 5. Opens the application in the user's default browser
 * 6. Frontend communicates with this server via REST API for database operations
 *
 * Architecture:
 * - Express server serves static React build from ./out directory
 * - PostgreSQL connections are cached and reused across requests
 * - CORS configured for localhost and .dblens.app domains
 * - Graceful shutdown handling for database connections
 */
import "dotenv/config";

import * as express from "express";
import * as path from "path";
import * as minimist from "minimist";
import { Client } from "pg";
import * as fs from "fs";
import { executePgHandler } from "./execute_pg";
import * as cors from "cors"; // Import CORS middleware
import { getAiSuggestionHandler } from "./getAiSuggestion";
import { isAiAvailableHandler } from "./isAiAvailable";
const opn = require("opn");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json({ limit: "1mb" }));

// Define the allowed origins
const allowedOrigins = [/^http:\/\/localhost(:\d+)?$/, /\.dblens\.app$/];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // If no origin (e.g. mobile apps or curl requests), allow it
      if (!origin) return callback(null, true);

      // Check if the origin matches any of the allowed origins
      const isAllowed = allowedOrigins.some((pattern) => {
        if (pattern instanceof RegExp) {
          return pattern.test(origin);
        }
        return pattern === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Extract command line arguments
// When user runs: npx dblens postgres://user:pass@host:port/db
// process.argv = ['node', '/path/to/script', 'postgres://user:pass@host:port/db', ...other args]
// We slice(2) to get everything after the script name
const pArgs: string[] = process.argv.slice(2);
const connectionString: string | null = pArgs[0] || null; // The first argument is the connection string

if (!connectionString) {
  console.error("Error: Connection string is required.");
  console.error("Usage: npx dblens <postgres_connection_string>");
  console.error("Example: npx dblens postgres://user:password@localhost:5432/database");
  process.exit(1);
}

// PostgreSQL connection management
// We cache connections to avoid creating new ones for each API request
interface ClientMap {
  [key: string]: Client;
}
let cachedClient = {} as ClientMap;

/**
 * Establishes and caches a PostgreSQL connection
 *
 * Connection Strategy:
 * 1. First attempt: Connect without SSL
 * 2. If that fails: Retry with SSL enabled (rejectUnauthorized: false)
 * 3. Cache successful connections for reuse
 * 4. Auto-reconnect on connection errors
 *
 * @param noCache - Force a new connection instead of using cached one
 * @param connectionString - PostgreSQL connection string (uses global if not provided)
 * @returns Promise<Client> - Connected PostgreSQL client
 */
export async function getPgConnection({
  noCache = false,
  connectionString: connStr,
}: {
  noCache?: boolean;
  connectionString?: string;
}): Promise<Client> {
  // Use provided connection string or fall back to the global one from CLI args
  const dbConnectionString = connStr || connectionString || undefined;
  const cacheKey = "123456789"; // Simple cache key - could be improved to use connection string hash

  if (cachedClient[cacheKey] && !noCache) {
    // console.log("Using cached PostgreSQL connection.");
    return cachedClient[cacheKey] as Client;
  }

  // console.log("Establishing new PostgreSQL connection...");
  let client = new Client({
    connectionString: dbConnectionString,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database.");
  } catch (initialError) {
    console.log("Attempting connection with sslmode=require...");
    // Many cloud PostgreSQL providers require SSL, so we retry with SSL enabled
    client = new Client({
      connectionString: dbConnectionString,
      ssl: { rejectUnauthorized: false }, // Allow self-signed certificates
    });

    try {
      await client.connect();
      console.log("Connected to PostgreSQL database with SSL.");
    } catch (sslError: any) {
      console.error("SSL connection error:", sslError);
      throw new Error(sslError.message);
    }
  }

  // Cache the client connection for reuse across API requests
  cachedClient[cacheKey] = client;

  // Handle connection errors and auto-reconnect
  client.on("error", async (err) => {
    console.error("PostgreSQL client error:", err.message);
    console.log("Reconnecting to PostgreSQL...");
    delete cachedClient[cacheKey]; // Remove the faulty client from cache
    cachedClient[cacheKey] = await getPgConnection({ connectionString: dbConnectionString }); // Reconnect
  });

  return client;
}

const args = minimist(pArgs);
const port: number = args.port || process.env.PORT || 3253;

// Function to connect to the PostgreSQL database
const connectToDB = async (): Promise<Client> => {
  const client = await getPgConnection({ connectionString });
  return client;
};

/**
 * Starts the Express server and opens the application in the browser
 *
 * Server Setup:
 * 1. Test database connection first
 * 2. Serve static React build from ./out directory
 * 3. Set up API routes for database operations
 * 4. Start server on specified port (default: 3253)
 * 5. Open application in browser (prefer hosted version if available)
 */
const startServer = async (): Promise<void> => {
  try {
    // Test the database connection before starting the server
    await connectToDB();
    console.log("Database connection established successfully.");
    console.log("Starting dblens server...");

    // Path to the static files (pre-built React application)
    const staticPath: string = path.join(__dirname, "./out");

    // Serve static files from the 'web/out' folder
    app.use(express.static(staticPath));

    // Serve index.html for the root route
    app.get("/", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });

    // Dynamic route to serve anystring.html if present, otherwise 404
    // This supports Next.js static export routing
    app.get("*", (req, res) => {
      const requestedFile = path.join(
        staticPath,
        `${req.path.substring(1)}.html`
      );
      if (fs.existsSync(requestedFile)) {
        res.sendFile(requestedFile);
      } else {
        res.status(404).sendFile(path.join(staticPath, "404.html"));
      }
    });

    // API endpoints for frontend communication
    app.post("/api/execute_pg", executePgHandler);        // Execute SQL queries
    app.post("/api/get_ai_suggestion", getAiSuggestionHandler); // AI-powered query suggestions
    app.post("/api/is_ai_available", isAiAvailableHandler);     // Check AI availability

    // Start the Express server
    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Opening dblens in the default browser...`);

      // Browser launch strategy:
      // 1. Try to use hosted version at https://local.dblens.app (if available)
      // 2. Fall back to local server at http://localhost:${port}
      // The hosted version provides better performance and features
      fetch("https://local.dblens.app")
        .then(() => {
          opn(`https://local.dblens.app`); // Use hosted version
        })
        .catch(() => {
          opn(`http://localhost:${port}`); // Use local server
        });
    });
  } catch (error: any) {
    console.error("Error starting dblens server:", error.message);
    process.exit(1);
  }
};

// Call the function to start the server
startServer();

// Gracefully handle process exit
process.on("SIGINT", () => {
  console.log(
    "SIGINT received, closing PostgreSQL connection and shutting down."
  );
  Object.values(cachedClient).forEach(async (client) => {
    if (client) await client.end();
  });
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(
    "SIGTERM received, closing PostgreSQL connection and shutting down."
  );
  Object.values(cachedClient).forEach(async (client) => {
    if (client) await client.end();
  });
  process.exit(0);
});
