import React, { useState, useEffect } from 'react';
import electron from 'electron';
import { IpcRendererEvent } from 'electron/main';

const MainScreen = ({ session = '' }) => {
  const [state, setstate] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [sql, setSql] = useState('SELECT NOW()');

  const post = async () => {
    setLoading(true);
    const { status, result } = await electron.ipcRenderer.invoke(
      'SQL_EXECUTE',
      {
        query: sql,
        test: 'test',
        uuid: session,
      },
      10
    );
    setLoading(false);
    if (status === 'SUCCESS') {
      setstate(result);
    }
    console.log(result);
  };

  return (
    <div>
      Connected
      <br />
      <input value={sql} onChange={(e) => setSql(e?.target?.value)} />
      <br />
      <button onClick={post} type="button" disabled={loading}>
        {loading ? 'loading...' : 'Test'}
      </button>
      <br />
      <pre>{state && JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export default MainScreen;
