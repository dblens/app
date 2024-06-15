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
  rows,
  loading,
}: {
  rows: QueryResultRow;
  loading: boolean;
}) => {
  if (loading) return <h1>Loading...</h1>;

  if (rows instanceof Array)
    return (
      <div className="h-2/3 mb-9 w-full max-w-full overflow-auto">
        <Table
          {...{
            columnNames: getColumnNames(rows),
            tableData: rows,
          }}
        />
      </div>
    );
  return (
    <pre className="h-2/3 mb-9 overflow-y-auto bg-gray-700 p-2 text-gray-200 font-mono">
      {rows && JSON.stringify(rows, null, 2)}
    </pre>
  );
};

export default SqlDataViewer;
