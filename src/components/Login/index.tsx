/* eslint-disable no-console */
import React from 'react';
import electron from 'electron';
import { v4 as uuidv4 } from 'uuid';

// import icon from '../../assets/icon.svg';

interface LoginProps {
  setSession: (v: string) => void;
}

const Login: React.FC<LoginProps> = ({ setSession }: LoginProps) => {
  const [connectionString, setConnectionString] = React.useState<string>(
    'postgresql://postgres:postgrespassword@127.0.0.1/postgres'
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    electron.ipcRenderer.on('CONNECT_RESP', (_, params) => {
      setLoading(false);
      console.log('CONNECTED', params);
      setSession(params?.uuid);
    });
  }, []);
  const send = () => {
    console.log('>>');
    // electron.ipcRenderer.send('ping', 'a string', 10);

    if (connectionString) {
      setLoading(true);
      electron.ipcRenderer.send(
        'connect',
        { connectionString, uuid: uuidv4() },
        10
      );
    }
  };
  return (
    <div>
      <h1>DB View</h1>
      <input
        width={150}
        value={connectionString}
        onChange={(e) => setConnectionString(e?.target?.value)}
      />
      <div className="Hello">
        <button type="button" onClick={send} disabled={loading}>
          <span role="img" aria-label="books">
            ⚡️
          </span>
          Connect DB
        </button>
      </div>
    </div>
  );
};

export default Login;
