import { Client } from "pg";
import { Request, Response } from "express";

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

export const executePgHandler =
  (client: Client) => async (req: Request, res: Response) => {
    const { queries } = req.body;
    // console.log(queries)

    try {
      const results = await executeQueries(client, queries);
      res
        .status(200)
        .json({ message: "Queries executed successfully", data: results });
        return 
    } catch (error: any) {
      console.error("Error executing queries:", error);
      res
        .status(500)
        .json({ message: "Error executing queries", error: error?.message });
    } finally {
      // await client.end();
    }
  };
