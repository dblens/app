import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { AppProvider } from './state/AppProvider';

render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('root')
);
