export const executeSQL = async (queries: string[], id?: string) => {
  const response = await fetch("http://localhost:3253/api/execute_pg", {
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
