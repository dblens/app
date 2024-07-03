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
