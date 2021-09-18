import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import Root from './Root';
import { DBContextProvider } from './components/DBContext';

ReactDOM.render(
  <React.StrictMode>
    <DBContextProvider>
      <Root />
    </DBContextProvider>
  </React.StrictMode>,
  document.getElementById('app')
);
