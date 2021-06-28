/* eslint-disable no-console */
import React from 'react';
import electron from 'electron';
import { v4 as uuidv4 } from 'uuid';
import DbSession from '../../sessions/DbSession';
import PgSession from '../../sessions/PgSession';
import RecentConnections from './RecentConnections';

// import icon from '../../assets/icon.svg';

interface LoginProps {
  setSession: (v: DbSession) => void;
}

const updateRecentsLS = (connectionString: string) => {
  if (!connectionString || connectionString === '') return;
  let newValues = [connectionString];
  const currentValues = localStorage.getItem('RECENT_CONNECTIONS');
  if (currentValues) {
    const newSet = new Set([...currentValues]);
    newSet.add(connectionString);
    newValues = Array.from(newSet);
  }
  // todo implement labels
  if (newValues)
    localStorage.setItem('RECENT_CONNECTIONS', JSON.stringify(newValues));
};

const Login: React.FC<LoginProps> = ({ setSession }: LoginProps) => {
  const [connectionString, setConnectionString] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    electron.ipcRenderer.on('CONNECT_RESP', (_, params) => {
      setLoading(false);
      if (params?.status === 'CONNECTED') {
        // console.log('CONNECTED', params);
        setSession(new PgSession(params?.uuid));
      }
      // TODO else show error message
    });
  }, []);
  const send = (override?: string) => {
    // electron.ipcRenderer.send('ping', 'a string', 10);
    const conn = override ?? connectionString;
    if (conn) {
      setLoading(true);
      electron.ipcRenderer.send(
        'connect',
        { connectionString: conn, uuid: uuidv4() },
        10
      );
      updateRecentsLS(connectionString);
    }
  };
  return (
    <div className="bg-gray-800 w-screen h-screen flex text-gray-800">
      <div className="bg-gray-800 md:w-1/12 pt-8 flex">
        <span role="img" aria-label="app-icon" className="pl-6 pr-6">
          ⚡️
        </span>
      </div>
      <div className="bg-gray-100 w-11/12 flex flex-row">
        <div className="p-4 mt-24 text-gray-800 items-end w-full">
          <h1 className="text-2xl text-gray-800">DB Lens</h1>
          <input
            className="w-full bg-gray-200 text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 flex-grow bg-transparent focus:border-b-0 border-b-2 border-gray-700 mt-6"
            value={connectionString}
            placeholder="postgresql://postgres:postgres@127.0.0.1/postgres"
            onChange={(e) => setConnectionString(e?.target?.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          <RecentConnections
            send={send}
            setConnectionString={setConnectionString}
          />

          <div className="mt-6 w-full">
            <button
              type="button"
              onClick={() => send()}
              disabled={loading}
              className={`bg-gray-700 p-2 text-gray-200 ${
                loading && 'cursor-wait'
              } ${!loading && 'hover:bg-gray-800 hover:text-gray-100'}`}
            >
              <span role="img" aria-label="books">
                ⚡️
              </span>
              {loading ? 'Loading...' : 'Connect DB'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
