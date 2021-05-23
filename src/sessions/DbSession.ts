import { QueryResultRow } from 'pg';

export type SqlExecReponseType = {
  status: string;
  rows: QueryResultRow | string;
};
interface DbSession {
  id: string;
  executeSQL: (sql: string) => Promise<SqlExecReponseType>;
}

export default DbSession;
