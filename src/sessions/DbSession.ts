import { QueryResultRow } from 'pg';

export type SqlExecReponseType = {
  status: string;
  rows: QueryResultRow[] | string;
};
export type TableType = {
  table_name: string;
  table_type: string;
};
export type TableDataType = Record<string, unknown>;
interface DbSession {
  id: string;
  executeSQL: (sql: string) => Promise<SqlExecReponseType>;
  getDBSchemas: () => Promise<string[]>;
  getAllTables: (schema: string) => Promise<TableType[]>;
  getTableData: ({
    schema,
    table,
    offset,
    pagenumber,
    size,
  }: {
    schema: string;
    table: string;
    offset: number;
    pagenumber: number;
    size: number;
  }) => Promise<{ status: string; rows: Record<string, unknown>[] }>;
}

export default DbSession;
