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

export const niceBytes = (x: number) => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0;
  let n = parseInt(x, 10) || 0;
  // eslint-disable-next-line no-plusplus
  while (n >= 1024 && ++l) {
    n /= 1024;
  }
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
};
