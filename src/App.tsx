import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.global.css';
import Login from './components/Login';
import MainScreen from './components/MainScreen';
import { useAppState } from './state/AppProvider';

export default function App() {
  const [state] = useAppState();
  const { session } = state;

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          render={() => {
            // <Redirect to="/dashboard" />
            return session ? <MainScreen {...{ session }} /> : <Login />;
          }}
        />
        <Route path="/dashboard" render={() => <h1>Test</h1>} />
      </Switch>
    </Router>
  );
}
