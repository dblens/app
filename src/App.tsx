import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import electron from 'electron';
import icon from '../assets/icon.svg';
import './App.global.css';

const Hello = () => {
  const [pgUrl, setPgUrl] = React.useState<string>();

  React.useEffect(() => {
    electron.ipcRenderer.on('connected', (event, params) => {
      console.log('CONNECTED', event, params);
    });
  }, []);
  const send = () => {
    console.log('>>');
    electron.ipcRenderer.send('ping', 'a string', 10);
    if (pgUrl) electron.ipcRenderer.send('connect', pgUrl, 10);
  };
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <input onChange={(e) => setPgUrl(e?.target?.value)}></input>
      <div className="Hello">
        <button type="button" onClick={send}>
          <span role="img" aria-label="books">
            📚
          </span>
          Read our docs
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

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
