import React from 'react';

import { DBContextProvider } from './DBContext';
import CsvUploader from './CsvUploader';
import SQLEditor from './SQLEditor';

import './App.css';

const App = () => (
  <DBContextProvider>
    <div className="App">
      <CsvUploader />
      <SQLEditor />
    </div>
  </DBContextProvider>
);

export default App;
