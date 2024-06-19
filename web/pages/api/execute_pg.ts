import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

type QueryResult = {
  status: string;
  rows: any[];
  duration: number;
};

type ResponseData = {
  message: string;
  data?: QueryResult[];
  error?: string;
};

interface ClientMap {
  [key: string]: Client;
}
let cachedClient = {} as ClientMap;

export async function getPgConnection(
  connectionString: string
): Promise<Client> {
  // generate cache key from connectionstring
  const cacheKey = "123456789"; // right now only one client is there, but this is to support multiple clients in future
  console.log(
    "Checking for cached pg connection",
    JSON.stringify(Object.keys(cachedClient))
  );
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
      console.log("result");
      console.log(JSON.stringify(result, null, 2));
      // if type of result is array, then rows need to be merged from root level result array
      if (Array.isArray(result)) {
        const rows = result.reduce((acc, val) => {
          return acc.concat(val.rows);
        }, []);
        results.push({
          status: "SUCCESS",
          rows,
          duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
        });
        continue;
      } else
        results.push({
          status: "SUCCESS",
          rows: result.rows,
          duration: duration[0] * 1000 + duration[1] / 1e6, // Convert duration to milliseconds
        });
    } catch (error) {
      console.error("Error executing query:", error);
      results.push({
        status: "ERROR",
        rows: [],
        duration: 0,
      });
    }
  }

  return results;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const connectionString = process.env.CONNECTION_STRING;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { queries } = req.body;

  if (!Array.isArray(queries)) {
    res.status(400).json({ message: "Invalid queries" });
    return;
  } else if (typeof connectionString !== "string") {
    res.status(400).json({ message: "Invalid connection string" });
    return;
  }

  try {
    const client = await getPgConnection(connectionString);

    try {
      const results = await executeQueries(client, queries);
      res
        .status(200)
        .json({ message: "Queries executed successfully", data: results });
    } catch (error: any) {
      console.error("Error executing queries:", error);
      res
        .status(500)
        .json({ message: "Error executing queries", error: error?.message });
    } finally {
      // await client.end();
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Error connecting to database",
      error: error.message,
    });
  }
}
