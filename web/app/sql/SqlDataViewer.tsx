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
    return (
      <pre className="overflow-y-auto bg-gray-700 p-2 text-red-200 font-mono">
        {JSON.stringify(description, null, 2)}
      </pre>
    );
  }

  return (
    <div className="h-2/3 mb-9 w-full max-w-full overflow-auto">
      {viewMode === "table" ? (
        rows instanceof Array ? (
          <Table
            {...{
              columnNames: getColumnNames(rows),
              tableData: rows,
            }}
          />
        ) : (
          <pre className="overflow-y-auto bg-gray-700 p-2 text-gray-200 font-mono">
            {JSON.stringify(rows, null, 2)}
          </pre>
        )
      ) : (
        <pre className="overflow-y-auto bg-gray-700 p-2 text-gray-200 font-mono">
          {JSON.stringify(rows, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SqlDataViewer;
