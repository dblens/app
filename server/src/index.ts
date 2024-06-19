#!/usr/bin/env node
import * as express from "express";
import * as path from "path";
import * as minimist from "minimist";
import { Client } from "pg";
import { executePgHandler } from "./execute_pg";
import * as cors from "cors"; // Import CORS middleware
const opn = require('opn');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

const pArgs: string[] = process.argv.slice(2);
const connectionString: string | null = pArgs[0] || null; // The first argument passed

if (!connectionString) {
  console.error("Error: Connection string is required.");
  process.exit(1);
}

interface ClientMap {
  [key: string]: Client;
}
let cachedClient = {} as ClientMap;

export async function getPgConnection(
  connectionString: string
): Promise<Client> {
  const cacheKey = "123456789"; // Generate cache key from connection string

  if (cachedClient[cacheKey]) {
    // console.log("Using cached PostgreSQL connection.");
    return cachedClient[cacheKey] as Client;
  }

  // console.log("Establishing new PostgreSQL connection...");
  let client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database.");
  } catch (initialError) {
    console.log("Attempting connection with sslmode=require...");
    // Try with sslmode=require
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      console.log("Connected to PostgreSQL database with SSL.");
    } catch (sslError: any) {
      console.error("SSL connection error:", sslError);
      throw new Error(sslError.message);
    }
  }

  // Cache the client connection
  cachedClient[cacheKey] = client;

  return client;
}

const args = minimist(pArgs);
const port: number = args.port || process.env.PORT || 3253;

// Function to connect to the PostgreSQL database and start the server
const connectToDB = async (): Promise<void> => {
  const client = await getPgConnection(connectionString);

  try {
    // console.log("Database connection established successfully.");
    console.log("Starting dblens server...");

    // Path to the static files
    const staticPath: string = path.join(__dirname, "../../web/out");

    // Serve static files from the 'web/out' folder
    app.use(express.static(staticPath));

    // Serve index.html for the root route
    app.get("/", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });

    // Serve index.html for all other routes (to support client-side routing)
    app.get("*", (req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });

    // API endpoint for executing PostgreSQL queries
    app.post("/api/execute_pg", executePgHandler(client));

    // Start the Express server
    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Opening dblens in the default browser...`);
      opn(`https://local.dblens.app`); // Adjust URL as needed
    });
  } catch (error: any) {
    console.error("Error starting dblens server:", error.message);
    process.exit(1);
  }
};

// Call the function to connect to the database and start the server
connectToDB();
