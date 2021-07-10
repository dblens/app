import { QueryResultRow } from 'pg';
import { ReactText } from 'react';
import { SqlExecReponseType } from '../../sessions/DbSession';

export type DiskUsageStateType = {
  totalTableData?: SqlExecReponseType<QueryResultRow[]>;
  tableData?: SqlExecReponseType<QueryResultRow[]>;
  indexData?: SqlExecReponseType<QueryResultRow[]>;
};

export type CustomTooltipProps = {
  active: boolean;
  payload: {
    name: ReactText;
    value: ReactText;
  }[];
};
