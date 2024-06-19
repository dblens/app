#!/usr/bin/env node
import * as express from "express";

const opn = require('opn');

import * as path from "path";
import * as minimist from "minimist";
import { Client } from "pg";
import { executePgHandler } from "./execute_pg";

import * as cors from "cors"; // Import CORS middleware

const bodyParser = require('body-parser');


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
  // generate cache key from connectionstring
  const cacheKey = "123456789"; // right now only one client is there, but this is to support multiple clients in future
  // console.log(
  //   "Checking for cached pg connection",
  //   JSON.stringify(Object.keys(cachedClient))
  // );
  if (cachedClient[cacheKey]) {
    console.log("checking if the client is connected");
    return cachedClient[cacheKey] as Client;
  }
  console.log("fallback to new connection");
  let client = new Client({
    connectionString,
  });

  try {
    await client.connect();
  } catch (initialError) {
    console.log("Try with sslmode=require");
    // Try with sslmode=require
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
    } catch (sslError: any) {
      console.error("SSL connection error:", sslError);
      throw new Error(sslError.message);
    }
  }
  // cache the client connection
  cachedClient[cacheKey] = client;

  return client;
}
const args = minimist(pArgs);
const port: number = args.port || process.env.PORT || 3253;

// Function to connect to the PostgreSQL database
const connectToDB = async (): Promise<void> => {
  const client = await getPgConnection(connectionString);

  try {
    // await client.connect();
    console.log("Connected to the database");

    console.log("starting server...");

    // Path to the static files
    // const staticPath: string = path.join(__dirname, "../web/out");
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

    // Serve index.html for all other routes (to support client-side routing)
    app.post("/api/execute_pg", executePgHandler(client));

    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log(`Opening dblens on http://localhost:${port}`);
      // opn(`http://localhost:${port}`); // Open the browser
      opn(`https://local.dblens.app`); // Open the browser
    });
  } catch (error: any) {
    console.error("Error connecting to the database:", error.message);
    console.error("Failed to connect to the database. Exiting...");
    process.exit(1);
  }
};

// Call the function to connect to the database
connectToDB();
