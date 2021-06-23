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

export type SortType = 'asc' | 'desc' | 'none';

export type ColumnName = {
  column_name: string;
  data_type: string;
  visible?: boolean;
  sort?: SortType;
};

export type SortColumnType = Record<string, SortType>; // key is the colName
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
    sortedColumns?: SortColumnType;
  }) => Promise<{ status: string; rows: Record<string, unknown>[] }>;
  getColumnNames: ({
    schema,
    table,
  }: {
    schema: string;
    table: string;
  }) => Promise<{ status: string; rows: ColumnName[] }>;
}

export default DbSession;
