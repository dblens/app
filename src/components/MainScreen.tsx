import React, { useState, useEffect } from 'react';
import electron from 'electron';

const MainScreen = ({ session = '' }) => {
  const [state, setstate] = useState();
  const [sql, setSql] = useState('SELECT NOW()');
  useEffect(() => {
    electron.ipcRenderer.on('SQL_EXECUTE_RESP', (event, params) => {
      console.log('RESPONDED', params);
      if (params?.status === 'SUCCESS') {
        setstate(params?.result);
      }
    });
  }, []);
  const post = () =>
    electron.ipcRenderer.send(
      'SQL_EXECUTE',
      {
        query: sql,
        test: 'test',
        uuid: session,
      },
      10
    );

  return (
    <div>
      Connected
      <br />
      <input value={sql} onChange={(e) => setSql(e?.target?.value)} />
      <button onClick={post}>Test</button>
      <br />
      <pre>{state && JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default MainScreen;
