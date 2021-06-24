/* eslint-disable no-console */
import React, { useRef, useEffect } from 'react';
import electron from 'electron';
import DbSession from '../../sessions/DbSession';
import PgSession from '../../sessions/PgSession';

// import icon from '../../assets/icon.svg';

interface LoginProps {
  setSession: (v: DbSession) => void;
}

const Login: React.FC<LoginProps> = ({ setSession }: LoginProps) => {
  const [connectionString, setConnectionString] = React.useState<string>(
    'postgresql://postgres:postgres@127.0.0.1/postgres'
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    electron.ipcRenderer.on('CONNECT_RESP', (_, params) => {
      setLoading(false);
      if (params?.status === 'CONNECTED') {
        // console.log('CONNECTED', params);
        setSession(new PgSession(params?.uuid));
        localStorage.setItem(
          'lastConnectedUUID',
          JSON.stringify({
            connectionString: params?.connectionString,
            uuid: params?.uuid,
            at: new Date(),
          })
        );
      }
      // TODO else show error message
    });
  }, []);

  const mounted = useRef(false);

  const send = (override?: string) => {
    // electron.ipcRenderer.send('ping', 'a string', 10);

    if (connectionString) {
      setLoading(true);
      // todo change this also to invoke
      electron.ipcRenderer.send(
        'connect',
        {
          connectionString: override ?? connectionString,
          uuid: new URL(window.location.href).searchParams.get('uuid'),
        },
        10
      );
    }
  };
  useEffect(() => {
    console.log('storage>>');
    if (mounted.current) return;
    mounted.current = true;
    console.log('storage>>');
    const storage = JSON.parse(localStorage.getItem('lastConnectedUUID') ?? '');
    console.log(storage);
    if (
      storage?.uuid === new URL(window.location.href).searchParams.get('uuid')
    ) {
      setConnectionString(storage?.connectionString);
      send(storage?.connectionString);
    }
  }, []);

  return (
    <div className="bg-gray-800 w-screen h-screen flex text-gray-800">
      <div className="bg-gray-800 md:w-1/12 pt-8 flex">
        <span role="img" aria-label="app-icon" className="pl-6 pr-6">
          ⚡️
        </span>
      </div>
      <div className="bg-gray-100 w-11/12 flex flex-row">
        <div className="p-4 mt-24 text-gray-800 items-end w-full">
          <h1 className="text-2xl text-gray-800">DB View</h1>
          <input
            className="w-full bg-gray-200 text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 flex-grow bg-transparent focus:border-b-0 border-b-2 border-gray-700 mt-6"
            value={connectionString}
            onChange={(e) => setConnectionString(e?.target?.value)}
          />
          <div className="mt-6">
            <button
              type="button"
              onClick={() => send()}
              disabled={loading}
              className="bg-gray-700 p-2 text-gray-200 hover:bg-gray-800 hover:text-gray-100"
            >
              <span role="img" aria-label="books">
                ⚡️
              </span>
              {loading ? 'Connecting...' : 'Connect DB'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
