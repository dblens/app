/**
 * PostgreSQL Query Execution Handler
 *
 * This module handles SQL query execution requests from the frontend.
 * It uses the cached PostgreSQL connection established during server startup.
 *
 * Flow:
 * 1. Frontend sends POST request to /api/execute_pg with queries array
 * 2. This handler gets the cached PostgreSQL connection
 * 3. Executes each query sequentially
 * 4. Returns results with timing and status information
 * 5. Handles connection errors with automatic retry logic
 */
import { Client } from "pg";
import { Request, Response } from "express";
import { getPgConnection } from ".";

type QueryResult = {
  status: string;
  rows: any[];
  description?: any;
  duration: number;
};

type ResponseData = {
  message: string;
  data?: QueryResult[];
  error?: string;
};

async function executeQueries(
  client: Client,
  queries: string[]
): Promise<QueryResult[]> {
  const results: QueryResult[] = [];

  for (const query of queries) {
    const startTime = process.hrtime();
    try {
      const result = await client.query(query);
      const duration = process.hrtime(startTime);

      if (Array.isArray(result)) {
        const rows = result.reduce((acc, val) => acc.concat(val.rows), []);
        results.push({
          status: "SUCCESS",
          rows,
          duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
        });
      } else {
        results.push({
          status: "SUCCESS",
          rows: result.rows,
          duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
        });
      }
    } catch (error) {
      console.error("Error executing query:", error);

      if (isConnectionError(error)) {
        console.log("Connection error detected. Retrying query...");
        try {
          // Reconnect the client
          client = await getPgConnection({});
          const result = await client.query(query);
          const duration = process.hrtime(startTime);

          if (Array.isArray(result)) {
            const rows = result.reduce((acc, val) => acc.concat(val.rows), []);
            results.push({
              status: "SUCCESS",
              rows,
              duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
            });
          } else {
            results.push({
              status: "SUCCESS",
              rows: result.rows,
              duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
            });
          }
        } catch (retryError) {
          console.error("Error executing query on retry:", retryError);
          results.push({
            status: "ERROR",
            description: retryError,
            rows: [],
            duration: 0,
          });
        }
      } else {
        results.push({
          status: "ERROR",
          description: error,
          rows: [],
          duration: 0,
        });
      }
    }
  }

  return results;
}

// Utility function to check for connection errors
function isConnectionError(error: any): boolean {
  // Implement logic to check if the error is a connection error
  // This could be based on error codes, messages, or other properties
  // Example:
  // return error.code === 'ECONNRESET' || error.code === 'ENOTFOUND';
  return (
    error.code === "ECONNRESET" ||
    error.code === "ENOTFOUND" ||
    error.code === "EHOSTUNREACH" ||
    error.message.includes("Connection terminated")
  );
}

/**
 * Main API handler for PostgreSQL query execution
 *
 * This is the primary endpoint that the frontend uses to execute SQL queries.
 * It receives an array of SQL queries and executes them sequentially using
 * the cached database connection established during server startup.
 *
 * Request format:
 * POST /api/execute_pg
 * Body: { queries: ["SELECT * FROM users;", "SELECT COUNT(*) FROM orders;"] }
 *
 * Response format:
 * {
 *   message: "Queries execution completed...",
 *   data: [
 *     { status: "SUCCESS", rows: [...], duration: 123.45 },
 *     { status: "ERROR", description: {...}, rows: [], duration: 0 }
 *   ]
 * }
 */
export const executePgHandler = async (req: Request, res: Response) => {
  const { queries } = req.body;
  // console.log(queries)

  // Get the cached PostgreSQL connection (established during server startup)
  const client = await getPgConnection({});

  // Execute all queries and collect results
  const results = await executeQueries(client, queries);

  try {
    res.status(200).json({
      message:
        "Queries execution completed, please check individual query status from the results",
      data: results,
    });
    return;
  } catch (error: any) {
    console.error("Error executing queries:", error);
    res
      .status(500)
      .json({ message: "Error executing queries", error: error?.message });
  }
};
