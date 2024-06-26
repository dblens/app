import { QueryResultRow } from "pg";
import React from "react";
import { ColumnName } from "../sessions/DbSession";
import Table from "../components/molecules/Table";

const getColumnNames = (rows: QueryResultRow): ColumnName[] => {
  return Object.keys(rows?.[0] ?? {}).map((v) => ({
    column_name: v,
    data_type: "string",
  }));
};

const CodeViewer = ({
  code,
  mode = "code",
}: {
  code: string;
  mode?: "code" | "error";
}) => {
  return (
    <pre
      className={`overflow-auto bg-gray-700 p-2 font-mono max-w-2/3 ${
        code == "error" ? "text-red-200" : "text-gray-200"
      }`}
      style={{maxWidth: "100%"}}
    >
      {JSON.stringify(code, null, 2)}
    </pre>
  );
};

const SqlDataViewer = ({
  description,
  status,
  rows,
  loading,
  viewMode,
}: {
  description?: any;
  status: string;
  rows: QueryResultRow;
  loading: boolean;
  viewMode: string;
}) => {
  if (loading) return <h1>Loading...</h1>;
  if (status == "ERROR") {
    return <CodeViewer mode={"error"} code={description} />;
  }

  return (
    <div
      className="h-2/3 w-full max-w-full overflow-auto overflow-x-scroll"
      style={{ height: "inherit" }}
    >
      {viewMode === "table" ? (
        rows instanceof Array ? (
          <Table
            {...{
              columnNames: getColumnNames(rows),
              tableData: rows,
            }}
          />
        ) : (
          <CodeViewer code={rows} />
        )
      ) : (
        <CodeViewer code={rows} />
      )}
    </div>
  );
};

export default SqlDataViewer;
