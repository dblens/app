#!/usr/bin/env node
import * as express from "express";

import * opn from "opn";
import * path from "path";
import * as minimist from "minimist";
import { Client } from "pg";

const { Express, Request, Response } = express;

const app: Express = express();

const pArgs: string[] = process.argv.slice(2);
const connectionString: string | null = pArgs[0] || null; // The first argument passed

if (!connectionString) {
  console.error("Error: Connection string is required.");
  process.exit(1);
}

const args = minimist(pArgs);
const port: number = args.port || process.env.PORT || 3253;

// Function to connect to the PostgreSQL database
const connectToDB = async (): Promise<void> => {
  const client: Client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log("Connected to the database");

    console.log("starting server...");

    // Path to the static files
    // const staticPath: string = path.join(__dirname, "../web/out");
    const staticPath: string = path.join(__dirname, "../../web/out");


    // Serve static files from the 'web/out' folder
    app.use(express.static(staticPath));

    // Serve index.html for the root route
    app.get("/", (req: Request, res: Response) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });

    // Serve index.html for the dashboard route
    app.get("/dashboard", (req: Request, res: Response) => {
      res.sendFile(path.join(staticPath, "dashboard.html"));
    });

    // Serve index.html for all other routes (to support client-side routing)
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });

    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log(`Opening logscreen on http://localhost:${port}`);
      opn(`http://localhost:${port}`); // Open the browser
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    console.error("Failed to connect to the database. Exiting...");
    process.exit(1);
  }
};

// Call the function to connect to the database
connectToDB();
