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
  );
}
