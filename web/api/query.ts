import { useEffect, useState } from "react";

const host = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3253";

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
