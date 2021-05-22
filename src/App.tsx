import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import './App.global.css';
import Login from './components/Login';
import MainScreen from './components/MainScreen';

export default function App() {
  const [session, setSession] = useState<string>();
  return (
    <div className="bg-gray-800 w-screen h-screen flex text-gray-800">
      <div className="bg-gray-800 md:w-1/12 pt-8 flex">
        <span role="img" aria-label="app-icon" className="pl-6 pr-6">
          ⚡️
        </span>
      </div>
      <div className="bg-gray-100 w-11/12 flex flex-row">
        <Router>
          <Switch>
            <Route
              path="/"
              render={() => {
                console.log(session);
                // <Redirect to="/dashboard" />
                return session ? (
                  <MainScreen {...{ session }} />
                ) : (
                  <Login {...{ setSession }} />
                );
              }}
            />
            <Route path="/dashboard" render={() => <h1>Test</h1>} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}
