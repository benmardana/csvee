import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Root from './Root';
import { DBContextProvider } from './DBContext';

ReactDOM.render(
  <React.StrictMode>
    <DBContextProvider>
      <Root />
    </DBContextProvider>
  </React.StrictMode>,
  document.getElementById('app')
);
