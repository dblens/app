import utils from '../components/utils/utils';
import DbSession, { SqlExecReponseType } from './DbSession';

class PgSession implements DbSession {
  id: string;

  constructor(message: string) {
    this.id = message;
  }

  executeSQL = (sql: string): Promise<SqlExecReponseType> =>
    new Promise<SqlExecReponseType>((resolve, reject) => {
      utils.executeSQL(sql, this.id).then(resolve).catch(reject);
    });

  // TODO
  // getTableList = (): Promise<SqlExecReponseType> =>{}
  // getTableData = (schema,tablename,offset,size): Promise<SqlExecReponseType> =>{}
  // getViewData = (schema,tablename,offset,size): Promise<SqlExecReponseType> =>{}
}

export default PgSession;
