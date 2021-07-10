import { QueryResultRow } from 'pg';
import { SqlExecReponseType } from '../../sessions/DbSession';

export type DiskUsageStateType = {
  totalTableData?: SqlExecReponseType<QueryResultRow[]>;
  tableData?: SqlExecReponseType<QueryResultRow[]>;
  indexData?: SqlExecReponseType<QueryResultRow[]>;
};
