import React from 'react';
import electron from 'electron';
import { v4 as uuidv4 } from 'uuid';

// import icon from '../../assets/icon.svg';

interface LoginProps {
  setSession: () => void;
}

const Login: React.FC<LoginProps> = ({ setSession }) => {
  const [connectionString, setConnectionString] = React.useState<string>(
    'postgresql://postgres:postgrespassword@127.0.0.1/postgres'
  );
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    electron.ipcRenderer.on('CONNECT_RESP', (event, params) => {
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
      <div className="Hello">
        {/* <img width="200px" alt="icon" src={icon} /> */}
      </div>
      <h1>electron-react-boilerplate</h1>
      <input
        value={connectionString}
        onChange={(e) => setConnectionString(e?.target?.value)}
      ></input>
      <div className="Hello">
        <button type="button" onClick={send} disabled={loading}>
          <span role="img" aria-label="books">
            📚
          </span>
          Connect DB
        </button>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default Login;
