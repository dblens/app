import electron from 'electron';

const executeSQL = async (sql: string, session: string) => {
  const { status, result } = await electron.ipcRenderer.invoke(
    'SQL_EXECUTE',
    {
      sql,
      test: 'test',
      uuid: session,
    },
    10
  );
  return { status, result };
};

export default {
  executeSQL,
};
