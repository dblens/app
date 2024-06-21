import { Client } from "pg";
import { Request, Response } from "express";

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
          client = await getPgConnection();
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
    error.message.includes("Connection terminated")
  );
}

// Dummy getPgConnection function for illustration
async function getPgConnection(): Promise<Client> {
  // Implement your logic to establish and return a new client connection
  // Example:
  const newClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await newClient.connect();
  return newClient;
}

export const executePgHandler =
  (client: Client) => async (req: Request, res: Response) => {
    const { queries } = req.body;
    // console.log(queries)

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
