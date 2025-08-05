/**
 * Frontend API Client for Database Operations
 *
 * This module handles communication between the React frontend and the local
 * Express server that was started by the CLI command.
 *
 * Architecture:
 * Frontend (React) → HTTP Request → Local Server (Express) → PostgreSQL
 *
 * The server runs on localhost:3253 by default and provides REST API endpoints
 * for database operations. All database credentials and connections are handled
 * server-side for security.
 */
import { useEffect, useState } from "react";

// API host - defaults to local server started by CLI
const host = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3253";

/**
 * Execute SQL queries against the connected database
 *
 * This function sends SQL queries to the local server which executes them
 * using the PostgreSQL connection established during CLI startup.
 *
 * @param queries - Array of SQL query strings to execute
 * @param id - Optional identifier for tracking (unused currently)
 * @returns Promise with query results and execution metadata
 */
export const executeSQL = async (queries: string[], id?: string) => {
  const response = await fetch(`${host}/api/execute_pg`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ queries }),
  });

  if (!response.ok) {
    throw new Error("Failed to execute query");
  }

  const data = await response.json();
  return data;
};

export const getAiSuggestion = async (
  systemInstructions: string,
  query: string,
  error: string
) => {
  const response = await fetch(host + "/api/get_ai_suggestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ systemInstructions, query, error }),
  });

  if (!response.ok) {
    throw new Error("Failed to execute query");
  }

  const data = await response.json();
  return data;
};

export const isAiAvailable = async () => {
  const response = await fetch(host + "/api/is_ai_available", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to execute query");
  }

  const data = await response.json();
  return data;
};

export const useIsAiAvailable = () => {
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiAvailability = async () => {
      try {
        const result = await isAiAvailable();
        setAiAvailable(result?.status === "AVAILABLE");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAiAvailability();
  }, []);

  return { aiAvailable, loading, error };
};
