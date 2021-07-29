/* eslint-disable no-console */
import React, { useRef, useEffect } from 'react';
import electron from 'electron';
import { v4 as uuidv4 } from 'uuid';
import DbSession from '../../sessions/DbSession';
import PgSession from '../../sessions/PgSession';
import RecentConnections from './RecentConnections';
import Telemetry from '../../services/telemetry';
import { useAppState } from '../../state/AppProvider';
import Utils from '../utils/utils';

// import icon from '../../assets/icon.svg';

interface LoginProps {
  setSession: (v: DbSession) => void;
}

const updateRecentsLS = (connectionString: string) => {
  if (!connectionString || connectionString === '') return;
  let newValues = [connectionString];
  const currentValues = Utils.getRecentConnections();
  if (currentValues) {
    const newSet = new Set([...currentValues]);
    newSet.add(connectionString);
    newValues = Array.from(newSet);
  }
  // todo implement labels
  if (newValues)
    localStorage.setItem('RECENT_CONNECTIONS', JSON.stringify(newValues));
};

const Login: React.FC = () => {
  const [connectionString, setConnectionString] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = React.useState<any>();
  const mounted = useRef(false);
  const [, dispatch] = useAppState();

  React.useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    Telemetry.init();
  }, []);

  const send = async (override?: string) => {
    // electron.ipcRenderer.send('ping', 'a string', 10);
    const conn = override ?? connectionString;
    if (override) setConnectionString(override);
    if (conn) {
      setLoading(true);
      const response = await electron.ipcRenderer.invoke(
        'connect',
        { connectionString: conn, uuid: uuidv4() },
        10
      );
      if (response?.status === 'CONNECTED') {
        dispatch({
          type: 'SET_SESSION',
          payload: new PgSession(response?.uuid),
        });
        Telemetry.connect();
        updateRecentsLS(conn);
      } else {
        setError({ status: 'FAILED', error: response?.error?.message });
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    // alert('test');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).send = send;
  }, []);
  return (
    <div className="bg-gray-800 w-screen h-screen flex">
      <div className="bg-gray-900 md:w-1/12 pt-8 flex">
        <span
          role="img"
          aria-label="app-icon"
          className="pl-6 pr-6 font-mono text-gray-200 text-2xl"
        >
          ⚡️
        </span>
      </div>
      <div className=" w-11/12 flex flex-row">
        <div className="p-4 mt-24 items-end w-full">
          <h1 className="text-2xl">DB Lens</h1>
          <input
            className="w-full bg-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 flex-grow bg-transparent focus:border-b-0 border-b-2 border-gray-700 mt-6"
            value={connectionString}
            placeholder="postgresql://postgres:postgres@127.0.0.1/postgres"
            onChange={(e) => setConnectionString(e?.target?.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          {error && (
            <div className="bg-red-700 my-2 w-full p-2 rounded-lg border-black border">
              {error?.error || "Couldn't connect to the database"}
            </div>
          )}
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
              } ${!loading && 'hover:shadow-xl'}`}
            >
              {/* <span role="img" aria-label="books" className="pr-2">
                ⚡️
              </span> */}
              {loading ? 'Loading...' : 'Connect DB'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
