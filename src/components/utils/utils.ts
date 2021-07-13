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
const getRecentConnections = () => {
  try {
    const mem = localStorage.getItem('RECENT_CONNECTIONS') ?? '';
    return JSON.parse(mem);
  } catch (error) {
    return [];
  }
};

const camelcaseToNormalString = (text = ''): string => {
  try {
    const result = text.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  } catch {
    return '';
  }
};

export default {
  executeSQL,
  getRecentConnections,
  camelcaseToNormalString,
};
