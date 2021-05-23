import electron from 'electron';
import { SqlExecReponseType } from '../../sessions/DbSession';

const executeSQL = async (
  sql: string,
  session: string
): Promise<SqlExecReponseType> => {
  const response = await electron.ipcRenderer.invoke(
    'SQL_EXECUTE',
    {
      sql,
      test: 'test',
      uuid: session,
    },
    10
  );
  return response as SqlExecReponseType;
};

export default {
  executeSQL,
};
