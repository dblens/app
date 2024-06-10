export const executeSQL = async (
  queries: string[],
  connectionString: string
) => {
  const response = await fetch("/api/execute_pg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ queries, connectionString }),
  });

  if (!response.ok) {
    throw new Error("Failed to execute query");
  }

  const data = await response.json();
  return data;
};
