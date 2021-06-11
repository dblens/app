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
  getTableData: (
    schema: string,
    table: string,
    offset: number,
    pagenumber: number
  ) => Promise<unknown>;
}

export default DbSession;
